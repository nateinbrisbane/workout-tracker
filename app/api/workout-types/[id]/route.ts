import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, icon, category, isBodyWeight, unit } = body

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    const updateData: any = {
      name: name.trim(),
    }
    
    // Only update fields if provided
    if (icon !== undefined) {
      updateData.icon = icon
    }
    if (category !== undefined) {
      updateData.category = category
    }
    if (isBodyWeight !== undefined) {
      updateData.isBodyWeight = isBodyWeight
    }
    if (unit !== undefined) {
      updateData.unit = unit
    }

    const workoutType = await prisma.workoutType.update({
      where: { id: params.id },
      data: updateData,
    })

    return NextResponse.json(workoutType)
  } catch (error: any) {
    console.error('Error updating workout type:', error)
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: 'Workout type already exists' }, { status: 409 })
    }
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'Workout type not found' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.workoutType.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting workout type:', error)
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'Workout type not found' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}