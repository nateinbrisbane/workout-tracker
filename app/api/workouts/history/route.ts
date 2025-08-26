import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get all workouts and return them
    // Let the client handle grouping by local date
    const workouts = await prisma.workout.findMany({
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