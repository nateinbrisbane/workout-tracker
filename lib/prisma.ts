import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Debug environment variable
console.log('Prisma initialization - NODE_ENV:', process.env.NODE_ENV)
console.log('Prisma initialization - DATABASE_URL exists:', !!process.env.DATABASE_URL)
console.log('Prisma initialization - DATABASE_URL prefix:', process.env.DATABASE_URL?.substring(0, 20))

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma