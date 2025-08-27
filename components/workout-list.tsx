'use client'

import { Button } from './ui/button'
import { format } from 'date-fns'
import { Trash2 } from 'lucide-react'

interface Workout {
  id: string
  exercise: string
  weight: number
  reps: number
  date: string
  icon?: string
  category?: string
  unit?: string
  isBodyWeight?: boolean
}

interface WorkoutListProps {
  workouts: Workout[]
  onWorkoutDeleted: () => void
}

export function WorkoutList({ workouts, onWorkoutDeleted }: WorkoutListProps) {
  const deleteWorkout = async (workoutId: string) => {
    try {
      const response = await fetch(`/api/workouts/${workoutId}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        onWorkoutDeleted()
      }
    } catch (error) {
      console.error('Error deleting workout:', error)
    }
  }

  if (workouts.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12 text-gray-500">
        <div className="text-4xl sm:text-6xl mb-4">💪</div>
        <p className="text-base sm:text-lg">No sets recorded today</p>
        <p className="text-sm text-gray-400 mt-2">Add your first set above!</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {workouts.map((workout, index) => (
        <div key={workout.id} className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                  Set {index + 1}
                </span>
                <span className="font-semibold text-gray-900 text-base truncate">
                  {workout.icon || '💪'} {workout.exercise}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-2">
                <span className="bg-blue-50 px-3 py-1 rounded text-blue-700 font-medium">
                  {(() => {
                    const category = workout.category || 'weight'
                    const unit = workout.unit || 'kg'
                    const isBodyWeight = workout.isBodyWeight || false
                    
                    if (category === 'cardio') {
                      // For cardio: show time and distance
                      return `${workout.weight} min × ${workout.reps} km`
                    } else if (isBodyWeight && workout.weight === 0) {
                      // For bodyweight with no added weight
                      return `Bodyweight × ${workout.reps} reps`
                    } else if (isBodyWeight && workout.weight > 0) {
                      // For bodyweight with added weight
                      return `BW + ${workout.weight}${unit} × ${workout.reps} reps`
                    } else {
                      // For regular weight exercises
                      return `${workout.weight}${unit} × ${workout.reps} reps`
                    }
                  })()}
                </span>
                <span className="text-sm text-gray-500">
                  {format(new Date(workout.date), 'HH:mm')}
                </span>
              </div>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => deleteWorkout(workout.id)}
              className="ml-3 flex-shrink-0 h-9 w-9 p-0"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}