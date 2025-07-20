import { NextResponse } from 'next/server'

// Define interfaces for real-time data
interface Alert {
  id: number
  type: string
  message: string
  timestamp: string
  severity: 'low' | 'info' | 'high' | 'critical'
}

interface Performance {
  cpuUsage: number
  memoryUsage: number
  apiResponseTime: number
}

interface RealTimeData {
  timestamp: string
  activeScans: number
  queueSize: number
  systemStatus: string
  alerts: Alert[]
  performance: Performance
}

export async function GET() {
  try {
    // Simulate real-time data
    const realTimeData: RealTimeData = {
      timestamp: new Date().toISOString(),
      activeScans: Math.floor(Math.random() * 10) + 5,
      queueSize: Math.floor(Math.random() * 25) + 10,
      systemStatus: 'operational',
      alerts: [
        {
          id: 1,
          type: 'high-risk',
          message: 'High-risk page detected: facebook.com/urgent-bank-update',
          timestamp: new Date(Date.now() - Math.random() * 300000).toISOString(),
          severity: 'high'
        },
        {
          id: 2,
          type: 'system',
          message: 'AI analysis completed for 5 submissions',
          timestamp: new Date(Date.now() - Math.random() * 600000).toISOString(),
          severity: 'info'
        }
      ],
      performance: {
        cpuUsage: Math.floor(Math.random() * 30) + 20,
        memoryUsage: Math.floor(Math.random() * 40) + 30,
        apiResponseTime: Math.floor(Math.random() * 100) + 50
      }
    }

    return NextResponse.json({
      success: true,
      data: realTimeData
    })
  } catch (error) {
    console.error('Real-time API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Export types for frontend usage
export interface DashboardStats {
  totalPages: number
  highRisk: number
  underReview: number
  resolved: number
  todaySubmissions: number
  weeklyGrowth: number
}

export interface ActivityItem {
  id: number
  type: string
  title: string
  url: string
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  riskScore: number
  status: string
  timestamp: string
  caseId: string
}

export interface RiskDistribution {
  name: string
  value: number
  color: string
  percentage: number
}