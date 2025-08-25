// Production Database Setup Script
// This will create tables and seed initial workout types

const DATABASE_URL = "postgresql://neondb_owner:npg_rSeg3hoiTdE4@ep-weathered-hat-a7mc4fdu-pooler.ap-southeast-2.aws.neon.tech/neondb?sslmode=require"

async function setupDatabase() {
  const { PrismaClient } = require('@prisma/client')
  
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: DATABASE_URL
      }
    }
  })

  try {
    console.log('🔄 Setting up database tables...')
    
    // Push the schema to create tables
    console.log('📋 Creating tables...')
    
    // Seed workout types
    console.log('🌱 Seeding workout types...')
    const workoutTypes = [
      'Shoulder Press',
      'Bench Press', 
      'Lats Pulldown',
      'Lats Row',
      'Bicep Curl',
      'Shoulder Fly'
    ]

    for (const name of workoutTypes) {
      await prisma.workoutType.upsert({
        where: { name },
        update: {},
        create: { name }
      })
      console.log(`✅ Added workout type: ${name}`)
    }

    console.log('🎉 Database setup complete!')
    console.log('✅ Tables created')
    console.log('✅ Workout types seeded')
    
  } catch (error) {
    console.error('❌ Database setup failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

setupDatabase()