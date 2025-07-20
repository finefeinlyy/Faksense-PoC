import { NextRequest, NextResponse } from 'next/server';

interface CaseData {
  id: string;
  pageUrl: string;
  reportedBy: string;
  status: 'Under Review' | 'Generating' | 'Ready';
  riskLevel: 'Low' | 'Medium' | 'High';
  aiScore: number;
  submittedAt: string;
  lastUpdated: string;
  evidence?: {
    accountNumbers: string[];
    conversationLogs: string[];
    pageHistory: string[];
  };
}

// Mock database - ในการพัฒนาจริงควรใช้ database จริง
let mockCases: CaseData[] = [
  {
    id: 'FSC001',
    pageUrl: 'https://facebook.com/fake-scb-bank-official',
    reportedBy: 'ตำรวจไซเบอร์ กรุงเทพฯ',
    status: 'Ready',
    riskLevel: 'High',
    aiScore: 92,
    submittedAt: '2025-07-14T08:30:00Z',
    lastUpdated: '2025-07-14T10:45:00Z',
    evidence: {
      accountNumbers: ['1234567890', '9876543210'],
      conversationLogs: [
        'AI: สวัสดีครับ ผมสนใจโปรโมชั่นเงินฝากของธนาคาร',
        'Page: สวัสดีครับ เรามีโปรโมชั่นพิเศษ ดอกเบี้ย 15% ต่อปี',
        'AI: ต้องโอนเงินไปที่บัญชีไหนครับ',
        'Page: โอนไปบัญชี กสิกรไทย 1234567890 นาย สมชาย ใจดี'
      ],
      pageHistory: ['เปลี่ยนชื่อจาก "ขายของมือสอง" เมื่อ 3 วันที่แล้ว']
    }
  },
  {
    id: 'FSC002',
    pageUrl: 'https://facebook.com/genuine-kbank-promotion',
    reportedBy: 'ประชาชนทั่วไป',
    status: 'Generating',
    riskLevel: 'Medium',
    aiScore: 65,
    submittedAt: '2025-07-14T09:15:00Z',
    lastUpdated: '2025-07-14T11:20:00Z'
  },
  {
    id: 'FSC003',
    pageUrl: 'https://facebook.com/lottery-winner-notification',
    reportedBy: 'หน่วยงานกำกับดูแล',
    status: 'Under Review',
    riskLevel: 'High',
    aiScore: 88,
    submittedAt: '2025-07-14T07:45:00Z',
    lastUpdated: '2025-07-14T11:30:00Z'
  },
  {
    id: 'FSC004',
    pageUrl: 'https://facebook.com/community-marketplace',
    reportedBy: 'ประชาชนทั่วไป',
    status: 'Ready',
    riskLevel: 'Low',
    aiScore: 25,
    submittedAt: '2025-07-14T06:20:00Z',
    lastUpdated: '2025-07-14T08:15:00Z',
    evidence: {
      accountNumbers: [],
      conversationLogs: [
        'AI: สวัสดีครับ มีสินค้าอะไรขายบ้างครับ',
        'Page: สวัสดีครับ เรามีของใช้ในบ้านมือสองครับ',
        'AI: ราคาเท่าไหร่ครับ',
        'Page: ติดต่อโทรมาได้เลยครับ 081-234-5678'
      ],
      pageHistory: ['สร้างเพจเมื่อ 2 ปีที่แล้ว']
    }
  },
  {
    id: 'FSC005',
    pageUrl: 'https://facebook.com/crypto-investment-expert',
    reportedBy: 'ตำรวจเศรษฐกิจ',
    status: 'Generating',
    riskLevel: 'High',
    aiScore: 78,
    submittedAt: '2025-07-14T10:00:00Z',
    lastUpdated: '2025-07-14T11:45:00Z'
  },
  {
    id: 'FSC006',
    pageUrl: 'https://facebook.com/government-subsidy-info',
    reportedBy: 'หน่วยงานรัฐ',
    status: 'Under Review',
    riskLevel: 'Medium',
    aiScore: 45,
    submittedAt: '2025-07-14T11:30:00Z',
    lastUpdated: '2025-07-14T11:30:00Z'
  }
];

// Simulate AI processing - ในระบบจริงจะเป็นการเรียก AI service
const simulateAIProcessing = () => {
  mockCases = mockCases.map(caseItem => {
    if (caseItem.status === 'Generating') {
      // สุ่มความน่าจะเป็นที่การประมวลผลจะเสร็จ
      if (Math.random() < 0.3) {
        return {
          ...caseItem,
          status: 'Ready' as const,
          lastUpdated: new Date().toISOString(),
          evidence: {
            accountNumbers: ['9999888877', '1111222233'],
            conversationLogs: [
              'AI: สวัสดีครับ ผมสนใจลงทุน crypto',
              'Page: สวัสดีครับ เรามีแพ็กเกจลงทุนพิเศษ รับประกันกำไร 200%',
              'AI: ต้องโอนเงินยังไงครับ',
              'Page: โอนไปบัญชี ไทยพาณิชย์ 9999888877 นางสาว กำไร มากมาย'
            ],
            pageHistory: ['เปลี่ยนชื่อจาก "ขายเสื้อผ้า" เมื่อ 1 สัปดาห์ที่แล้ว']
          }
        };
      }
    }
    return caseItem;
  });
};

