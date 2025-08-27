import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const targetEmail = 'me@nathanli.net'
  
  console.log(`Starting migration to ${targetEmail}...`)
  
  try {
    // Find or create the target user
    let targetUser = await prisma.user.findUnique({
      where: { email: targetEmail }
    })
    
    if (!targetUser) {
      console.log(`User ${targetEmail} not found. Creating user...`)
      targetUser = await prisma.user.create({
        data: {
          email: targetEmail,
          name: 'Nathan Li',
        }
      })
      console.log(`Created user: ${targetUser.id}`)
    } else {
      console.log(`Found existing user: ${targetUser.id}`)
    }
    
    // Find the demo user
    const demoUser = await prisma.user.findUnique({
      where: { email: 'demo@example.com' }
    })
    
    if (demoUser) {
      // Migrate all workouts from demo user to target user
      const workoutsUpdated = await prisma.workout.updateMany({
        where: {
          userId: demoUser.id
        },
        data: {
          userId: targetUser.id
        }
      })
      
      console.log(`Migrated ${workoutsUpdated.count} workouts from demo user to ${targetEmail}`)
      
      // Also migrate any workouts with null userId
      const nullWorkoutsUpdated = await prisma.workout.updateMany({
        where: {
          userId: null
        },
        data: {
          userId: targetUser.id
        }
      })
      
      if (nullWorkoutsUpdated.count > 0) {
        console.log(`Migrated ${nullWorkoutsUpdated.count} workouts with null userId to ${targetEmail}`)
      }
    } else {
      console.log('Demo user not found, checking for orphaned workouts...')
      
      // Migrate any workouts with null userId
      const nullWorkoutsUpdated = await prisma.workout.updateMany({
        where: {
          userId: null
        },
        data: {
          userId: targetUser.id
        }
      })
      
      if (nullWorkoutsUpdated.count > 0) {
        console.log(`Migrated ${nullWorkoutsUpdated.count} orphaned workouts to ${targetEmail}`)
      }
    }
    
    // Migrate user-specific workout types from demo user
    if (demoUser) {
      const workoutTypesUpdated = await prisma.workoutType.updateMany({
        where: {
          userId: demoUser.id
        },
        data: {
          userId: targetUser.id
        }
      })
      
      if (workoutTypesUpdated.count > 0) {
        console.log(`Migrated ${workoutTypesUpdated.count} custom workout types to ${targetEmail}`)
      }
    }
    
    // Get final counts
    const totalWorkouts = await prisma.workout.count({
      where: { userId: targetUser.id }
    })
    
    const totalCustomTypes = await prisma.workoutType.count({
      where: { userId: targetUser.id }
    })
    
    const totalGlobalTypes = await prisma.workoutType.count({
      where: { isGlobal: true }
    })
    
    console.log('\n=== Migration Summary ===')
    console.log(`User ${targetEmail} now has:`)
    console.log(`- ${totalWorkouts} workouts`)
    console.log(`- ${totalCustomTypes} custom workout types`)
    console.log(`- ${totalGlobalTypes} global workout types available`)
    console.log('\nMigration completed successfully!')
    
  } catch (error) {
    console.error('Migration failed:', error)
    throw error
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('Migration error:', e)
    await prisma.$disconnect()
    process.exit(1)
  })