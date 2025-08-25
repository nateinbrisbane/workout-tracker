import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
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
  }

  console.log('Seeded workout types')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })