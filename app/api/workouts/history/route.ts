import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get all workouts for the current user
    // Let the client handle grouping by local date
    const workouts = await prisma.workout.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        date: 'desc',
      },
    })

    // Return raw workouts - client will group by local date
    return NextResponse.json(workouts)
  } catch (error: any) {
    console.error('Error fetching workout history:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}