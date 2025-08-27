'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function UnauthorizedContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-600">Access Denied</h1>
          <div className="mt-4 space-y-4">
            <p className="text-gray-600">
              Sorry, you are not authorized to access this application.
            </p>
            <p className="text-sm text-gray-500">
              Only approved users can access Lil Tracker. If you believe you should have access, 
              please contact the administrator.
            </p>
            {error === 'not_authorized' && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                <p className="text-sm text-red-800">
                  Your email address is not on the authorized list.
                </p>
              </div>
            )}
          </div>
          <div className="mt-8">
            <Link
              href="/login"
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              ← Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function UnauthorizedPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UnauthorizedContent />
    </Suspense>
  )
}