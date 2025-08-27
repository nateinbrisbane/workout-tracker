'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Select } from './ui/select'
import { getLocalDateString } from '@/lib/date-utils'

// Dynamic schema will be created based on workout type
const createWorkoutSchema = (isBodyWeight: boolean, category: string) => {
  if (category === 'cardio') {
    return z.object({
      exercise: z.string().min(1, 'Exercise is required'),
      weight: z.number().min(0, 'Time must be 0 or greater'), // Time for cardio
      reps: z.number().min(0, 'Distance must be 0 or greater'), // Distance for cardio
    })
  }
  
  return z.object({
    exercise: z.string().min(1, 'Exercise is required'),
    weight: isBodyWeight 
      ? z.number().min(0, 'Weight can be 0 for bodyweight exercises')
      : z.number().min(0.1, 'Weight must be greater than 0'),
    reps: z.number().min(1, 'Reps must be at least 1'),
  })
}

type WorkoutFormData = {
  exercise: string
  weight: number
  reps: number
}

interface WorkoutFormProps {
  onWorkoutAdded: () => void
  selectedDate?: string
}

export function WorkoutForm({ onWorkoutAdded, selectedDate }: WorkoutFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [exerciseOptions, setExerciseOptions] = useState<{ value: string; label: string }[]>([])
  const [workoutTypes, setWorkoutTypes] = useState<any[]>([])
  const [selectedType, setSelectedType] = useState<any>(null)
  const [loadingExercises, setLoadingExercises] = useState(true)

  useEffect(() => {
    fetchExerciseTypes()
  }, [])

  const fetchExerciseTypes = async () => {
    try {
      const response = await fetch('/api/workout-types')
      if (response.ok) {
        const types = await response.json()
        setWorkoutTypes(types)
        const options = types.map((type: any) => ({
          value: type.name,
          label: `${type.icon || '💪'} ${type.name}`,
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
    resolver: zodResolver(createWorkoutSchema(false, 'weight')), // Default schema
    defaultValues: {
      exercise: '',
      weight: undefined,
      reps: undefined,
    },
  })

  const selectedExercise = watch('exercise')
  
  // Get current workout type details after form is initialized
  const currentType = selectedType || workoutTypes.find(t => t.name === selectedExercise)
  const isBodyWeight: boolean = currentType?.isBodyWeight || false
  const category: string = currentType?.category || 'weight'
  const unit: string = currentType?.unit || 'kg'
  
  // Update selected type when exercise changes
  useEffect(() => {
    const type = workoutTypes.find(t => t.name === selectedExercise)
    setSelectedType(type)
  }, [selectedExercise, workoutTypes])

  const onSubmit = async (data: WorkoutFormData) => {
    console.log('Form submitted with data:', data)
    setIsSubmitting(true)
    try {
      // Use selected date from props, or fall back to current LOCAL date
      const workoutDate = selectedDate || getLocalDateString()
      
      console.log('Sending POST to /api/workouts with date:', workoutDate)
      const response = await fetch('/api/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          date: workoutDate,
        }),
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
            {category === 'cardio' ? 'Time (min)' : `Weight (${unit})`}
            {isBodyWeight && category === 'weight' && ' (optional)'}
          </label>
          <Input
            type="number"
            step={category === 'cardio' ? "1" : "0.5"}
            {...register('weight', { valueAsNumber: true })}
            placeholder={isBodyWeight && category === 'weight' ? "0 (bodyweight)" : "0"}
            className="h-12 text-base"
            inputMode="decimal"
          />
          {errors.weight && (
            <p className="text-red-500 text-sm mt-1">{errors.weight.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {category === 'cardio' ? 'Distance (km)' : 'Reps'}
          </label>
          <Input
            type="number"
            step={category === 'cardio' ? "0.1" : "1"}
            {...register('reps', { valueAsNumber: true })}
            placeholder="0"
            className="h-12 text-base"
            inputMode={category === 'cardio' ? "decimal" : "numeric"}
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