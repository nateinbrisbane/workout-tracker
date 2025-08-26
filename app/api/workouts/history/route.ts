import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const workouts = await prisma.workout.findMany({
      orderBy: {
        date: 'desc',
      },
    })

    // Group workouts by UTC date - this must match how we query in /api/workouts
    const workoutsByDate = workouts.reduce((acc, workout) => {
      // Extract the UTC date part from the stored timestamp
      // This ensures consistency with how we query workouts by date
      const workoutDate = new Date(workout.date)
      const year = workoutDate.getUTCFullYear()
      const month = String(workoutDate.getUTCMonth() + 1).padStart(2, '0')
      const day = String(workoutDate.getUTCDate()).padStart(2, '0')
      const dateKey = `${year}-${month}-${day}` // YYYY-MM-DD in UTC
      
      if (!acc[dateKey]) {
        acc[dateKey] = {
          workouts: [],
          exercises: new Set(),
        }
      }
      
      acc[dateKey].workouts.push(workout)
      acc[dateKey].exercises.add(workout.exercise)
      
      return acc
    }, {} as Record<string, any>)

    // Transform to the expected format and sort by date descending
    const workoutDays = Object.entries(workoutsByDate)
      .map(([dateKey, day]: [string, any]) => ({
        date: dateKey, // YYYY-MM-DD format for URL compatibility
        workoutCount: day.workouts.length,
        exercises: Array.from(day.exercises),
      }))
      .sort((a, b) => b.date.localeCompare(a.date)) // Sort by date descending

    return NextResponse.json(workoutDays)
  } catch (error: any) {
    console.error('Error fetching workout history:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}