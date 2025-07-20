import { NextRequest, NextResponse } from 'next/server'

interface AutoScanRequest {
  keywords: string[]
}

interface ScanResult {
  id: string
  url: string
  riskLevel: 'Low' | 'Medium' | 'High'
  score: number
  timestamp: string
  scanType: 'auto'
  details: {
    profileAge: number
    nameChanges: number
    suspiciousKeywords: string[]
    bankAccount?: string
  }
  recommendation: string
}

// Mock URLs for auto discovery
const mockUrls = [
  'https://www.facebook.com/promo-winner-2025',
  'https://www.facebook.com/easy-money-investment',
  'https://www.facebook.com/lucky-draw-thailand',
  'https://www.facebook.com/quick-rich-scheme',
  'https://www.facebook.com/bank-promotion-scam',
  'https://www.facebook.com/news-update-fake',
  'https://www.facebook.com/crypto-investment-fraud',
  'https://www.facebook.com/lottery-winner-scam',
  'https://www.facebook.com/free-money-giveaway',
  'https://www.facebook.com/urgent-transfer-now'
]

// Mock analysis data for auto scan
const autoMockData = [
  {
    riskLevel: 'High' as const,
    score: 20,
    details: {
      profileAge: 5,
      nameChanges: 4,
      suspiciousKeywords: ['โปรโมชั่น', 'รางวัล', 'กดลิงก์'],
      bankAccount: '111-222-3333'
    },
    recommendation: 'พบเพจปลอมความเสี่ยงสูง - แจ้งเตือนทันที'
  },
  {
    riskLevel: 'High' as const,
    score: 18,
    details: {
      profileAge: 2,
      nameChanges: 6,
      suspiciousKeywords: ['ลงทุน', 'รวยเร็ว', 'ผลตอบแทน'],
      bankAccount: '444-555-6666'
    },
    recommendation: 'เพจลงทุนหลอกลวง - ความเสี่ยงสูง'
  },
  {
    riskLevel: 'Medium' as const,
    score: 45,
    details: {
      profileAge: 20,
      nameChanges: 2,
      suspiciousKeywords: ['ข่าว', 'แชร์ด่วน']
    },
    recommendation: 'เพจข่าวสารต้องสงสัย - ตรวจสอบเพิ่มเติม'
  },
  {
    riskLevel: 'Low' as const,
    score: 75,
    details: {
      profileAge: 90,
      nameChanges: 0,
      suspiciousKeywords: ['ธุรกิจ']
    },
    recommendation: 'เพจธุรกิจปกติ - ความเสี่ยงต่ำ'
  }
]

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function generateId() {
  return `auto_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`
}

async function discoverPages(keywords: string[]): Promise<string[]> {
  // Simulate discovery time
  await sleep(800)
  
  // Filter URLs based on keywords
  const matchedUrls = mockUrls.filter(url => {
    return keywords.some(keyword => {
      const keywordLower = keyword.toLowerCase()
      const urlLower = url.toLowerCase()
      
      // Direct keyword matching
      if (urlLower.includes(keywordLower)) return true
      
      // Thai to English keyword mapping
      if (keyword === 'โปรโมชั่น' && urlLower.includes('promo')) return true
      if (keyword === 'รางวัล' && (urlLower.includes('winner') || urlLower.includes('prize'))) return true
      if (keyword === 'ลงทุน' && urlLower.includes('investment')) return true
      if (keyword === 'รวยเร็ว' && (urlLower.includes('rich') || urlLower.includes('money'))) return true
      
      return false
    })
  })
  
  // Return 2-4 random matches
  const shuffled = matchedUrls.sort(() => 0.5 - Math.random())
  const numResults = Math.min(shuffled.length, Math.floor(Math.random() * 3) + 2)
  
  return shuffled.slice(0, numResults)
}

async function analyzeAutoPage(url: string): Promise<ScanResult> {
  // Simulate analysis time
  await sleep(500 + Math.random() * 1000)
  
  // Select mock data based on URL patterns
  let selectedData = autoMockData[3] // Default to low risk
  
  const urlLower = url.toLowerCase()
  if (urlLower.includes('scam') || urlLower.includes('fraud') || urlLower.includes('promo')) {
    selectedData = autoMockData[0] // High risk scam
  } else if (urlLower.includes('investment') || urlLower.includes('money') || urlLower.includes('rich')) {
    selectedData = autoMockData[1] // High risk investment
  } else if (urlLower.includes('news') || urlLower.includes('update')) {
    selectedData = autoMockData[2] // Medium risk news
  }
  
  // Add randomization
  const scoreVariation = Math.floor(Math.random() * 15) - 7
  const adjustedScore = Math.max(5, Math.min(95, selectedData.score + scoreVariation))
  
  return {
    id: generateId(),
    url,
    riskLevel: selectedData.riskLevel,
    score: adjustedScore,
    timestamp: new Date().toISOString(),
    scanType: 'auto',
    details: {
      ...selectedData.details,
      profileAge: selectedData.details.profileAge + Math.floor(Math.random() * 5)
    },
    recommendation: selectedData.recommendation
  }
}

export async function POST(request: NextRequest) {
  try {
    const { keywords }: AutoScanRequest = await request.json()
    
    // Validation
    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
      return NextResponse.json(
        { error: 'กรุณาระบุคำสำคัญสำหรับการสแกน' },
        { status: 400 }
      )
    }
    
    console.log('Auto scan started with keywords:', keywords)
    
    // Step 1: Discover suspicious pages
    const discoveredUrls = await discoverPages(keywords)
    console.log('Discovered pages:', discoveredUrls.length)
    
    // Step 2: Analyze each discovered page
    const scanResults: ScanResult[] = []
    
    for (const url of discoveredUrls) {
      try {
        const result = await analyzeAutoPage(url)
        scanResults.push(result)
      } catch (error) {
        console.error('Error analyzing page:', url, error)
      }
    }
    
    // Log results
    console.log('Auto scan completed:', {
      discoveredPages: discoveredUrls.length,
      analyzedPages: scanResults.length,
      highRisk: scanResults.filter(r => r.riskLevel === 'High').length,
      mediumRisk: scanResults.filter(r => r.riskLevel === 'Medium').length,
      lowRisk: scanResults.filter(r => r.riskLevel === 'Low').length,
      timestamp: new Date().toISOString()
    })
    
    return NextResponse.json(scanResults)
    
  } catch (error) {
    console.error('Auto scan API error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการสแกนอัตโนมัติ' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'FakeSense Auto Scan Engine',
    version: '1.0.0',
    status: 'active',
    description: 'ระบบสแกนเพจปลอมอัตโนมัติด้วย AI',
    features: [
      'Keyword-based page discovery',
      'Automated risk assessment',
      'Real-time monitoring',
      'Suspicious pattern detection'
    ],
    usage: {
      method: 'POST',
      body: {
        keywords: ['array of keywords to search for']
      }
    },
    supportedKeywords: [
      'โปรโมชั่น',
      'รางวัล', 
      'ลงทุน',
      'รวยเร็ว',
      'ข่าวสาร',
      'แจกเงิน'
    ]
  })
}