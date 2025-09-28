const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function setupHealthSystem() {
    console.log('🏥 Configurando sistema de salud de MiRancho360...\n');
    
    try {
        // Verificar variables de entorno
        const supabaseUrl = process.env.VITE_SUPABASE_URL;
        const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
        
        if (!supabaseUrl || !supabaseKey) {
            console.error('❌ Error: Faltan variables de entorno de Supabase');
            console.log('   Asegúrate de tener VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en tu archivo .env');
            return;
        }
        
        // Importar Supabase dinámicamente
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        // Verificar conexión
        const { data: testData, error: testError } = await supabase
            .from('usuarios')
            .select('count')
            .limit(1);
            
        if (testError) {
            console.error('❌ Error de conexión a Supabase:', testError.message);
            return;
        }
        
        console.log('✅ Conexión a Supabase establecida\n');
        
        // Leer y ejecutar el archivo SQL corregido
        const sqlFilePath = path.join(__dirname, '..', 'database', 'migrations', '002_health_system_fixed.sql');
        
        if (!fs.existsSync(sqlFilePath)) {
            console.error(`❌ No se encontró el archivo SQL: ${sqlFilePath}`);
            return;
        }
        
        const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
        console.log('📄 Ejecutando migración del sistema de salud...\n');
        
        // Ejecutar el SQL
        const { data, error } = await supabase.rpc('exec_sql', { 
            sql: sqlContent 
        });
        
        if (error) {
            // Si no existe la función exec_sql, intentar ejecutar por partes
            console.log('⚠️  Función exec_sql no disponible, ejecutando por partes...\n');
            
            // Dividir el SQL en statements individuales
            const statements = sqlContent
                .split(';')
                .map(stmt => stmt.trim())
                .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
            
            console.log(`📝 Ejecutando ${statements.length} statements SQL...\n`);
            
            let successCount = 0;
            let errorCount = 0;
            
            for (let i = 0; i < statements.length; i++) {
                const statement = statements[i] + ';';
                
                try {
                    // Para statements que no devuelven datos
                    if (statement.includes('CREATE TABLE') || 
                        statement.includes('CREATE INDEX') || 
                        statement.includes('ALTER TABLE') ||
                        statement.includes('CREATE POLICY') ||
                        statement.includes('CREATE TRIGGER') ||
                        statement.includes('CREATE OR REPLACE FUNCTION')) {
                        
                        const { error: execError } = await supabase.rpc('exec_ddl', { 
                            ddl: statement 
                        });
                        
                        if (execError) {
                            throw execError;
                        }
                    } else {
                        // Para INSERT y otros statements
                        const { error: execError } = await supabase.rpc('exec_dml', { 
                            dml: statement 
                        });
                        
                        if (execError) {
                            throw execError;
                        }
                    }
                    
                    successCount++;
                    if (statement.includes('CREATE TABLE')) {
                        const tableName = statement.match(/CREATE TABLE (?:IF NOT EXISTS )?(\w+)/)?.[1];
                        console.log(`  ✅ Tabla creada: ${tableName}`);
                    } else if (statement.includes('INSERT INTO productos_salud')) {
                        console.log(`  ✅ Datos iniciales insertados en productos_salud`);
                    }
                    
                } catch (execError) {
                    console.log(`  ⚠️  Statement ${i + 1}: ${execError.message}`);
                    errorCount++;
                }
            }
            
            console.log(`\n📊 Resumen de ejecución:`);
            console.log(`  - Statements exitosos: ${successCount}`);
            console.log(`  - Statements con errores: ${errorCount}`);
            
        } else {
            console.log('✅ Migración ejecutada exitosamente');
        }
        
        // Verificar que las tablas se crearon correctamente
        console.log('\n🔍 Verificando tablas creadas...');
        
        const tablesToCheck = ['eventos_salud', 'recordatorios_salud', 'productos_salud'];
        
        for (const tableName of tablesToCheck) {
            const { data: tableData, error: tableError } = await supabase
                .from(tableName)
                .select('*')
                .limit(1);
                
            if (tableError) {
                console.log(`  ❌ Error verificando tabla ${tableName}: ${tableError.message}`);
            } else {
                console.log(`  ✅ Tabla ${tableName} disponible`);
            }
        }
        
        // Verificar productos iniciales
        const { data: productos, error: productosError } = await supabase
            .from('productos_salud')
            .select('count');
            
        if (!productosError && productos) {
            console.log(`\n📦 Productos de salud iniciales: ${productos.length || 'Sin contar'} registros`);
        }
        
        console.log('\n🎉 ¡Sistema de salud configurado exitosamente!');
        console.log('\n📋 Próximos pasos:');
        console.log('  1. Reinicia tu aplicación (npm run dev)');
        console.log('  2. Ve al módulo de Animales');
        console.log('  3. Selecciona un animal para ver su historial de salud');
        console.log('  4. Registra eventos de salud (vacunas, tratamientos, etc.)');
        console.log('  5. Revisa los recordatorios automáticos generados');
        
    } catch (error) {
        console.error('❌ Error durante la configuración:', error.message);
        console.log('\n🔧 Sugerencias de solución:');
        console.log('  1. Verifica tu conexión a internet');
        console.log('  2. Revisa las credenciales de Supabase en .env');
        console.log('  3. Asegúrate de que tienes permisos en la base de datos');
        console.log('  4. Si el problema persiste, ejecuta manualmente el SQL desde Supabase Dashboard');
    }
}

// Ejecutar solo si es llamado directamente
if (require.main === module) {
    setupHealthSystem();
}

module.exports = { setupHealthSystem };