'use client'

import { useState, useEffect } from 'react'
import { Navigation } from '@/components/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { IconSelector } from '@/components/icon-selector'
import { Trash2, Plus, Edit2, Save, X } from 'lucide-react'

interface WorkoutType {
  id: string
  name: string
  icon: string
  category: string
  isBodyWeight: boolean
  unit: string
  isGlobal: boolean
  userId: string | null
}

export default function Settings() {
  const [workoutTypes, setWorkoutTypes] = useState<WorkoutType[]>([])
  const [loading, setLoading] = useState(true)
  const [newTypeName, setNewTypeName] = useState('')
  const [newTypeIcon, setNewTypeIcon] = useState('💪')
  const [newTypeCategory, setNewTypeCategory] = useState('weight')
  const [newTypeIsBodyWeight, setNewTypeIsBodyWeight] = useState(false)
  const [newTypeUnit, setNewTypeUnit] = useState('kg')
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const [editingIcon, setEditingIcon] = useState('')
  const [editingCategory, setEditingCategory] = useState('weight')
  const [editingIsBodyWeight, setEditingIsBodyWeight] = useState(false)
  const [editingUnit, setEditingUnit] = useState('kg')
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    fetchWorkoutTypes()
    checkAdminStatus()
  }, [])

  const checkAdminStatus = async () => {
    try {
      const response = await fetch('/api/user/status')
      if (response.ok) {
        const data = await response.json()
        setIsAdmin(data.role === 'admin')
      }
    } catch (error) {
      console.error('Error checking admin status:', error)
    }
  }

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
        body: JSON.stringify({ 
          name: newTypeName.trim(), 
          icon: newTypeIcon,
          category: newTypeCategory,
          isBodyWeight: newTypeIsBodyWeight,
          unit: newTypeUnit
        }),
      })

      console.log('Response status:', response.status)
      if (response.ok) {
        console.log('Success! Refreshing list...')
        setNewTypeName('')
        setNewTypeIcon('💪')
        setNewTypeCategory('weight')
        setNewTypeIsBodyWeight(false)
        setNewTypeUnit('kg')
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
        body: JSON.stringify({ 
          name: editingName.trim(), 
          icon: editingIcon,
          category: editingCategory,
          isBodyWeight: editingIsBodyWeight,
          unit: editingUnit
        }),
      })

      if (response.ok) {
        setEditingId(null)
        setEditingName('')
        setEditingIcon('')
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
    setEditingIcon(workoutType.icon)
    setEditingCategory(workoutType.category || 'weight')
    setEditingIsBodyWeight(workoutType.isBodyWeight || false)
    setEditingUnit(workoutType.unit || 'kg')
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditingName('')
    setEditingIcon('')
    setEditingCategory('weight')
    setEditingIsBodyWeight(false)
    setEditingUnit('kg')
  }

  const cancelAdding = () => {
    setIsAdding(false)
    setNewTypeName('')
    setNewTypeIcon('💪')
    setNewTypeCategory('weight')
    setNewTypeIsBodyWeight(false)
    setNewTypeUnit('kg')
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
              <div className="flex gap-4 mt-2">
                <span className="text-xs text-gray-500">
                  <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded font-medium">🌍 Global</span> Available to all users
                </span>
                <span className="text-xs text-gray-500">
                  <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded font-medium">👤 Personal</span> Only for you
                </span>
              </div>
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
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <IconSelector
                    selectedIcon={newTypeIcon}
                    onIconSelect={setNewTypeIcon}
                  />
                  <Input
                    value={newTypeName}
                    onChange={(e) => setNewTypeName(e.target.value)}
                    placeholder="Enter exercise name (e.g., Deadlift)"
                    className="flex-1 h-11 text-base"
                    autoFocus
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={newTypeCategory}
                      onChange={(e) => setNewTypeCategory(e.target.value)}
                      className="w-full h-10 px-3 border rounded-md text-sm"
                    >
                      <option value="weight">💪 Weight Training</option>
                      <option value="cardio">🏃 Cardio</option>
                    </select>
                  </div>
                  
                  {newTypeCategory === 'weight' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                        <select
                          value={newTypeUnit}
                          onChange={(e) => setNewTypeUnit(e.target.value)}
                          className="w-full h-10 px-3 border rounded-md text-sm"
                        >
                          <option value="kg">Kilograms (kg)</option>
                          <option value="lbs">Pounds (lbs)</option>
                        </select>
                      </div>
                      
                      <div className="flex items-center">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={newTypeIsBodyWeight}
                            onChange={(e) => setNewTypeIsBodyWeight(e.target.checked)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                          />
                          <span className="text-sm font-medium text-gray-700">Bodyweight exercise</span>
                        </label>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button
                    onClick={cancelAdding}
                    variant="outline"
                    size="sm"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={addWorkoutType}
                    disabled={!newTypeName.trim()}
                    size="sm"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Exercise
                  </Button>
                </div>
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
                        <div className="w-full space-y-3">
                          <div className="flex items-center gap-3">
                            <IconSelector
                              selectedIcon={editingIcon}
                              onIconSelect={setEditingIcon}
                            />
                            <Input
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              className="flex-1 h-10 text-base"
                              autoFocus
                            />
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
                              <select
                                value={editingCategory}
                                onChange={(e) => setEditingCategory(e.target.value)}
                                className="w-full h-9 px-2 border rounded-md text-sm"
                              >
                                <option value="weight">💪 Weight</option>
                                <option value="cardio">🏃 Cardio</option>
                              </select>
                            </div>
                            
                            {editingCategory === 'weight' && (
                              <>
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">Unit</label>
                                  <select
                                    value={editingUnit}
                                    onChange={(e) => setEditingUnit(e.target.value)}
                                    className="w-full h-9 px-2 border rounded-md text-sm"
                                  >
                                    <option value="kg">Kilograms (kg)</option>
                                    <option value="lbs">Pounds (lbs)</option>
                                  </select>
                                </div>
                                
                                <div className="flex items-center">
                                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                                    <input
                                      type="checkbox"
                                      checked={editingIsBodyWeight}
                                      onChange={(e) => setEditingIsBodyWeight(e.target.checked)}
                                      className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                                    />
                                    <span>Bodyweight</span>
                                  </label>
                                </div>
                              </>
                            )}
                          </div>
                          
                          <div className="flex justify-end gap-2">
                            <Button
                              onClick={cancelEditing}
                              variant="outline"
                              size="sm"
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={() => updateWorkoutType(workoutType.id)}
                              disabled={!editingName.trim()}
                              size="sm"
                            >
                              <Save className="h-4 w-4 mr-1" />
                              Save
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-3">
                            <span className="font-medium text-gray-900 text-base">
                              {workoutType.icon} {workoutType.name}
                            </span>
                            {workoutType.isGlobal ? (
                              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                                🌍 Global
                              </span>
                            ) : (
                              <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                                👤 Personal
                              </span>
                            )}
                            <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                              {workoutType.category === 'cardio' ? '🏃 Cardio' : '💪 Weight'}
                            </span>
                            {workoutType.category === 'weight' && workoutType.isBodyWeight && (
                              <span className="text-xs px-2 py-1 bg-blue-100 rounded-full text-blue-700">
                                Bodyweight
                              </span>
                            )}
                            {workoutType.category === 'weight' && (
                              <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                                {workoutType.unit || 'kg'}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    {editingId !== workoutType.id && (!workoutType.isGlobal || isAdmin) && (
                      <div className="flex items-center gap-2 ml-3">
                        <Button
                          onClick={() => startEditing(workoutType)}
                          variant="outline"
                          size="sm"
                          className="h-9 w-9 p-0"
                          title={workoutType.isGlobal ? "Edit global workout type (Admin)" : "Edit workout type"}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => deleteWorkoutType(workoutType.id)}
                          variant="destructive"
                          size="sm"
                          className="h-9 w-9 p-0"
                          title={workoutType.isGlobal ? "Delete global workout type (Admin)" : "Delete workout type"}
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