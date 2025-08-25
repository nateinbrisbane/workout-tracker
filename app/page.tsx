'use client'

import { useState, useEffect } from 'react'
import { WorkoutForm } from '@/components/workout-form'
import { WorkoutList } from '@/components/workout-list'
import { Navigation } from '@/components/navigation'
import { format } from 'date-fns'

export default function Home() {
  const [workouts, setWorkouts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWorkouts()
  }, [])

  const fetchWorkouts = async () => {
    try {
      const today = format(new Date(), 'yyyy-MM-dd')
      const response = await fetch(`/api/workouts?date=${today}`)
      if (response.ok) {
        const data = await response.json()
        setWorkouts(data)
      }
    } catch (error) {
      console.error('Error fetching workouts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleWorkoutAdded = () => {
    fetchWorkouts()
  }

  const handleWorkoutDeleted = () => {
    fetchWorkouts()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Today's Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="text-center mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              💪 Today's Workout
            </h1>
            <p className="text-gray-500 mt-1">
              {format(new Date(), 'EEEE, MMMM d, yyyy')}
            </p>
          </div>
          
          <WorkoutForm onWorkoutAdded={handleWorkoutAdded} />
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Today's Sets</h2>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading workouts...</div>
          ) : (
            <WorkoutList workouts={workouts} onWorkoutDeleted={handleWorkoutDeleted} />
          )}
        </div>
      </div>
    </div>
  )
}