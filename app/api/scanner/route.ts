import { NextRequest, NextResponse } from 'next/server'

interface ScanRequest {
  url: string
}

interface ScanResult {
  id: string
  url: string
  riskLevel: 'Low' | 'Medium' | 'High'
  score: number
  timestamp: string
  scanType: 'manual' | 'auto'
  details: {
    profileAge: number
    nameChanges: number
    suspiciousKeywords: string[]
    bankAccount?: string
  }
  recommendation: string
}

// Mock analysis data
const mockData = [
  {
    riskLevel: 'High' as const,
    score: 15,
    details: {
      profileAge: 3,
      nameChanges: 5,
      suspiciousKeywords: ['โปรโมชั่น', 'รางวัลใหญ่', 'โอนเงิน', 'กดลิงก์'],
      bankAccount: '123-456-7890'
    },
    recommendation: 'เพจนี้มีความเสี่ยงสูงมาก ควรหลีกเลี่ยงและรายงานต่อ Facebook ทันที'
  },
  {
    riskLevel: 'High' as const,
    score: 25,
    details: {
      profileAge: 7,
      nameChanges: 3,
      suspiciousKeywords: ['ลงทุน', 'ผลตอบแทนสูง', 'รวยเร็ว'],
      bankAccount: '987-654-3210'
    },
    recommendation: 'เพจนี้อาจเป็นการลงทุนหลอกลวง ควรตรวจสอบใบอนุญาตก่อน'
  },
  {
    riskLevel: 'Medium' as const,
    score: 55,
    details: {
      profileAge: 45,
      nameChanges: 1,
      suspiciousKeywords: ['ข่าวสาร', 'อัพเดท']
    },
    recommendation: 'เพจนี้มีความเสี่ยงปานกลาง ควรตรวจสอบข้อมูลจากแหล่งอื่น'
  },
  {
    riskLevel: 'Low' as const,
    score: 85,
    details: {
      profileAge: 365,
      nameChanges: 0,
      suspiciousKeywords: ['ธุรกิจ', 'บริการ']
    },
    recommendation: 'เพจนี้ดูมีความน่าเชื่อถือ แต่ควรระวังในการทำธุรกรรม'
  }
]

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function generateId() {
  return `scan_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`
}

async function analyzePage(url: string, scanType: 'manual' | 'auto' = 'manual'): Promise<ScanResult> {
  // Simulate processing time
  await sleep(1000 + Math.random() * 2000)
  
  // Select mock data based on URL patterns
  let selectedData = mockData[3] // Default to low risk
  
  const urlLower = url.toLowerCase()
  if (urlLower.includes('promo') || urlLower.includes('prize') || urlLower.includes('scam')) {
    selectedData = mockData[0] // High risk
  } else if (urlLower.includes('invest') || urlLower.includes('money') || urlLower.includes('rich')) {
    selectedData = mockData[1] // High risk investment
  } else if (urlLower.includes('news') || urlLower.includes('update')) {
    selectedData = mockData[2] // Medium risk
  }
  
  // Add some randomization
  const scoreVariation = Math.floor(Math.random() * 20) - 10
  const adjustedScore = Math.max(0, Math.min(100, selectedData.score + scoreVariation))
  
  return {
    id: generateId(),
    url,
    riskLevel: selectedData.riskLevel,
    score: adjustedScore,
    timestamp: new Date().toISOString(),
    scanType,
    details: {
      ...selectedData.details,
      profileAge: selectedData.details.profileAge + Math.floor(Math.random() * 10)
    },
    recommendation: selectedData.recommendation
  }
}

export async function POST(request: NextRequest) {
  try {
    const { url }: ScanRequest = await request.json()
    
    // Basic validation
    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'กรุณาระบุ URL ที่ต้องการตรวจสอบ' },
        { status: 400 }
      )
    }
    
    // Validate Facebook URL
    if (!url.includes('facebook.com') && !url.includes('fb.com')) {
      return NextResponse.json(
        { error: 'รองรับเฉพาะ URL ของ Facebook เท่านั้น' },
        { status: 400 }
      )
    }
    
    // Perform analysis
    const result = await analyzePage(url, 'manual')
    
    // Log for audit
    console.log('Manual scan:', {
      url: result.url,
      riskLevel: result.riskLevel,
      score: result.score,
      timestamp: result.timestamp
    })
    
    return NextResponse.json(result)
    
  } catch (error) {
    console.error('Scan API error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการสแกน' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'FakeSense Scanner API',
    version: '2.0.0',
    status: 'active',
    description: 'ระบบตรวจจับเพจปลอม Facebook ด้วย AI'
  })
}