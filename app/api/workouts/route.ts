import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')

    if (!date) {
      return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 })
    }

    // Simple date filtering - no UTC conversion needed
    // Create start and end of day in local time
    const [year, month, day] = date.split('-').map(Number)
    const startOfDay = new Date(year, month - 1, day, 0, 0, 0, 0)
    const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999)

    console.log('Date filtering:', {
      input: date,
      startOfDay: startOfDay.toString(),
      endOfDay: endOfDay.toString()
    })

    // Get all workouts for the date
    const workouts = await prisma.workout.findMany({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    // Then get all workout types to map icons
    const workoutTypes = await prisma.workoutType.findMany()
    const typeIconMap = new Map(workoutTypes.map(type => [type.name, type.icon]))

    // Add icons to workout data
    const workoutsWithIcons = workouts.map(workout => ({
      ...workout,
      icon: typeIconMap.get(workout.exercise) || '💪'
    }))

    console.log(`Found ${workouts.length} workouts for ${date}`)
    return NextResponse.json(workoutsWithIcons)
  } catch (error: any) {
    console.error('Error fetching workouts:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/workouts called')
    
    const body = await request.json()
    console.log('Request body:', body)
    const { exercise, weight, reps, date } = body

    // Create workout date - store exactly as local time, no UTC conversion
    let workoutDate: Date
    if (date) {
      // Date is in local format (YYYY-MM-DD)
      // Create a date in local time with current time of day
      const [year, month, day] = date.split('-').map(Number)
      const now = new Date()
      
      // Create date with local date and current local time
      workoutDate = new Date(year, month - 1, day, now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds())
    } else {
      // Fallback to current timestamp if no date provided
      workoutDate = new Date()
    }

    console.log('Creating workout with:', { exercise, weight, reps, date: workoutDate.toISOString() })
    
    const workout = await prisma.workout.create({
      data: {
        exercise,
        weight,
        reps,
        date: workoutDate,
      },
    })

    console.log('Workout created successfully:', workout)
    return NextResponse.json(workout, { status: 201 })
  } catch (error: any) {
    console.error('Error creating workout:', error)
    console.error('Error details:', {
      message: error?.message,
      code: error?.code,
      meta: error?.meta
    })
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error?.message || 'Unknown error'
    }, { status: 500 })
  }
}