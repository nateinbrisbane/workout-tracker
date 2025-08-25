'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Select } from './ui/select'

const workoutSchema = z.object({
  exercise: z.string().min(1, 'Exercise is required'),
  weight: z.number().min(0.1, 'Weight must be greater than 0'),
  reps: z.number().min(1, 'Reps must be at least 1'),
})

type WorkoutFormData = z.infer<typeof workoutSchema>

interface WorkoutFormProps {
  onWorkoutAdded: () => void
}

export function WorkoutForm({ onWorkoutAdded }: WorkoutFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [exerciseOptions, setExerciseOptions] = useState<{ value: string; label: string }[]>([])
  const [loadingExercises, setLoadingExercises] = useState(true)

  useEffect(() => {
    fetchExerciseTypes()
  }, [])

  const fetchExerciseTypes = async () => {
    try {
      const response = await fetch('/api/workout-types')
      if (response.ok) {
        const workoutTypes = await response.json()
        const options = workoutTypes.map((type: any) => ({
          value: type.name,
          label: `💪 ${type.name}`,
        }))
        setExerciseOptions(options)
      }
    } catch (error) {
      console.error('Error fetching exercise types:', error)
      // Fallback to default exercises if API fails
      setExerciseOptions([
        { value: 'Shoulder Press', label: '💪 Shoulder Press' },
        { value: 'Bench Press', label: '💪 Bench Press' },
        { value: 'Lats Pulldown', label: '💪 Lats Pulldown' },
        { value: 'Lats Row', label: '💪 Lats Row' },
        { value: 'Bicep Curl', label: '💪 Bicep Curl' },
        { value: 'Shoulder Fly', label: '💪 Shoulder Fly' },
      ])
    } finally {
      setLoadingExercises(false)
    }
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
  } = useForm<WorkoutFormData>({
    resolver: zodResolver(workoutSchema),
    defaultValues: {
      exercise: '',
      weight: undefined,
      reps: undefined,
    },
  })

  const selectedExercise = watch('exercise')

  const onSubmit = async (data: WorkoutFormData) => {
    console.log('Form submitted with data:', data)
    setIsSubmitting(true)
    try {
      console.log('Sending POST to /api/workouts')
      const response = await fetch('/api/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      console.log('Response status:', response.status)
      if (response.ok) {
        console.log('Success! Resetting form and refreshing list')
        reset()
        onWorkoutAdded()
      } else {
        const errorData = await response.json()
        console.error('Error response:', errorData)
      }
    } catch (error) {
      console.error('Error creating workout:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Exercise
          </label>
          <Select
            value={selectedExercise}
            onValueChange={(value) => setValue('exercise', value)}
            options={exerciseOptions}
            placeholder="Select exercise"
            className="h-12 text-base"
          />
          {errors.exercise && (
            <p className="text-red-500 text-sm mt-1">{errors.exercise.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Weight (kg)
          </label>
          <Input
            type="number"
            step="0.5"
            {...register('weight', { valueAsNumber: true })}
            placeholder="0"
            className="h-12 text-base"
            inputMode="decimal"
          />
          {errors.weight && (
            <p className="text-red-500 text-sm mt-1">{errors.weight.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reps
          </label>
          <Input
            type="number"
            {...register('reps', { valueAsNumber: true })}
            placeholder="0"
            className="h-12 text-base"
            inputMode="numeric"
          />
          {errors.reps && (
            <p className="text-red-500 text-sm mt-1">{errors.reps.message}</p>
          )}
        </div>
      </div>

      <Button 
        type="submit" 
        disabled={isSubmitting} 
        className="w-full h-12 text-base font-medium"
      >
        {isSubmitting ? '⏳ Adding Set...' : '✅ Add Set'}
      </Button>
    </form>
  )
}