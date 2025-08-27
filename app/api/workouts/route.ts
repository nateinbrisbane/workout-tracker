import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    console.log('GET /api/workouts - User ID:', session.user.id)

    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')

    if (!date) {
      return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 })
    }

    // Get all workouts for the current user - we'll filter in memory to avoid timezone issues
    const allWorkouts = await prisma.workout.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'asc',
      },
    })
    
    console.log(`User ${session.user.id}: Date filtering for: ${date}, found ${allWorkouts.length} total workouts for this user`)
    
    // Filter workouts by comparing UTC date components directly
    // Since we store dates at UTC midnight, we can extract date directly
    const workouts = allWorkouts.filter(w => {
      const utcDate = new Date(w.date)
      const year = utcDate.getUTCFullYear()
      const month = String(utcDate.getUTCMonth() + 1).padStart(2, '0')
      const day = String(utcDate.getUTCDate()).padStart(2, '0')
      const dateStr = `${year}-${month}-${day}`
      
      return dateStr === date
    })
    
    console.log(`Found ${workouts.length} workouts for ${date}`)

    // Then get all workout types (global and user-specific) to map their properties
    const workoutTypes = await prisma.workoutType.findMany({
      where: {
        OR: [
          { isGlobal: true },
          { userId: session.user.id }
        ]
      }
    })
    const typeMap = new Map(workoutTypes.map(type => [type.name, type]))

    // Add workout type details to workout data
    const workoutsWithDetails = workouts.map(workout => {
      const workoutType = typeMap.get(workout.exercise)
      return {
        ...workout,
        icon: workoutType?.icon || '💪',
        category: workoutType?.category || 'weight',
        unit: workoutType?.unit || 'kg',
        isBodyWeight: workoutType?.isBodyWeight || false
      }
    })

    console.log(`Found ${workouts.length} workouts for ${date}`)
    return NextResponse.json(workoutsWithDetails)
  } catch (error: any) {
    console.error('Error fetching workouts:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('POST /api/workouts - User ID:', session.user.id)
    
    const body = await request.json()
    console.log('Request body:', body)
    const { exercise, weight, reps, date } = body

    // Create workout date - store in a way that preserves the local date
    let workoutDate: Date
    if (date) {
      // Date is in local format (YYYY-MM-DD) 
      // Store it as UTC midnight so date extraction is straightforward
      const [year, month, day] = date.split('-').map(Number)
      // Create date at UTC midnight for the given date
      workoutDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0))
    } else {
      // Fallback to current timestamp if no date provided
      workoutDate = new Date()
    }

    console.log('Creating workout with:', { exercise, weight, reps, date: workoutDate.toISOString(), userId: session.user.id })
    
    const workout = await prisma.workout.create({
      data: {
        exercise,
        weight,
        reps,
        date: workoutDate,
        userId: session.user.id
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