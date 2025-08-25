import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const workoutTypes = await prisma.workoutType.findMany({
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json(workoutTypes)
  } catch (error: any) {
    console.error('Error fetching workout types:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name } = body

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    const workoutType = await prisma.workoutType.create({
      data: {
        name: name.trim(),
      },
    })

    return NextResponse.json(workoutType, { status: 201 })
  } catch (error: any) {
    console.error('Error creating workout type:', error)
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: 'Workout type already exists' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}