import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting migration of existing data...')
  
  // Create a demo user for existing data
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      name: 'Demo User',
    },
  })
  
  console.log('Created/found demo user:', demoUser.id)
  
  // Update all workouts without a userId to belong to the demo user
  const workoutsUpdated = await prisma.workout.updateMany({
    where: {
      userId: null
    },
    data: {
      userId: demoUser.id
    }
  })
  
  console.log(`Updated ${workoutsUpdated.count} workouts to belong to demo user`)
  
  // Update all workout types without a userId to be global
  const workoutTypesUpdated = await prisma.workoutType.updateMany({
    where: {
      userId: null,
      isGlobal: false
    },
    data: {
      isGlobal: true
    }
  })
  
  console.log(`Updated ${workoutTypesUpdated.count} workout types to be global`)
  
  console.log('Migration completed successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('Migration failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })