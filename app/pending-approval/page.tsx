'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { signOut } from 'next-auth/react'

export default function PendingApprovalPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [userStatus, setUserStatus] = useState<string>('pending')
  
  useEffect(() => {
    // Check user status periodically
    const checkStatus = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch('/api/user/status')
          if (response.ok) {
            const data = await response.json()
            setUserStatus(data.status)
            
            if (data.status === 'approved') {
              router.push('/')
            } else if (data.status === 'rejected') {
              router.push('/register?error=rejected')
            }
          }
        } catch (error) {
          console.error('Error checking status:', error)
        }
      }
    }

    checkStatus()
    // Check every 10 seconds
    const interval = setInterval(checkStatus, 10000)
    
    return () => clearInterval(interval)
  }, [session, router])

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/login' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Registration Pending
          </h1>
          <p className="text-gray-600 mb-6">
            Your account is waiting for admin approval
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Account:</strong> {session?.user?.email || 'Loading...'}
            </p>
            <p className="text-sm text-blue-800 mt-1">
              <strong>Status:</strong> {userStatus === 'pending' ? 'Awaiting Approval' : userStatus}
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              You'll automatically be redirected once your account is approved.
              This page checks for updates every 10 seconds.
            </p>
            
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="w-full"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}