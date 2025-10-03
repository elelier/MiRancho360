<#
Doc checker for repository docs/ folder.
Checks:
 - relative Markdown links that resolve to files
 - presence of TODO/FIXME/XXX markers
 - trailing whitespace in lines

Usage:
  Open PowerShell in the repo root and run:
    PowerShell -NoProfile -ExecutionPolicy Bypass -File .\scripts\doc_check.ps1

Outputs simple lines prefixed with status: BROKEN/TODO/TRAIL.
#>

if (-not (Test-Path -Path 'docs')) {
    Write-Host "docs/ not found. Exiting."; exit 1
}

$errors = @()

Get-ChildItem -Path 'docs' -Recurse -Filter *.md | ForEach-Object {
    $file = $_.FullName
    try {
        $content = Get-Content -Raw -LiteralPath $file
    } catch {
        continue
    }
    $re = '\[.*?\]\((.*?)\)'
    $matches = [regex]::Matches($content, $re)
    foreach ($m in $matches) {
        $link = $m.Groups[1].Value.Trim()
        if ($link -match '^(http|https|mailto):') { continue }
        if ($link -match '^#') { continue }
        $linkClean = ($link -split '\?|#')[0]
        if ($linkClean -eq '') { continue }
        if ([System.IO.Path]::IsPathRooted($linkClean)) { $resolved = $linkClean } else { $resolved = Join-Path -Path $_.DirectoryName -ChildPath $linkClean }
        if (-not (Test-Path $resolved)) { $errors += ,@($file,$link,$resolved) }
    }
}

Write-Host '--- Link check results ---'
if ($errors.Count -eq 0) { Write-Host 'No relative link issues found.' } else { foreach ($e in $errors) { Write-Host "BROKEN: $($e[0]) -> $($e[1])  resolved:$($e[2])" } }

Write-Host "`n--- TODO/FIXME/XXX scan ---"
$todos = Select-String -Path 'docs/**/*.md' -Pattern 'TODO|FIXME|XXX' -SimpleMatch -List
if ($todos) { foreach ($t in $todos) { Write-Host "TODO: $($t.Path):$($t.LineNumber): $($t.Line.Trim())" } } else { Write-Host 'No TODO/FIXME/XXX found.' }

Write-Host "`n--- Trailing whitespace scan ---"
$trail = Select-String -Path 'docs/**/*.md' -Pattern '\s$' -AllMatches
if ($trail) { foreach ($t in $trail) { Write-Host "TRAIL: $($t.Path):$($t.LineNumber): trailing whitespace" } } else { Write-Host 'No trailing whitespace found.' }

Write-Host "`n--- Done ---"