export async function GET(request: NextRequest) {
  try {
    // Simulate AI processing
    simulateAIProcessing();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const riskLevel = searchParams.get('riskLevel');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Filter cases based on query parameters
    let filteredCases = [...mockCases];

    if (status && status !== 'all') {
      filteredCases = filteredCases.filter(caseItem => caseItem.status === status);
    }

    if (riskLevel && riskLevel !== 'all') {
      filteredCases = filteredCases.filter(caseItem => caseItem.riskLevel === riskLevel);
    }

    // Sort by last updated (newest first)
    filteredCases.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());

    // Apply pagination
    const paginatedCases = filteredCases.slice(offset, offset + limit);

    // Calculate statistics
    const stats = {
      total: mockCases.length,
      underReview: mockCases.filter(c => c.status === 'Under Review').length,
      generating: mockCases.filter(c => c.status === 'Generating').length,
      ready: mockCases.filter(c => c.status === 'Ready').length,
      highRisk: mockCases.filter(c => c.riskLevel === 'High').length,
      mediumRisk: mockCases.filter(c => c.riskLevel === 'Medium').length,
      lowRisk: mockCases.filter(c => c.riskLevel === 'Low').length,
      averageAiScore: Math.round(mockCases.reduce((sum, c) => sum + c.aiScore, 0) / mockCases.length),
      lastUpdated: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      cases: paginatedCases,
      stats,
      pagination: {
        total: filteredCases.length,
        limit,
        offset,
        hasMore: offset + limit < filteredCases.length
      }
    });

  } catch (error) {
    console.error('Error in status API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        message: 'ไม่สามารถดึงข้อมูลสถานะคดีได้ในขณะนี้'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, caseId } = body;

    if (!caseId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Case ID is required',
          message: 'กรุณาระบุรหัสคดี'
        },
        { status: 400 }
      );
    }

    const caseIndex = mockCases.findIndex(c => c.id === caseId);
    if (caseIndex === -1) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Case not found',
          message: 'ไม่พบคดีที่ระบุ'
        },
        { status: 404 }
      );
    }

    switch (action) {
      case 'approve':
        // Approve case for further investigation
        mockCases[caseIndex] = {
          ...mockCases[caseIndex],
          status: 'Ready',
          lastUpdated: new Date().toISOString()
        };
        break;

      case 'reject':
        // Mark as false positive
        mockCases[caseIndex] = {
          ...mockCases[caseIndex],
          riskLevel: 'Low',
          aiScore: Math.min(mockCases[caseIndex].aiScore, 30),
          lastUpdated: new Date().toISOString()
        };
        break;

      case 'reprocess':
        // Restart AI analysis
        mockCases[caseIndex] = {
          ...mockCases[caseIndex],
          status: 'Generating',
          lastUpdated: new Date().toISOString()
        };
        break;

      default:
        return NextResponse.json(
          { 
            success: false, 
            error: 'Invalid action',
            message: 'การดำเนินการไม่ถูกต้อง'
          },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: 'ดำเนินการเรียบร้อยแล้ว',
      case: mockCases[caseIndex]
    });

  } catch (error) {
    console.error('Error in status POST API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        message: 'ไม่สามารถดำเนินการได้ในขณะนี้'
      },
      { status: 500 }
    );
  }
}

// API endpoint สำหรับการส่งออกรายงาน
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { caseId, exportFormat = 'pdf' } = body;

    if (!caseId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Case ID is required',
          message: 'กรุณาระบุรหัสคดี'
        },
        { status: 400 }
      );
    }

    const caseItem = mockCases.find(c => c.id === caseId);
    if (!caseItem) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Case not found',
          message: 'ไม่พบคดีที่ระบุ'
        },
        { status: 404 }
      );
    }

    if (caseItem.status !== 'Ready') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Case not ready for export',
          message: 'คดีนี้ยังไม่พร้อมสำหรับการส่งออกรายงาน'
        },
        { status: 400 }
      );
    }

    // สำหรับ POC จะ return mock URL
    const mockExportUrl = `https://fakesense.vercel.app/api/export/${caseId}.${exportFormat}`;

    return NextResponse.json({
      success: true,
      message: 'สร้างรายงานเรียบร้อยแล้ว',
      exportUrl: mockExportUrl,
      format: exportFormat,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in export API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        message: 'ไม่สามารถสร้างรายงานได้ในขณะนี้'
      },
      { status: 500 }
    );
  }
}