import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        status: true,
        role: true,
        approvedAt: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      status: user.status,
      role: user.role,
      approvedAt: user.approvedAt
    })
  } catch (error) {
    console.error('Error fetching user status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}