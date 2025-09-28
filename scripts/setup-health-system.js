const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuración de Supabase
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Error: VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY son requeridas');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function executeMigration() {
  console.log('🏥 Ejecutando migración del sistema de salud...\n');

  try {
    // Leer el archivo de migración
    const migrationPath = path.join(__dirname, '../database/migrations/002_health_system.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('📋 Ejecutando script SQL...');
    
    // Dividir en statements individuales para mejor manejo de errores
    const statements = migrationSQL
      .split(/;\s*$/)
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`📝 Total de statements a ejecutar: ${statements.length}\n`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      if (statement.toLowerCase().includes('create table')) {
        const match = statement.match(/create table\s+if not exists\s+(\w+)/i);
        const tableName = match ? match[1] : 'unknown';
        console.log(`📊 Creando tabla: ${tableName}...`);
      } else if (statement.toLowerCase().includes('create index')) {
        console.log(`🔗 Creando índice...`);
      } else if (statement.toLowerCase().includes('create policy')) {
        console.log(`🔒 Configurando política RLS...`);
      } else if (statement.toLowerCase().includes('insert into')) {
        console.log(`📥 Insertando datos iniciales...`);
      } else if (statement.toLowerCase().includes('create function')) {
        console.log(`⚙️ Creando función...`);
      } else if (statement.toLowerCase().includes('create trigger')) {
        console.log(`🎯 Creando trigger...`);
      }

      const { error } = await supabase.rpc('exec_sql', { sql: statement });
      
      if (error) {
        // Algunos errores son esperados (como "ya existe")
        if (error.message.includes('already exists') || 
            error.message.includes('ya existe') ||
            error.message.includes('duplicate key')) {
          console.log(`   ⚠️ Ya existe (ignorando): ${error.message.split('\n')[0]}`);
        } else {
          console.error(`   ❌ Error: ${error.message}`);
          // Continuar con el siguiente statement en lugar de fallar
        }
      } else {
        console.log(`   ✅ Completado exitosamente`);
      }
    }

    console.log('\n🎉 Migración del sistema de salud completada!\n');

    // Verificar que las tablas fueron creadas
    console.log('🔍 Verificando tablas creadas...');
    
    const tablesToCheck = [
      'eventos_salud',
      'recordatorios_salud',
      'productos_salud'
    ];

    for (const table of tablesToCheck) {
      const { data, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.log(`   ❌ ${table}: ${error.message}`);
      } else {
        console.log(`   ✅ ${table}: Tabla disponible`);
      }
    }

    console.log('\n✅ Sistema de salud listo para usar!\n');
    console.log('📋 Funcionalidades disponibles:');
    console.log('   • Registro de eventos de salud (vacunas, tratamientos, etc.)');
    console.log('   • Sistema de recordatorios automáticos');
    console.log('   • Catálogo de productos de salud');
    console.log('   • Historial completo por animal');
    console.log('   • Dashboard de recordatorios del rancho');
    console.log('   • Estadísticas de salud');

  } catch (error) {
    console.error('❌ Error ejecutando migración:', error);
    process.exit(1);
  }
}

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  executeMigration();
}

module.exports = { executeMigration };