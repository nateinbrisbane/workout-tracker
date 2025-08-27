'use client'

import { useState } from 'react'
import { Button } from './ui/button'

interface IconSelectorProps {
  selectedIcon: string
  onIconSelect: (icon: string) => void
  className?: string
}

const EXERCISE_ICONS = [
  '💪', // Bicep/Arms
  '🏋️', // Weightlifting
  '🦵', // Legs
  '🦶', // Foot/Calves
  '🚣', // Rowing
  '🦅', // Bird/Fly motion
  '🤸', // Core/Gymnastics
  '🏃', // Running
  '👟', // Shoes/Footwork
  '🚴', // Cycling
  '🏊', // Swimming
  '🧘', // Yoga
  '🥊', // Boxing
  '🏐', // Volleyball
  '🏀', // Basketball
  '⚽', // Soccer
  '🎾', // Tennis
  '🏈', // Football
  '🤾', // Handball
  '🧗', // Climbing
  '🤺', // Fencing
  '🏌️', // Golf
  '🎿', // Skiing
  '🛹', // Skateboard
  '🎯', // Target/Focus
  '🔥', // Intensity/Burn
  '⚡', // Power/Speed
  '💯', // Full effort
  '⭐', // Achievement
  '🏆', // Competition
]

export function IconSelector({ selectedIcon, onIconSelect, className = '' }: IconSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleIconSelect = (icon: string) => {
    onIconSelect(icon)
    setIsOpen(false)
  }

  return (
    <div className={`relative ${className}`}>
      <Button
        type="button"
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="h-11 w-11 p-0 text-lg"
      >
        {selectedIcon}
      </Button>
      
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Icon Grid */}
          <div className="absolute top-12 left-0 z-50 bg-white border rounded-lg shadow-lg p-3 w-72">
            <div className="grid grid-cols-8 gap-2">
              {EXERCISE_ICONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => handleIconSelect(icon)}
                  className={`
                    w-8 h-8 flex items-center justify-center text-lg rounded hover:bg-gray-100 transition-colors
                    ${selectedIcon === icon ? 'bg-blue-100 ring-2 ring-blue-500' : ''}
                  `}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}