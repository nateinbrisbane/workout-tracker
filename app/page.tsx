'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { WorkoutForm } from '@/components/workout-form'
import { WorkoutList } from '@/components/workout-list'
import { Navigation } from '@/components/navigation'
import { format } from 'date-fns'

export default function Home() {
  const searchParams = useSearchParams()
  const [workouts, setWorkouts] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [isToday, setIsToday] = useState(true)

  useEffect(() => {
    // Get date from URL parameter, or use today's date
    const dateParam = searchParams.get('date')
    const today = new Date().toISOString().split('T')[0]
    
    const targetDate = dateParam || today
    const targetDateObj = new Date(targetDate + 'T00:00:00.000Z')
    
    setSelectedDate(targetDate)
    setCurrentDate(format(targetDateObj, 'EEEE, MMMM d, yyyy'))
    setIsToday(targetDate === today)
    
    fetchWorkouts(targetDate)
  }, [searchParams])

  const fetchWorkouts = async (date?: string) => {
    try {
      const targetDate = date || selectedDate || new Date().toISOString().split('T')[0]
      console.log('Fetching workouts for UTC date:', targetDate)
      const response = await fetch(`/api/workouts?date=${targetDate}`)
      console.log('Fetch response status:', response.status)
      if (response.ok) {
        const data = await response.json()
        console.log('Fetched workouts data:', data)
        setWorkouts(data)
      } else {
        console.error('Failed to fetch workouts:', response.status)
      }
    } catch (error) {
      console.error('Error fetching workouts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleWorkoutAdded = () => {
    console.log('handleWorkoutAdded called - refreshing workout list')
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
              💪 {isToday ? "Today's Workout" : "Workout"}
            </h1>
            <p className="text-gray-500 mt-1">
              {currentDate}
            </p>
            {!isToday && (
              <p className="text-sm text-blue-600 mt-1">
                Viewing past workout data
              </p>
            )}
          </div>
          
          <WorkoutForm onWorkoutAdded={handleWorkoutAdded} selectedDate={selectedDate} />
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
            {isToday ? "Today's Sets" : "Sets"}
          </h2>
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