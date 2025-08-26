import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const workouts = await prisma.workout.findMany({
      orderBy: {
        date: 'desc',
      },
    })

    // Group workouts by UTC date, but keep the actual date for timezone handling
    const workoutsByDate = workouts.reduce((acc, workout) => {
      // Use UTC date for grouping to maintain consistency
      const utcDate = new Date(workout.date)
      const dateKey = utcDate.toISOString().split('T')[0] // YYYY-MM-DD in UTC
      
      if (!acc[dateKey]) {
        acc[dateKey] = {
          date: workout.date, // Keep the actual UTC datetime for frontend timezone conversion
          workouts: [],
          exercises: new Set(),
        }
      }
      
      acc[dateKey].workouts.push(workout)
      acc[dateKey].exercises.add(workout.exercise)
      
      return acc
    }, {} as Record<string, any>)

    // Transform to the expected format
    const workoutDays = Object.entries(workoutsByDate).map(([dateKey, day]: [string, any]) => ({
      date: dateKey, // Use the YYYY-MM-DD key for URL compatibility
      workoutCount: day.workouts.length,
      exercises: Array.from(day.exercises),
    }))

    return NextResponse.json(workoutDays)
  } catch (error: any) {
    console.error('Error fetching workout history:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}