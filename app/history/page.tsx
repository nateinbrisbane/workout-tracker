'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Navigation } from '@/components/navigation'
import { format } from 'date-fns'
import { getLocalDateString } from '@/lib/date-utils'
import Link from 'next/link'

interface WorkoutDay {
  date: string
  workoutCount: number
  exercises: string[]
}

export default function History() {
  const [workoutDays, setWorkoutDays] = useState<WorkoutDay[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWorkoutHistory()
    
    // Refresh when the page gains focus (e.g., coming back from workout page)
    const handleFocus = () => {
      fetchWorkoutHistory()
    }
    
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  const fetchWorkoutHistory = async () => {
    try {
      // Add cache-busting to ensure fresh data
      const response = await fetch('/api/workouts/history', {
        cache: 'no-store'
      })
      if (response.ok) {
        const rawWorkouts = await response.json()
        console.log('Fetched raw workouts:', rawWorkouts)
        
        // Group workouts by LOCAL date on the client side
        const workoutsByDate = rawWorkouts.reduce((acc: any, workout: any) => {
          // Parse the stored date as UTC and extract the date components
          const utcDate = new Date(workout.date)
          // Since we store dates in local time but as UTC, we need to extract the UTC components
          const year = utcDate.getUTCFullYear()
          const month = String(utcDate.getUTCMonth() + 1).padStart(2, '0')
          const day = String(utcDate.getUTCDate()).padStart(2, '0')
          const localDateKey = `${year}-${month}-${day}`
          
          if (!acc[localDateKey]) {
            acc[localDateKey] = {
              workouts: [],
              exercises: new Set(),
            }
          }
          
          acc[localDateKey].workouts.push(workout)
          acc[localDateKey].exercises.add(workout.exercise)
          
          return acc
        }, {})
        
        // Transform to the expected format and sort by date descending
        const workoutDays = Object.entries(workoutsByDate)
          .map(([dateKey, day]: [string, any]) => ({
            date: dateKey, // YYYY-MM-DD format for URL compatibility
            workoutCount: day.workouts.length,
            exercises: Array.from(day.exercises) as string[],
          }))
          .sort((a, b) => b.date.localeCompare(a.date))
        
        console.log('Processed workout days:', workoutDays)
        setWorkoutDays(workoutDays)
      }
    } catch (error) {
      console.error('Error fetching workout history:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center sm:text-left">
            📈 Workout History
          </h1>
          
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading workout history...</div>
          ) : workoutDays.length === 0 ? (
            <div className="text-center py-8 sm:py-12 text-gray-500">
              <div className="text-4xl sm:text-6xl mb-4">📊</div>
              <p className="text-base sm:text-lg mb-4">No workouts recorded yet</p>
              <Link 
                href="/" 
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
              >
                ✨ Start tracking your first workout
              </Link>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {workoutDays.map((day) => (
                <Link
                  key={day.date}
                  href={`/?date=${day.date}`}
                  className="block border rounded-lg p-4 sm:p-5 hover:bg-gray-50 hover:border-blue-200 transition-all duration-200 active:scale-[0.98]"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-base sm:text-lg">
                        {(() => {
                          // Parse the UTC date and display in local timezone
                          const [year, month, date] = day.date.split('-').map(Number)
                          const localDate = new Date(year, month - 1, date)
                          return format(localDate, 'EEEE, MMMM d, yyyy')
                        })()}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 mt-1">
                        {day.workoutCount} set{day.workoutCount !== 1 ? 's' : ''} • {day.exercises.join(', ')}
                      </p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <span className="bg-blue-100 text-blue-800 inline-flex items-center px-2 py-1 text-xs font-medium rounded-full">
                        💪 Weights
                      </span>
                      <span className="text-gray-400 text-sm self-center">→</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}