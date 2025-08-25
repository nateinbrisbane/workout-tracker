import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { startOfDay, endOfDay } from 'date-fns'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')

    if (!date) {
      return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 })
    }

    const targetDate = new Date(date)
    const workouts = await prisma.workout.findMany({
      where: {
        date: {
          gte: startOfDay(targetDate),
          lte: endOfDay(targetDate),
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    return NextResponse.json(workouts)
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
    const { exercise, weight, reps } = body

    console.log('Creating workout with:', { exercise, weight, reps })
    
    const workout = await prisma.workout.create({
      data: {
        exercise,
        weight,
        reps,
        date: new Date(),
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