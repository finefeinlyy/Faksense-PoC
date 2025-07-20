import { NextRequest, NextResponse } from 'next/server'

// Define interfaces for type safety
interface AIAnalysis {
  suspiciousPatterns: string[]
  recommendation: string
  confidence: number
}

interface DecoyResults {
  accountNumbers: string[]
  suspiciousMessages: string[]
  evidenceScreenshots: string[]
}

interface Submission {
  caseId: string
  url: string
  reporterName: string
  description: string
  evidenceFiles: string[]
  status: string
  createdAt: string
  riskScore: number | null
  riskLevel?: string
  aiAnalysis: AIAnalysis | null
  humanReview: unknown | null
  updatedAt?: string
  decoyResults?: DecoyResults
}

// Mock database (in real app, use actual database)
const submissions: Submission[] = []

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const url = formData.get('url') as string
    const reporterName = formData.get('reporterName') as string
    const description = formData.get('description') as string

    // Validate URL
    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    // Validate Facebook URL
    const facebookPattern = /^https?:\/\/(www\.)?(facebook|fb)\.com\/.+/i
    if (!facebookPattern.test(url)) {
      return NextResponse.json(
        { error: 'Please provide a valid Facebook URL' },
        { status: 400 }
      )
    }

    // Process uploaded files
    const evidenceFiles: string[] = []
    const entries = Array.from(formData.entries())
    for (const [key, value] of entries) {
      if (key.startsWith('evidence_') && value instanceof File) {
        // In real app, save file to storage (AWS S3, etc.)
        evidenceFiles.push(value.name)
      }
    }

    // Generate case ID
    const caseId = `CASE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // Create submission record
    const submission: Submission = {
      caseId,
      url,
      reporterName: reporterName || 'Anonymous',
      description: description || '',
      evidenceFiles,
      status: 'submitted',
      createdAt: new Date().toISOString(),
      riskScore: null,
      aiAnalysis: null,
      humanReview: null,
    }

    // Save to mock database
    submissions.push(submission)

    // Simulate analysis process (in real app, trigger AI analysis)
    setTimeout(() => {
      simulateAnalysis(caseId)
    }, 2000)

    return NextResponse.json({
      success: true,
      caseId,
      status: 'submitted',
      message: 'ระบบได้รับข้อมูลแล้ว กำลังดำเนินการวิเคราะห์',
      estimatedTime: '5-10 นาที',
    })
  } catch (error) {
    console.error('Submission error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const caseId = searchParams.get('caseId')

  if (caseId) {
    // Return specific case
    const submission = submissions.find(s => s.caseId === caseId)
    if (!submission) {
      return NextResponse.json(
        { error: 'Case not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(submission)
  }

  // Return all submissions (for admin/debug)
  return NextResponse.json({
    total: submissions.length,
    submissions: submissions.slice(-10) // Return last 10
  })
}

// Simulate AI analysis process
async function simulateAnalysis(caseId: string): Promise<void> {
  const submission = submissions.find(s => s.caseId === caseId)
  if (!submission) return

  // Update status to analyzing
  submission.status = 'analyzing'

  // Simulate analysis delay
  await new Promise(resolve => setTimeout(resolve, 3000))

  // Mock AI analysis result
  const riskScore = Math.floor(Math.random() * 100)
  const riskLevel = riskScore > 70 ? 'high' : riskScore > 40 ? 'medium' : 'low'

  submission.riskScore = riskScore
  submission.riskLevel = riskLevel
  submission.aiAnalysis = {
    suspiciousPatterns: [
      'Frequent name changes detected',
      'Low engagement ratio',
      'Contains suspicious keywords'
    ].slice(0, Math.floor(Math.random() * 3) + 1),
    recommendation: riskScore > 70 ? 'Requires AI decoy interaction' : 'Monitor closely',
    confidence: Math.floor(Math.random() * 30) + 70
  }

  // Update status
  submission.status = riskScore > 70 ? 'high-risk' : 'analyzed'
  submission.updatedAt = new Date().toISOString()

  // If high risk, simulate AI decoy process
  if (riskScore > 70) {
    setTimeout(() => {
      simulateDecoyInteraction(caseId)
    }, 5000)
  }
}

// Simulate AI decoy interaction
async function simulateDecoyInteraction(caseId: string): Promise<void> {
  const submission = submissions.find(s => s.caseId === caseId)
  if (!submission) return

  submission.status = 'ai-decoy-active'

  // Simulate decoy interaction delay
  await new Promise(resolve => setTimeout(resolve, 8000))

  // Mock decoy results
  submission.decoyResults = {
    accountNumbers: ['123-456-7890', '098-765-4321'],
    suspiciousMessages: [
      'โอนเงินมาที่บัญชี 123-456-7890',
      'ส่งรหัส OTP มาให้หน่อย'
    ],
    evidenceScreenshots: ['decoy_chat_1.png', 'decoy_chat_2.png']
  }

  submission.status = 'ready-for-review'
  submission.updatedAt = new Date().toISOString()
}