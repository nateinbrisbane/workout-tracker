import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Checking user and workout data...\n')
  
  // Find the user with email me@nathanli.net
  const user = await prisma.user.findUnique({
    where: { email: 'me@nathanli.net' },
    include: {
      workouts: {
        orderBy: { date: 'desc' },
        take: 5
      }
    }
  })
  
  if (user) {
    console.log('User found:')
    console.log('- ID:', user.id)
    console.log('- Email:', user.email)
    console.log('- Name:', user.name)
    console.log('- Created:', user.createdAt)
    console.log('\nRecent workouts for this user:')
    
    if (user.workouts.length > 0) {
      user.workouts.forEach(w => {
        console.log(`  - ${w.exercise}: ${w.weight}${w.weight > 0 ? 'kg' : ''} x ${w.reps} reps (${w.date.toISOString()})`)
      })
    } else {
      console.log('  No workouts found')
    }
  } else {
    console.log('User not found')
  }
  
  // Check all workouts in the system
  const allWorkouts = await prisma.workout.findMany({
    include: {
      user: true
    },
    orderBy: { date: 'desc' },
    take: 10
  })
  
  console.log('\n\nAll recent workouts in system:')
  console.log('Total workouts:', await prisma.workout.count())
  
  allWorkouts.forEach(w => {
    console.log(`- ${w.exercise}: ${w.weight}kg x ${w.reps} (User: ${w.user?.email || 'null'}, Date: ${w.date.toISOString()})`)
  })
  
  // Check for any workouts without a userId
  const orphanedWorkouts = await prisma.workout.count({
    where: { userId: null }
  })
  
  if (orphanedWorkouts > 0) {
    console.log(`\nWarning: Found ${orphanedWorkouts} workouts without a userId`)
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('Error:', e)
    await prisma.$disconnect()
    process.exit(1)
  })