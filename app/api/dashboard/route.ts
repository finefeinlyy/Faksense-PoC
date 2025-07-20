import { NextRequest, NextResponse } from 'next/server'

// Mock database (in real app, use actual database)
const mockData = {
  stats: {
    totalPages: 1234,
    highRisk: 56,
    underReview: 23,
    resolved: 1155,
    todaySubmissions: 12,
    weeklyGrowth: 8.5,
  },
  riskDistribution: [
    { name: 'Low Risk', value: 400, color: '#22c55e', percentage: 40 },
    { name: 'Medium Risk', value: 300, color: '#f59e0b', percentage: 30 },
    { name: 'High Risk', value: 200, color: '#ef4444', percentage: 20 },
    { name: 'Critical', value: 100, color: '#dc2626', percentage: 10 },
  ],
  recentActivity: [
    {
      id: 1,
      type: 'detection',
      title: 'Fake Bank Page Detected',
      url: 'facebook.com/fake-scb-bank',
      riskLevel: 'high',
      riskScore: 85,
      status: 'flagged',
      timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
      caseId: 'CASE-001'
    },
    {
      id: 2,
      type: 'analysis',
      title: 'Investment Scam Page',
      url: 'facebook.com/easy-money-investment',
      riskLevel: 'medium',
      riskScore: 65,
      status: 'analyzing',
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
      caseId: 'CASE-002'
    },
    {
      id: 3,
      type: 'review',
      title: 'Lottery Scam Page',
      url: 'facebook.com/win-lottery-now',
      riskLevel: 'high',
      riskScore: 92,
      status: 'under-review',
      timestamp: new Date(Date.now() - 32 * 60 * 1000).toISOString(), // 32 minutes ago
      caseId: 'CASE-003'
    },
    {
      id: 4,
      type: 'resolved',
      title: 'Fake Shopping Page',
      url: 'facebook.com/cheap-iphone-sale',
      riskLevel: 'high',
      riskScore: 88,
      status: 'resolved',
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 minutes ago
      caseId: 'CASE-004'
    },
    {
      id: 5,
      type: 'ai-decoy',
      title: 'Crypto Investment Scam',
      url: 'facebook.com/bitcoin-profit-guaranteed',
      riskLevel: 'critical',
      riskScore: 95,
      status: 'ai-decoy-active',
      timestamp: new Date(Date.now() - 58 * 60 * 1000).toISOString(), // 58 minutes ago
      caseId: 'CASE-005'
    }
  ],
  trends: {
    daily: [
      { date: '2025-07-08', submissions: 45, flagged: 12 },
      { date: '2025-07-09', submissions: 52, flagged: 15 },
      { date: '2025-07-10', submissions: 38, flagged: 8 },
      { date: '2025-07-11', submissions: 61, flagged: 18 },
      { date: '2025-07-12', submissions: 55, flagged: 14 },
      { date: '2025-07-13', submissions: 67, flagged: 21 },
      { date: '2025-07-14', submissions: 48, flagged: 16 },
    ],
    topScamTypes: [
      { type: 'Investment Scams', count: 145, percentage: 35 },
      { type: 'Fake Banking', count: 98, percentage: 24 },
      { type: 'Shopping Scams', count: 87, percentage: 21 },
      { type: 'Lottery/Prize', count: 56, percentage: 14 },
      { type: 'Others', count: 25, percentage: 6 },
    ]
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')
  const limit = parseInt(searchParams.get('limit') || '10')

  try {
    switch (type) {
      case 'stats':
        return NextResponse.json({
          success: true,
          data: mockData.stats
        })

      case 'risk-distribution':
        return NextResponse.json({
          success: true,
          data: mockData.riskDistribution
        })

      case 'recent-activity':
        const recentActivity = mockData.recentActivity.slice(0, limit)
        return NextResponse.json({
          success: true,
          data: recentActivity
        })

      case 'trends':
        return NextResponse.json({
          success: true,
          data: mockData.trends
        })

      case 'summary':
        // Calculate some real-time stats
        const now = new Date()
        const last24h = mockData.recentActivity.filter(
          activity => new Date(activity.timestamp) > new Date(now.getTime() - 24 * 60 * 60 * 1000)
        )
        
        return NextResponse.json({
          success: true,
          data: {
            ...mockData.stats,
            last24hActivity: last24h.length,
            avgRiskScore: Math.round(
              mockData.recentActivity.reduce((sum, item) => sum + item.riskScore, 0) / 
              mockData.recentActivity.length
            ),
            riskDistribution: mockData.riskDistribution,
            recentActivity: mockData.recentActivity.slice(0, 5),
            trends: mockData.trends
          }
        })

      default:
        // Return all dashboard data
        return NextResponse.json({
          success: true,
          data: {
            stats: mockData.stats,
            riskDistribution: mockData.riskDistribution,
            recentActivity: mockData.recentActivity.slice(0, limit),
            trends: mockData.trends
          }
        })
    }
  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

// POST method for updating dashboard settings or triggering actions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data } = body

    switch (action) {
      case 'refresh-stats':
        // Simulate refreshing stats
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Update some random values to simulate real-time data
        mockData.stats.todaySubmissions = Math.floor(Math.random() * 20) + 5
        mockData.stats.weeklyGrowth = Math.floor(Math.random() * 15) + 2

        return NextResponse.json({
          success: true,
          message: 'Stats refreshed successfully',
          data: mockData.stats
        })

      case 'update-case-status':
        const { caseId, newStatus } = data
        const activityIndex = mockData.recentActivity.findIndex(
          activity => activity.caseId === caseId
        )
        
        if (activityIndex !== -1) {
          mockData.recentActivity[activityIndex].status = newStatus
          mockData.recentActivity[activityIndex].timestamp = new Date().toISOString()
          
          return NextResponse.json({
            success: true,
            message: 'Case status updated',
            data: mockData.recentActivity[activityIndex]
          })
        }
        
        return NextResponse.json(
          { success: false, error: 'Case not found' },
          { status: 404 }
        )

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Dashboard POST error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}