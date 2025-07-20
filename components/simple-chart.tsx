'use client'

const data = [
  { name: 'Low Risk', value: 400, color: '#22c55e', percentage: 40 },
  { name: 'Medium Risk', value: 300, color: '#f59e0b', percentage: 30 },
  { name: 'High Risk', value: 200, color: '#ef4444', percentage: 20 },
  { name: 'Critical', value: 100, color: '#dc2626', percentage: 10 },
]

export function SimpleChart() {
  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <div key={index} className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">{item.name}</span>
            <span className="text-muted-foreground">{item.value} pages</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${item.percentage}%`, 
                backgroundColor: item.color 
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}