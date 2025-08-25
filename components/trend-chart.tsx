'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { format } from 'date-fns'

interface TrendData {
  date: string
  value: number
  exerciseName: string
}

interface TrendChartProps {
  data: TrendData[]
  metric: 'weight' | 'distance'
  exerciseName: string
}

export function TrendChart({ data, metric, exerciseName }: TrendChartProps) {
  const formatXAxisLabel = (tickItem: string) => {
    return format(new Date(tickItem), 'MMM dd')
  }

  const formatTooltipLabel = (label: string) => {
    return format(new Date(label), 'MMMM dd, yyyy')
  }

  return (
    <div className="w-full">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 text-center sm:text-left">
        {exerciseName} - {metric === 'weight' ? 'Weight Progress (kg)' : 'Distance Progress (km)'}
      </h3>
      <div className="h-64 sm:h-80 md:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 20,
              right: 10,
              left: 10,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatXAxisLabel}
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis 
              label={{ 
                value: metric === 'weight' ? 'Weight (kg)' : 'Distance (km)', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fontSize: '12px' }
              }}
              tick={{ fontSize: 12 }}
              width={40}
            />
            <Tooltip 
              labelFormatter={formatTooltipLabel}
              formatter={(value: number) => [
                value.toFixed(1),
                metric === 'weight' ? 'kg' : 'km'
              ]}
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                fontSize: '14px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#2563eb" 
              strokeWidth={3}
              dot={{ 
                fill: '#2563eb', 
                strokeWidth: 2, 
                r: 5,
                stroke: '#ffffff'
              }}
              activeDot={{ 
                r: 8, 
                fill: '#1d4ed8',
                stroke: '#ffffff',
                strokeWidth: 2
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}