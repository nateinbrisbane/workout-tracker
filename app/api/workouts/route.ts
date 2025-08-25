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
  } catch (error) {
    console.error('Error fetching workouts:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { exercise, weight, reps } = body

    const workout = await prisma.workout.create({
      data: {
        exercise,
        weight,
        reps,
        date: new Date(),
      },
    })

    return NextResponse.json(workout, { status: 201 })
  } catch (error) {
    console.error('Error creating workout:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}