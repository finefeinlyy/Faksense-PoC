import { NextRequest, NextResponse } from 'next/server';

interface ReviewLog {
  id: string;
  incidentTime: string;
  source: string;
  channel: string;
  destination: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  action: 'Blocked' | 'Allowed' | 'Pending';
  status: 'New' | 'Under Review' | 'Reviewed' | 'Approved' | 'Rejected';
  transactionSize: string;
  pageUrl: string;
  reportedBy: string;
  aiScore: number;
  riskFactors: string[];
  evidence: {
    accountNumbers: string[];
    conversationLogs: string[];
    pageHistory: string[];
    screenshots?: string[];
  };
  reviewerNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

// Mock database for review logs
let mockReviewLogs: ReviewLog[] = [
  {
    id: '132458',
    incidentTime: '2025-07-02T16:13:12Z',
    source: 'kugaloan',
    channel: 'Facebook Page',
    destination: 'Endpoint printing',
    severity: 'High',
    action: 'Blocked',
    status: 'New',
    transactionSize: '14.99 KB',
    pageUrl: 'https://facebook.com/fake-scb-bank-promotion',
    reportedBy: 'ตำรวจไซเบอร์ กรุงเทพฯ',
    aiScore: 92,
    riskFactors: [
      'ใช้โลโก้ธนาคารปลอม',
      'ขอข้อมูลส่วนตัวผ่านช่องทางไม่ปลอดภัย',
      'เสนออัตราดอกเบี้ยสูงผิดปกติ',
      'มีประวัติการเปลี่ยนชื่อเพจบ่อย',
      'พบเลขบัญชีต้องสงสัยในการสนทนา'
    ],
    evidence: {
      accountNumbers: ['1234567890', '9876543210'],
      conversationLogs: [
        'AI: สวัสดีครับ ผมสนใจโปรโมชั่นเงินฝากของธนาคาร',
        'Page: สวัสดีครับ เรามีโปรโมชั่นพิเศษ ดอกเบี้ย 15% ต่อปี รับประกันผลตอบแทน',
        'AI: ต้องทำยังไงบ้างครับ',
        'Page: ง่ายมากครับ แค่โอนเงินมาที่บัญชี กสิกรไทย 1234567890 นาย สมชาย ใจดี',
        'AI: ปลอดภัยมั้ยครับ',
        'Page: ปลอดภัย 100% ครับ ธนาคารรับประกันเอง ถ้าไม่ได้ดอกเบี้ยคืนเงินเต็มจำนวน'
      ],
      pageHistory: [
        'เปลี่ยนชื่อจาก "ขายของมือสอง" เมื่อ 3 วันที่แล้ว',
        'อัพเดทโปรไฟล์ให้เป็นธนาคาร SCB เมื่อ 2 วันที่แล้ว',
        'เพิ่มรูปโลโก้ธนาคารเมื่อ 1 วันที่แล้ว'
      ]
    }
  },
  {
    id: '132551',
    incidentTime: '2025-07-02T15:59:18Z',
    source: 'kugaloan',
    channel: 'Facebook Messenger',
    destination: 'Endpoint LAN',
    severity: 'Medium',
    action: 'Blocked',
    status: 'Under Review',
    transactionSize: '13.12 KB',
    pageUrl: 'https://facebook.com/crypto-investment-guaranteed',
    reportedBy: 'ประชาชนทั่วไป',
    aiScore: 75,
    riskFactors: [
      'ใช้คำว่า "รับประกันกำไร" ซึ่งผิดกฎหมาย',
      'ไม่มีใบอนุญาตการลงทุน',
      'ขอโอนเงินผ่านบัญชีส่วนตัว'
    ],
    evidence: {
      accountNumbers: ['5555666677'],
      conversationLogs: [
        'AI: สนใจลงทุน crypto ครับ',
        'Page: เรามีแพ็กเกจลงทุนพิเศษ รับประกันกำไร 200% ใน 30 วัน',
        'AI: จริงเหรอครับ',
        'Page: จริงครับ มีใบอนุญาตจาก SEC แล้ว โอนเงินมาที่ ไทยพาณิชย์ 5555666677'
      ],
      pageHistory: [
        'สร้างเพจเมื่อ 1 สัปดาห์ที่แล้ว',
        'ไม่มีประวัติการโพสต์อื่น ๆ'
      ]
    }
  },
  {
    id: '132601',
    incidentTime: '2025-07-02T15:40:39Z',
    source: 'plubloan',
    channel: 'Facebook Page',
    destination: 'Line Mac',
    severity: 'Critical',
    action: 'Blocked',
    status: 'New',
    transactionSize: '13.12 KB',
    pageUrl: 'https://facebook.com/government-covid-aid-fake',
    reportedBy: 'หน่วยงานรัฐ',
    aiScore: 95,
    riskFactors: [
      'ปลอมแปลงเป็นหน่วยงานรัฐ',
      'ขอข้อมูลบัตรประชาชนและรหัสผ่านธนาคาร',
      'ใช้โลโก้ราชการโดยไม่ได้รับอนุญาต',
      'แจกเงินช่วยเหลือปลอม'
    ],
    evidence: {
      accountNumbers: ['7777888899', '1111000022'],
      conversationLogs: [
        'AI: สวัสดีครับ ผมได้รับสิทธิ์เงินช่วยเหลือ COVID หรือเปล่า',
        'Page: สวัสดีครับ คุณได้รับสิทธิ์ 10,000 บาท กรุณากรอกข้อมูล',
        'AI: ต้องกรอกอะไรบ้างครับ',
        'Page: เลขบัตรประชาชน รหัสผ่านธนาคาร และรหัส PIN เพื่อยืนยันตัวตน'
      ],
      pageHistory: [
        'ใช้ชื่อ "กรมการปกครอง - แจกเงินช่วยเหลือ"',
        'ใช้โลโก้กรมการปกครองโดยไม่ได้รับอนุญาต'
      ]
    }
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get filter parameters
    const severity = searchParams.get('severity') || 'all';
    const status = searchParams.get('status') || 'all';
    const action = searchParams.get('action') || 'all';
    const dateRange = searchParams.get('dateRange') || 'last3days';
    const source = searchParams.get('source') || 'all';
    const search = searchParams.get('search') || '';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Apply filters
    let filteredLogs = [...mockReviewLogs];

    // Filter by severity
    if (severity !== 'all') {
      filteredLogs = filteredLogs.filter(log => log.severity === severity);
    }

    // Filter by status
    if (status !== 'all') {
      filteredLogs = filteredLogs.filter(log => log.status === status);
    }

    // Filter by action
    if (action !== 'all') {
      filteredLogs = filteredLogs.filter(log => log.action === action);
    }

    // Filter by source
    if (source !== 'all') {
      filteredLogs = filteredLogs.filter(log => {
        switch (source) {
          case 'AI Detection':
            return log.source.includes('rinrapas');
          case 'User Report':
            return log.reportedBy.includes('ประชาชน');
          case 'Auto Scan':
            return log.reportedBy.includes('ระบบตรวจจับ');
          default:
            return true;
        }
      });
    }

    // Filter by date range
    const now = new Date();
    const dateFilter = new Date();
    switch (dateRange) {
      case 'last3days':
        dateFilter.setDate(now.getDate() - 3);
        break;
      case 'lastweek':
        dateFilter.setDate(now.getDate() - 7);
        break;
      case 'lastmonth':
        dateFilter.setMonth(now.getMonth() - 1);
        break;
    }
    filteredLogs = filteredLogs.filter(log => new Date(log.incidentTime) >= dateFilter);

    // Apply search
    if (search) {
      filteredLogs = filteredLogs.filter(log =>
        log.pageUrl.toLowerCase().includes(search.toLowerCase()) ||
        log.source.toLowerCase().includes(search.toLowerCase()) ||
        log.destination.toLowerCase().includes(search.toLowerCase()) ||
        log.id.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sort by incident time (newest first)
    filteredLogs.sort((a, b) => new Date(b.incidentTime).getTime() - new Date(a.incidentTime).getTime());

    // Apply pagination
    const paginatedLogs = filteredLogs.slice(offset, offset + limit);

    // Calculate statistics
    const stats = {
      total: mockReviewLogs.length,
      pending: mockReviewLogs.filter(l => l.status === 'New' || l.status === 'Under Review').length,
      critical: mockReviewLogs.filter(l => l.severity === 'Critical').length,
      blocked: mockReviewLogs.filter(l => l.action === 'Blocked').length,
      approved: mockReviewLogs.filter(l => l.status === 'Approved').length,
      rejected: mockReviewLogs.filter(l => l.status === 'Rejected').length,
      averageAiScore: Math.round(mockReviewLogs.reduce((sum, l) => sum + l.aiScore, 0) / mockReviewLogs.length)
    };

    return NextResponse.json({
      success: true,
      logs: paginatedLogs,
      stats,
      pagination: {
        total: filteredLogs.length,
        limit,
        offset,
        hasMore: offset + limit < filteredLogs.length
      }
    });

  } catch (error) {
    console.error('Error fetching review logs:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        message: 'ไม่สามารถดึงข้อมูล review logs ได้ในขณะนี้'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { logId, decision, notes } = body;

    if (!logId || !decision) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Log ID and decision are required',
          message: 'กรุณาระบุรหัส log และการตัดสินใจ'
        },
        { status: 400 }
      );
    }

    const logIndex = mockReviewLogs.findIndex(l => l.id === logId);
    if (logIndex === -1) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Log not found',
          message: 'ไม่พบ log ที่ระบุ'
        },
        { status: 404 }
      );
    }

    // Update log with review decision
    const currentTime = new Date().toISOString();
    const reviewerName = 'นาย ผู้ตรวจสอบ ระบบ'; // In real system, get from authentication

    switch (decision) {
      case 'approve':
        mockReviewLogs[logIndex] = {
          ...mockReviewLogs[logIndex],
          status: 'Approved',
          reviewedBy: reviewerName,
          reviewedAt: currentTime,
          reviewerNotes: notes || 'อนุมัติการดำเนินการ'
        };
        break;

      case 'reject':
        mockReviewLogs[logIndex] = {
          ...mockReviewLogs[logIndex],
          status: 'Rejected',
          action: 'Allowed', // Change action to allowed if rejected as false positive
          reviewedBy: reviewerName,
          reviewedAt: currentTime,
          reviewerNotes: notes || 'ปฏิเสธ - เป็น false positive'
        };
        break;

      case 'escalate':
        mockReviewLogs[logIndex] = {
          ...mockReviewLogs[logIndex],
          status: 'Under Review',
          severity: 'Critical', // Escalate severity
          reviewedBy: reviewerName,
          reviewedAt: currentTime,
          reviewerNotes: notes || 'ส่งต่อให้ผู้เชี่ยวชาญตรวจสอบเพิ่มเติม'
        };
        break;

      default:
        return NextResponse.json(
          { 
            success: false, 
            error: 'Invalid decision',
            message: 'การตัดสินใจไม่ถูกต้อง'
          },
          { status: 400 }
        );
    }

    // In a real system, you would also:
    // 1. Log the review action in audit trail
    // 2. Send notifications to relevant parties
    // 3. Update the main case status if needed
    // 4. Generate reports for compliance

    return NextResponse.json({
      success: true,
      message: 'ดำเนินการตรวจสอบเรียบร้อยแล้ว',
      log: mockReviewLogs[logIndex]
    });

  } catch (error) {
    console.error('Error processing review:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        message: 'ไม่สามารถดำเนินการตรวจสอบได้ในขณะนี้'
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { logId, notes, priority } = body;

    if (!logId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Log ID is required',
          message: 'กรุณาระบุรหัส log'
        },
        { status: 400 }
      );
    }

    const logIndex = mockReviewLogs.findIndex(l => l.id === logId);
    if (logIndex === -1) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Log not found',
          message: 'ไม่พบ log ที่ระบุ'
        },
        { status: 404 }
      );
    }

    // Update log metadata (notes, priority, etc.)
    if (notes !== undefined) {
      mockReviewLogs[logIndex].reviewerNotes = notes;
    }

    if (priority !== undefined) {
      // Update severity based on priority
      mockReviewLogs[logIndex].severity = priority;
    }

    return NextResponse.json({
      success: true,
      message: 'อัพเดทข้อมูลเรียบร้อยแล้ว',
      log: mockReviewLogs[logIndex]
    });

  } catch (error) {
    console.error('Error updating log:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        message: 'ไม่สามารถอัพเดทข้อมูลได้ในขณะนี้'
      },
      { status: 500 }
    );
  }
}

// Export endpoint for generating detailed reports
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const logId = searchParams.get('logId');
    const format = searchParams.get('format') || 'pdf';

    if (!logId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Log ID is required for export',
          message: 'กรุณาระบุรหัส log สำหรับการส่งออก'
        },
        { status: 400 }
      );
    }

    const log = mockReviewLogs.find(l => l.id === logId);
    if (!log) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Log not found',
          message: 'ไม่พบ log ที่ระบุ'
        },
        { status: 404 }
      );
    }

    // Generate mock export URL
    const exportUrl = `https://fakesense.vercel.app/api/export/review/${logId}.${format}`;

    return NextResponse.json({
      success: true,
      message: 'สร้างรายงานเรียบร้อยแล้ว',
      exportUrl,
      format,
      generatedAt: new Date().toISOString(),
      log: {
        id: log.id,
        severity: log.severity,
        status: log.status,
        reviewedBy: log.reviewedBy
      }
    });

  } catch (error) {
    console.error('Error generating export:', error);
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