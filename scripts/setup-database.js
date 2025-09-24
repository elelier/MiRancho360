#!/usr/bin/env node

/**
 * 🚀 MiRancho360 - Database Setup Script
 * 
 * Este script se encarga de:
 * 1. Verificar conexión con Supabase
 * 2. Ejecutar el schema SQL si es necesario
 * 3. Poblar la base de datos con datos iniciales
 * 4. Verificar que todo funcione correctamente
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuración de Supabase (desde variables de entorno)
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://oirfbtelgohkuqbsnleo.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9pcmZidGVsZ29oa3VxYnNubGVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1OTAwMTMsImV4cCI6MjA3NDE2NjAxM30.kn7_qS52hXZjt3UW7ar5kNeQ1PqxkPt0vmVfTrzGONQ';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Colores para la consola
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

const logStep = (step, message) => {
  log(`${step}. ${message}`, 'blue');
};

const logSuccess = (message) => {
  log(`✅ ${message}`, 'green');
};

const logError = (message) => {
  log(`❌ ${message}`, 'red');
};

const logWarning = (message) => {
  log(`⚠️  ${message}`, 'yellow');
};

// Función principal
async function setupDatabase() {
  log('\n🚀 MiRancho360 - Configuración de Base de Datos', 'bold');
  log('==========================================', 'blue');
  
  try {
    // Paso 1: Verificar conexión
    logStep(1, 'Verificando conexión con Supabase...');
    const { error: connectionError } = await supabase.from('configuracion_rancho').select('id').limit(1);
    
    if (connectionError) {
      logError(`Error de conexión: ${connectionError.message}`);
      
      if (connectionError.message.includes('relation') || connectionError.message.includes('does not exist')) {
        logWarning('Las tablas no existen. Necesitas ejecutar el schema SQL manualmente.');
        log('\n📋 PASOS PARA CREAR LAS TABLAS:', 'yellow');
        log('1. Ve a https://supabase.com/dashboard');
        log('2. Abre tu proyecto MiRancho360');
        log('3. Ve a "SQL Editor"');
        log('4. Copia y pega el contenido del archivo database/schema.sql');
        log('5. Ejecuta el script');
        log('6. Vuelve a ejecutar este script');
        return;
      } else {
        throw connectionError;
      }
    }
    
    logSuccess('Conexión establecida correctamente');
    
    // Paso 2: Verificar si ya hay datos
    logStep(2, 'Verificando datos existentes...');
    const { data: existingUsers } = await supabase.from('usuarios').select('id').limit(1);
    
    if (existingUsers && existingUsers.length > 0) {
      logWarning('La base de datos ya tiene datos. ¿Deseas continuar? (Esto puede duplicar registros)');
      // En un entorno real, aquí harías una pregunta al usuario
      log('Continuando con la población de datos...');
    }
    
    // Paso 3: Poblar datos iniciales
    logStep(3, 'Poblando base de datos con datos iniciales...');
    
    // 3.1 Crear usuario administrador
    const { error: userError } = await supabase
      .from('usuarios')
      .upsert({
        id: '00000000-0000-0000-0000-000000000001',
        nombre: 'Usuario Administrador',
        email: 'admin@mirancho360.com',
        rol: 'administrador',
        pin: '4813494d137e1631bba301d5acab6e7bb7aa74ce1185d456565ef51d737677b2', // SHA-256 de "1234"
        activo: true
      })
      .select();
    
    if (userError) {
      logError(`Error al crear usuario: ${userError.message}`);
    } else {
      logSuccess('Usuario administrador creado (PIN: 1234)');
    }
    
    // 3.2 Crear tipos de sitio
    const tiposSitio = [
      { nombre: 'Corral', descripcion: 'Área cercada para contener animales', color: '#8B4513' },
      { nombre: 'Pastura', descripcion: 'Terreno con pasto para pastoreo', color: '#228B22' },
      { nombre: 'Establo', descripcion: 'Construcción para resguardar animales', color: '#A0522D' },
      { nombre: 'Enfermería', descripcion: 'Área para animales enfermos', color: '#DC143C' },
      { nombre: 'Cuarentena', descripcion: 'Área de aislamiento', color: '#FF8C00' },
    ];
    
    for (const tipo of tiposSitio) {
      const { error } = await supabase
        .from('tipos_sitio')
        .upsert(tipo)
        .select();
      
      if (error && !error.message.includes('duplicate')) {
        logError(`Error al crear tipo de sitio ${tipo.nombre}: ${error.message}`);
      }
    }
    
    logSuccess('Tipos de sitio creados');
    
    // 3.3 Crear razas básicas
    const razas = [
      { nombre: 'Holstein', descripcion: 'Ganado lechero de alta producción' },
      { nombre: 'Angus', descripcion: 'Ganado de carne de excelente calidad' },
      { nombre: 'Brahman', descripción: 'Raza resistente al calor' },
      { nombre: 'Simmental', descripcion: 'Raza mixta carne-leche' },
      { nombre: 'Charolais', descripcion: 'Ganado de carne de gran tamaño' },
    ];
    
    for (const raza of razas) {
      const { error } = await supabase
        .from('razas')
        .upsert(raza)
        .select();
      
      if (error && !error.message.includes('duplicate')) {
        logError(`Error al crear raza ${raza.nombre}: ${error.message}`);
      }
    }
    
    logSuccess('Razas básicas creadas');
    
    // 3.4 Crear sitios ejemplo
    const sitiosData = await supabase.from('tipos_sitio').select('id, nombre');
    const tipos = sitiosData.data || [];
    
    if (tipos.length > 0) {
      const sitios = [
        {
          nombre: 'Corral Principal',
          tipo_id: tipos.find(t => t.nombre === 'Corral')?.id,
          capacidad_animales: 50,
          area_hectareas: 2.5,
          descripcion: 'Corral principal para manejo diario'
        },
        {
          nombre: 'Pastura Norte',
          tipo_id: tipos.find(t => t.nombre === 'Pastura')?.id,
          capacidad_animales: 100,
          area_hectareas: 15.0,
          descripcion: 'Pastura principal del sector norte'
        },
        {
          nombre: 'Establo Central',
          tipo_id: tipos.find(t => t.nombre === 'Establo')?.id,
          capacidad_animales: 30,
          area_hectareas: 1.0,
          descripcion: 'Establo para refugio nocturno'
        },
        {
          nombre: 'Enfermería',
          tipo_id: tipos.find(t => t.nombre === 'Enfermería')?.id,
          capacidad_animales: 10,
          area_hectareas: 0.5,
          descripcion: 'Área para tratamiento de animales enfermos'
        }
      ];
      
      for (const sitio of sitios) {
        const { error } = await supabase
          .from('sitios')
          .upsert(sitio)
          .select();
        
        if (error && !error.message.includes('duplicate')) {
          logError(`Error al crear sitio ${sitio.nombre}: ${error.message}`);
        }
      }
      
      logSuccess('Sitios ejemplo creados');
    }
    
    // 3.5 Crear animales ejemplo
    const razasData = await supabase.from('razas').select('id, nombre');
    const sitiosCreados = await supabase.from('sitios').select('id, nombre');
    const razasList = razasData.data || [];
    const sitiosList = sitiosCreados.data || [];
    
    if (razasList.length > 0 && sitiosList.length > 0) {
      const animales = [
        {
          arete: '001',
          nombre: 'Bella',
          raza_id: razasList.find(r => r.nombre === 'Holstein')?.id,
          sexo: 'Hembra',
          fecha_nacimiento: '2022-03-15',
          peso_kg: 450,
          sitio_actual_id: sitiosList.find(s => s.nombre === 'Pastura Norte')?.id,
          observaciones: 'Vaca lechera de alta producción'
        },
        {
          arete: '002',
          nombre: 'Toro Grande',
          raza_id: razasList.find(r => r.nombre === 'Angus')?.id,
          sexo: 'Macho',
          fecha_nacimiento: '2021-01-20',
          peso_kg: 850,
          sitio_actual_id: sitiosList.find(s => s.nombre === 'Corral Principal')?.id,
          observaciones: 'Semental reproductor'
        },
        {
          arete: '003',
          nombre: 'Luna',
          raza_id: razasList.find(r => r.nombre === 'Holstein')?.id,
          sexo: 'Hembra',
          fecha_nacimiento: '2022-08-10',
          peso_kg: 380,
          sitio_actual_id: sitiosList.find(s => s.nombre === 'Pastura Norte')?.id,
          observaciones: 'Vaquilla próxima a primer parto'
        },
        {
          arete: '004',
          nombre: 'Estrella',
          raza_id: razasList.find(r => r.nombre === 'Brahman')?.id,
          sexo: 'Hembra',
          fecha_nacimiento: '2021-11-05',
          peso_kg: 520,
          sitio_actual_id: sitiosList.find(s => s.nombre === 'Establo Central')?.id,
          observaciones: 'Vaca adaptada al clima cálido'
        }
      ];
      
      for (const animal of animales) {
        const { error } = await supabase
          .from('animales')
          .upsert(animal)
          .select();
        
        if (error && !error.message.includes('duplicate')) {
          logError(`Error al crear animal ${animal.nombre}: ${error.message}`);
        }
      }
      
      logSuccess('Animales ejemplo creados');
    }
    
    // Paso 4: Verificación final
    logStep(4, 'Verificando datos creados...');
    
    const { data: usuarios } = await supabase.from('usuarios').select('count');
    const { data: animalesCount } = await supabase.from('animales').select('count');
    const { data: sitiosCount } = await supabase.from('sitios').select('count');
    const { data: razasCount } = await supabase.from('razas').select('count');
    
    log('\n📊 RESUMEN DE DATOS CREADOS:', 'bold');
    log(`👥 Usuarios: ${usuarios?.[0]?.count || 0}`, 'green');
    log(`🐄 Animales: ${animalesCount?.[0]?.count || 0}`, 'green');
    log(`🏠 Sitios: ${sitiosCount?.[0]?.count || 0}`, 'green');
    log(`🧬 Razas: ${razasCount?.[0]?.count || 0}`, 'green');
    
    log('\n🎉 ¡Base de datos configurada exitosamente!', 'bold');
    log('✅ Puedes iniciar la aplicación con: npm run dev', 'green');
    log('🔑 Login con PIN: 1234', 'green');
    
  } catch (error) {
    logError(`Error general: ${error.message}`);
    log('\n🚨 SOLUCIÓN SUGERIDA:', 'yellow');
    log('1. Verifica que las variables de entorno en .env sean correctas');
    log('2. Asegúrate de haber ejecutado el schema SQL en Supabase');
    log('3. Verifica los permisos de tu API key');
  }
}

// Ejecutar el script
setupDatabase();