import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const workoutTypes = [
    { name: 'Shoulder Press', icon: '🏋️', category: 'weight', unit: 'kg' },
    { name: 'Bench Press', icon: '🏋️', category: 'weight', unit: 'kg' },
    { name: 'Lats Pulldown', icon: '💪', category: 'weight', unit: 'kg' },
    { name: 'Lats Row', icon: '🚣', category: 'weight', unit: 'kg' },
    { name: 'Bicep Curl', icon: '💪', category: 'weight', unit: 'kg' },
    { name: 'Shoulder Fly', icon: '🦅', category: 'weight', unit: 'kg' }
  ]

  for (const type of workoutTypes) {
    // Check if workout type already exists
    const existing = await prisma.workoutType.findFirst({
      where: { 
        name: type.name,
        userId: null
      }
    })
    
    if (!existing) {
      await prisma.workoutType.create({
        data: {
          name: type.name,
          icon: type.icon,
          category: type.category,
          unit: type.unit,
          isGlobal: true,
          userId: null
        }
      })
    }
  }

  console.log('Seeded global workout types')
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