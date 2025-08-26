import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getLocalDateFromUTC } from '@/lib/date-utils'

export async function GET() {
  try {
    const workouts = await prisma.workout.findMany({
      orderBy: {
        date: 'desc',
      },
    })

    // Group workouts by LOCAL date - this must match how we query in /api/workouts
    const workoutsByDate = workouts.reduce((acc, workout) => {
      // Extract the LOCAL date from the stored timestamp
      // This ensures consistency with how users view dates
      const dateKey = getLocalDateFromUTC(workout.date) // YYYY-MM-DD in local timezone
      
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