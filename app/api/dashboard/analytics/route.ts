import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const period = searchParams.get('period') || '7d'
  const metric = searchParams.get('metric') || 'all'

  try {
    // Generate analytics data based on period
    const analyticsData = generateAnalyticsData(period, metric)

    return NextResponse.json({
      success: true,
      period,
      metric,
      data: analyticsData
    })
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function generateAnalyticsData(period: string, metric: string) {
  const days = period === '30d' ? 30 : period === '7d' ? 7 : 1
  const analytics: any = {}

  if (metric === 'all' || metric === 'submissions') {
    analytics.submissions = Array.from({ length: days }, (_, i) => ({
      date: new Date(Date.now() - (days - 1 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      count: Math.floor(Math.random() * 50) + 20,
      high_risk: Math.floor(Math.random() * 15) + 5
    }))
  }

  if (metric === 'all' || metric === 'risk-scores') {
    analytics.riskScores = {
      average: Math.floor(Math.random() * 30) + 45,
      distribution: [
        { range: '0-25', count: Math.floor(Math.random() * 50) + 10, label: 'Low Risk' },
        { range: '26-50', count: Math.floor(Math.random() * 80) + 20, label: 'Low-Medium Risk' },
        { range: '51-75', count: Math.floor(Math.random() * 60) + 15, label: 'Medium-High Risk' },
        { range: '76-100', count: Math.floor(Math.random() * 40) + 10, label: 'High Risk' }
      ]
    }
  }

  if (metric === 'all' || metric === 'ai-performance') {
    analytics.aiPerformance = {
      accuracy: 94.5,
      falsePositives: 3.2,
      falseNegatives: 2.3,
      avgProcessingTime: 3.7, // seconds
      decoySuccessRate: 87.3
    }
  }

  if (metric === 'all' || metric === 'top-threats') {
    analytics.topThreats = [
      { 
        pattern: 'Investment Scams', 
        count: 145, 
        trend: '+12%',
        riskScore: 88,
        examples: ['Bitcoin investment', 'Forex trading', 'Stock tips']
      },
      { 
        pattern: 'Fake Banking', 
        count: 98, 
        trend: '+8%',
        riskScore: 92,
        examples: ['SCB fake page', 'Kbank phishing', 'Banking OTP scam']
      },
      { 
        pattern: 'Shopping Scams', 
        count: 87, 
        trend: '-5%',
        riskScore: 76,
        examples: ['Fake iPhone sale', 'Luxury bag scam', 'Electronics fraud']
      }
    ]
  }

  return analytics
}
