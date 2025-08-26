import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUTCDayBounds } from '@/lib/date-utils'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')

    if (!date) {
      return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 })
    }

    // Get UTC boundaries for the LOCAL date
    // This handles timezone conversion properly
    const { start: startOfTargetDay, end: endOfTargetDay } = getUTCDayBounds(date)

    console.log('Date filtering:', {
      input: date,
      localDate: date,
      start: startOfTargetDay.toISOString(),
      end: endOfTargetDay.toISOString()
    })

    // First get all workouts for the date
    const workouts = await prisma.workout.findMany({
      where: {
        date: {
          gte: startOfTargetDay,
          lte: endOfTargetDay,
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

    // Create a proper date for the workout
    let workoutDate: Date
    if (date) {
      // Date is in local format (YYYY-MM-DD)
      // Create a timestamp for the current moment on that local date
      const [year, month, day] = date.split('-').map(Number)
      workoutDate = new Date(year, month - 1, day)
      
      // Set to current time while preserving the date
      const now = new Date()
      workoutDate.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds())
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