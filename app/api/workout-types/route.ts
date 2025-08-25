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
    console.log('POST /api/workout-types called')
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL)
    console.log('DATABASE_URL preview:', process.env.DATABASE_URL?.slice(0, 20) + '...')
    
    const body = await request.json()
    console.log('Request body:', body)
    const { name } = body

    if (!name || !name.trim()) {
      console.log('Name validation failed:', name)
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    console.log('Creating workout type with name:', name.trim())
    const workoutType = await prisma.workoutType.create({
      data: {
        name: name.trim(),
      },
    })

    console.log('Workout type created successfully:', workoutType)
    return NextResponse.json(workoutType, { status: 201 })
  } catch (error: any) {
    console.error('Error creating workout type:', error)
    console.error('Error details:', {
      message: error?.message,
      code: error?.code,
      meta: error?.meta,
      stack: error?.stack
    })
    
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: 'Workout type already exists' }, { status: 409 })
    }
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error?.message || 'Unknown error'
    }, { status: 500 })
  }
}