'use client'

import { useState, useEffect } from 'react'
import { Navigation } from '@/components/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Trash2, Plus, Edit2, Save, X } from 'lucide-react'

interface WorkoutType {
  id: string
  name: string
}

export default function Settings() {
  const [workoutTypes, setWorkoutTypes] = useState<WorkoutType[]>([])
  const [loading, setLoading] = useState(true)
  const [newTypeName, setNewTypeName] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')


  useEffect(() => {
    fetchWorkoutTypes()
  }, [])

  const fetchWorkoutTypes = async () => {
    try {
      const response = await fetch('/api/workout-types')
      if (response.ok) {
        const data = await response.json()
        setWorkoutTypes(data)
      }
    } catch (error) {
      console.error('Error fetching workout types:', error)
    } finally {
      setLoading(false)
    }
  }

  const addWorkoutType = async () => {
    console.log('Save button clicked, newTypeName:', newTypeName)
    if (!newTypeName.trim()) {
      console.log('Empty name, returning')
      return
    }

    try {
      console.log('Sending request to /api/workout-types')
      const response = await fetch('/api/workout-types', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newTypeName.trim() }),
      })

      console.log('Response status:', response.status)
      if (response.ok) {
        console.log('Success! Refreshing list...')
        setNewTypeName('')
        setIsAdding(false)
        fetchWorkoutTypes()
      } else {
        const errorData = await response.json()
        console.error('Error response:', errorData)
      }
    } catch (error) {
      console.error('Error adding workout type:', error)
    }
  }

  const updateWorkoutType = async (id: string) => {
    if (!editingName.trim()) return

    try {
      const response = await fetch(`/api/workout-types/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: editingName.trim() }),
      })

      if (response.ok) {
        setEditingId(null)
        setEditingName('')
        fetchWorkoutTypes()
      }
    } catch (error) {
      console.error('Error updating workout type:', error)
    }
  }

  const deleteWorkoutType = async (id: string) => {
    if (!confirm('Are you sure you want to delete this workout type?')) return

    try {
      const response = await fetch(`/api/workout-types/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchWorkoutTypes()
      }
    } catch (error) {
      console.error('Error deleting workout type:', error)
    }
  }

  const startEditing = (workoutType: WorkoutType) => {
    setEditingId(workoutType.id)
    setEditingName(workoutType.name)
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditingName('')
  }

  const cancelAdding = () => {
    setIsAdding(false)
    setNewTypeName('')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">⚙️ Settings</h1>
              <p className="text-gray-500 mt-1">Manage your workout types</p>
            </div>
            {!isAdding && (
              <Button
                onClick={() => setIsAdding(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Exercise
              </Button>
            )}
          </div>

          {/* Add new workout type */}
          {isAdding && (
            <div className="border rounded-lg p-4 mb-4 bg-blue-50">
              <div className="flex items-center gap-3">
                <Input
                  value={newTypeName}
                  onChange={(e) => setNewTypeName(e.target.value)}
                  placeholder="Enter exercise name (e.g., Deadlift)"
                  className="flex-1 h-11 text-base"
                  onKeyPress={(e) => e.key === 'Enter' && addWorkoutType()}
                  autoFocus
                />
                <Button
                  onClick={addWorkoutType}
                  disabled={!newTypeName.trim()}
                  size="sm"
                  className="h-11 px-4"
                >
                  <Save className="h-4 w-4" />
                </Button>
                <Button
                  onClick={cancelAdding}
                  variant="outline"
                  size="sm"
                  className="h-11 px-4"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Workout types list */}
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading exercises...</div>
          ) : workoutTypes.length === 0 ? (
            <div className="text-center py-8 sm:py-12 text-gray-500">
              <div className="text-4xl sm:text-6xl mb-4">💪</div>
              <p className="text-base sm:text-lg mb-2">No exercises configured yet</p>
              <p className="text-sm text-gray-400">Add your first exercise to get started!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {workoutTypes.map((workoutType) => (
                <div
                  key={workoutType.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      {editingId === workoutType.id ? (
                        <div className="flex items-center gap-3">
                          <Input
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="flex-1 h-10 text-base"
                            onKeyPress={(e) => e.key === 'Enter' && updateWorkoutType(workoutType.id)}
                            autoFocus
                          />
                          <Button
                            onClick={() => updateWorkoutType(workoutType.id)}
                            disabled={!editingName.trim()}
                            size="sm"
                            className="h-10 px-3"
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={cancelEditing}
                            variant="outline"
                            size="sm"
                            className="h-10 px-3"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-gray-900 text-base">
                            💪 {workoutType.name}
                          </span>
                        </div>
                      )}
                    </div>
                    {editingId !== workoutType.id && (
                      <div className="flex items-center gap-2 ml-3">
                        <Button
                          onClick={() => startEditing(workoutType)}
                          variant="outline"
                          size="sm"
                          className="h-9 w-9 p-0"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => deleteWorkoutType(workoutType.id)}
                          variant="destructive"
                          size="sm"
                          className="h-9 w-9 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 pt-6 border-t">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">💡 Tips</h2>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Add exercises like "Deadlift", "Squat", "Pull-ups", etc.</li>
              <li>• Click the edit button to rename an exercise</li>
              <li>• Delete exercises you no longer use</li>
              <li>• Your workout history will keep the old exercise names</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}