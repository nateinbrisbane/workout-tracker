import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'

export async function GET() {
  try {
    const workouts = await prisma.workout.findMany({
      orderBy: {
        date: 'desc',
      },
    })

    // Group workouts by date
    const workoutsByDate = workouts.reduce((acc, workout) => {
      const dateKey = format(new Date(workout.date), 'yyyy-MM-dd')
      
      if (!acc[dateKey]) {
        acc[dateKey] = {
          date: dateKey,
          workouts: [],
          exercises: new Set(),
        }
      }
      
      acc[dateKey].workouts.push(workout)
      acc[dateKey].exercises.add(workout.exercise)
      
      return acc
    }, {} as Record<string, any>)

    // Transform to the expected format
    const workoutDays = Object.values(workoutsByDate).map((day: any) => ({
      date: day.date,
      workoutCount: day.workouts.length,
      exercises: Array.from(day.exercises),
    }))

    return NextResponse.json(workoutDays)
  } catch (error: any) {
    console.error('Error fetching workout history:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}