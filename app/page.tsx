"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Search, Eye, BarChart3, AlertTriangle, Activity, FileText, ExternalLink } from "lucide-react"

export default function Page() {
  return (
    <div className="min-h-screen bg-white">
      {/* Dynamic Island Navigation */}
      <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-black/90 backdrop-blur-xl rounded-full px-6 py-3 shadow-2xl border border-white/10">
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-blue-600 rounded-lg">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">
                Fake<span className="text-blue-400">Sense</span>
              </span>
            </div>
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-gray-300 hover:text-white font-medium transition-colors text-sm">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-300 hover:text-white font-medium transition-colors text-sm">
                How it works
              </a>
              <a href="#pricing" className="text-gray-300 hover:text-white font-medium transition-colors text-sm">
                Pricing
              </a>
              <a href="#support" className="text-gray-300 hover:text-white font-medium transition-colors text-sm">
                Support
              </a>
            </div>
            {/* CTA Button */}
            <Link href="/dashboard">
              <Button className="bg-white hover:bg-gray-100 text-black px-4 py-1.5 rounded-full font-medium text-sm h-8">
                เข้าสู่ระบบ
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left Content */}
          <div className="space-y-10">
            <div className="space-y-8">
              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Meet the New
                <br />
                <span className="text-blue-600">AI Detection</span> System
              </h1>
              <p className="text-2xl text-gray-600 leading-relaxed max-w-lg font-light">
                FakeSense ให้คุณเครื่องมือและระบบ AI ที่คุณต้องการเพื่อสร้างระบบป้องกันการฉ้อโกงออนไลน์ที่มีประสิทธิภาพสูง
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium text-lg h-auto"
                >
                  เริ่มใช้งาน FakeSense
                </Button>
              </Link>
              <Link href="/submit">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-full font-medium text-base bg-transparent h-auto flex items-center justify-center"
                >
                  <ExternalLink className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="text-center leading-tight">
                    ส่งลิ้ง URL ที่คิดว่า
                    <br />
                    น่าสงสัยมาตรวจสอบ
                  </span>
                </Button>
              </Link>
            </div>
            {/* Trust Indicators */}
            <div className="flex items-center space-x-12 pt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">166K+</div>
                <div className="text-base text-gray-600 font-medium">คดีที่ตรวจพบ</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">99.2%</div>
                <div className="text-base text-gray-600 font-medium">ความแม่นยำ</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">24/7</div>
                <div className="text-base text-gray-600 font-medium">ตรวจสอบอัตโนมัติ</div>
              </div>
            </div>
          </div>

          {/* Right Dashboard Mockup */}
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl p-8 shadow-2xl">
              {/* Dashboard Header */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Top Bar */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-1.5 bg-blue-600 rounded-lg">
                        <Shield className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-semibold text-gray-900">FakeSense</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                      <span className="text-sm text-gray-600">Admin</span>
                    </div>
                  </div>
                </div>
                {/* Dashboard Content */}
                <div className="p-6">
                  {/* Welcome Message */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">สวัสดี Admin</h3>
                    <p className="text-sm text-gray-600">นี่คือสิ่งที่เกิดขึ้นกับระบบของคุณวันนี้</p>
                  </div>
                  {/* Stats Cards */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-green-50 p-4 rounded-xl">
                      <div className="text-sm text-green-600 mb-1">เพจที่ตรวจพบวันนี้</div>
                      <div className="text-2xl font-bold text-green-700">1,247</div>
                      <div className="text-xs text-green-600">↑ 12.5%</div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-xl">
                      <div className="text-sm text-blue-600 mb-1">ความเสี่ยงสูง</div>
                      <div className="text-2xl font-bold text-blue-700">89</div>
                      <div className="text-xs text-blue-600">↓ 3.2%</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-xl">
                      <div className="text-sm text-purple-600 mb-1">รอตรวจสอบ</div>
                      <div className="text-2xl font-bold text-purple-700">156</div>
                      <div className="text-xs text-purple-600">→ 0%</div>
                    </div>
                  </div>
                  {/* Chart Area */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-900">รายงานการตรวจจับ</h4>
                      <div className="flex space-x-2">
                        <button className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">7 วัน</button>
                        <button className="text-xs text-gray-500 px-3 py-1 rounded-full">30 วัน</button>
                      </div>
                    </div>
                    {/* Simple Chart Representation */}
                    <div className="h-32 bg-white rounded-lg p-4 flex items-end justify-between">
                      {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
                        <div key={i} className="bg-blue-500 rounded-t w-6" style={{ height: `${height}%` }}></div>
                      ))}
                    </div>
                  </div>
                  {/* Recent Activity */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">กิจกรรมล่าสุด</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span className="text-sm text-gray-900">เพจปลอม Facebook ถูกตรวจพบ</span>
                        </div>
                        <span className="text-xs text-gray-500">2 นาทีที่แล้ว</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <span className="text-sm text-gray-900">AI กำลังวิเคราะห์เพจใหม่</span>
                        </div>
                        <span className="text-xs text-gray-500">5 นาทีที่แล้ว</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-gray-900">รายงานถูกส่งไปยังตำรวจไซเบอร์</span>
                        </div>
                        <span className="text-xs text-gray-500">10 นาทีที่แล้ว</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Floating Elements */}
            <div className="absolute -top-4 -left-4 bg-white rounded-xl shadow-lg p-4 border border-gray-100">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-900">ระบบออนไลน์</span>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg p-4 border border-gray-100">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium text-gray-900">89 เพจเสี่ยงสูง</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="bg-gray-50 py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">ทำไมต้องเลือก FakeSense?</h2>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto font-light leading-relaxed">
              ระบบ AI ที่ทันสมัยที่สุดสำหรับการตรวจจับและป้องกันการฉ้อโกงออนไลน์
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <CardContent className="p-10 text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-3xl flex items-center justify-center mx-auto mb-8">
                  <BarChart3 className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Real-time Analytics</h3>
                <p className="text-gray-600 leading-relaxed text-lg">วิเคราะห์ข้อมูลแบบเรียลไทม์ พร้อมกราฟและสถิติที่ครบครัน</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <CardContent className="p-10 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-3xl flex items-center justify-center mx-auto mb-8">
                  <Shield className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">AI Detection</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  ระบบ AI ที่ทันสมัยตรวจจับเพจปลอมด้วยความแม่นยำสูงถึง 99.2%
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200">
              <CardContent className="p-10 text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-3xl flex items-center justify-center mx-auto mb-8">
                  <Activity className="h-10 w-10 text-white" />
                </div>
                <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-6">
                  ฟีเจอร์เด่น
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">AI ล่อซื้อ</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  AI Chatbot แฝงตัวเก็บหลักฐานการฉ้อโกง ได้ข้อมูลครบถ้วนสำหรับดำเนินคดี
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* AI Decoy Feature - Hero Section */}
      <div className="py-32 bg-gradient-to-br from-blue-50 via-sky-50 to-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            {/* Left Content */}
            <div className="space-y-10">
              <div className="space-y-8">
                <div className="inline-flex items-center px-6 py-3 bg-blue-100 text-blue-700 rounded-full text-base font-medium">
                  <span className="w-3 h-3 bg-blue-500 rounded-full mr-3 animate-pulse"></span>
                  ฟีเจอร์เด่น • AI Technology
                </div>
                <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  <span className="text-blue-600">AI ล่อซื้อ</span>
                  <br />
                  เก็บหลักฐานแอบแฝง
                </h2>
                <p className="text-2xl text-gray-600 leading-relaxed font-light">
                  ระบบ AI Chatbot ที่ฉลาดที่สุด แฝงตัวเป็นลูกค้าเพื่อสนทนากับผู้ต้องสงสัย เก็บหลักฐานการฉ้อโกงอย่างเป็นระบบและปลอดภัย
                </p>
              </div>
              <div className="space-y-6">
                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0 mt-2">
                    <span className="text-blue-600 font-bold text-lg">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 text-xl">สนทนาอัตโนมัติ</h4>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      AI แฝงตัวเป็นลูกค้าสนใจ สนทนาธรรมชาติเหมือนมนุษย์จริง
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0 mt-2">
                    <span className="text-blue-600 font-bold text-lg">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 text-xl">เก็บหลักฐานครบถ้วน</h4>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      บันทึกการสนทนา เลขบัญชี วิธีการโอนเงิน และรายละเอียดการฉ้อโกง
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0 mt-2">
                    <span className="text-blue-600 font-bold text-lg">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 text-xl">วิเคราะห์พฤติกรรม</h4>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      ศึกษารูปแบบการหลอกลวง เพื่อปรับปรุงระบบให้แม่นยำยิ่งขึ้น
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold text-xl">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-xl">ผลลัพธ์ที่ได้</h4>
                    <p className="text-base text-gray-600">ข้อมูลหลักฐานที่ใช้ได้จริงในการดำเนินคดี</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-blue-600">89%</div>
                    <div className="text-sm text-gray-600">ได้หลักฐานครบ</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-600">156</div>
                    <div className="text-sm text-gray-600">เลขบัญชีที่เก็บได้</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-600">24h</div>
                    <div className="text-sm text-gray-600">เวลาเฉลี่ยในการเก็บ</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Chat Mockup */}
            <div className="relative">
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
                {/* Chat Header */}
                <div className="bg-gradient-to-r from-blue-600 to-sky-600 px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">AI</span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">AI Agent #001</h4>
                      <p className="text-blue-100 text-sm">กำลังเก็บหลักฐาน...</p>
                    </div>
                    <div className="ml-auto">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
                {/* Chat Messages */}
                <div className="p-6 space-y-4 h-96 overflow-y-auto bg-gray-50">
                  {/* Scammer Message */}
                  <div className="flex justify-start">
                    <div className="bg-white rounded-2xl rounded-tl-md px-4 py-3 max-w-xs shadow-sm">
                      <p className="text-gray-800 text-sm">สวัสดีครับ สนใจโปรโมชั่นพิเศษไหมครับ ลงทุน 1000 ได้ 5000 ใน 1 วัน</p>
                      <span className="text-xs text-gray-500 mt-1 block">ผู้ต้องสงสัย • 14:32</span>
                    </div>
                  </div>
                  {/* AI Response */}
                  <div className="flex justify-end">
                    <div className="bg-blue-600 text-white rounded-2xl rounded-tr-md px-4 py-3 max-w-xs">
                      <p className="text-sm">สนใจมากเลยค่ะ ต้องทำยังไงบ้างคะ?</p>
                      <span className="text-xs text-blue-200 mt-1 block">AI Agent • 14:33</span>
                    </div>
                  </div>
                  {/* Scammer Message with Evidence */}
                  <div className="flex justify-start">
                    <div className="bg-white rounded-2xl rounded-tl-md px-4 py-3 max-w-xs shadow-sm border-l-4 border-red-400">
                      <p className="text-gray-800 text-sm">
                        โอนเงินมาที่บัญชี กสิกรไทย 123-4-56789-0 นาย สมชาย ใจดี จำนวน 1000 บาท
                      </p>
                      <span className="text-xs text-red-600 mt-1 block font-medium">🚨 หลักฐาน: เลขบัญชี</span>
                    </div>
                  </div>
                  {/* AI Response */}
                  <div className="flex justify-end">
                    <div className="bg-blue-600 text-white rounded-2xl rounded-tr-md px-4 py-3 max-w-xs">
                      <p className="text-sm">โอเคค่ะ ขอเวลาไปหาเงินก่อนนะคะ</p>
                      <span className="text-xs text-blue-200 mt-1 block">AI Agent • 14:35</span>
                    </div>
                  </div>
                  {/* Evidence Collection Indicator */}
                  <div className="flex justify-center">
                    <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-xs font-medium">
                      ✓ เก็บหลักฐานสำเร็จ: เลขบัญชี, ชื่อบัญชี, วิธีการโอน
                    </div>
                  </div>
                </div>
                {/* Chat Input (Disabled) */}
                <div className="border-t border-gray-200 p-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 bg-gray-100 rounded-full px-4 py-2">
                      <span className="text-gray-500 text-sm">AI กำลังวิเคราะห์และตอบกลับ...</span>
                    </div>
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Floating Evidence Cards */}
              <div className="absolute -top-4 -left-4 bg-white rounded-xl shadow-lg p-3 border border-gray-100">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-xs font-medium text-gray-900">เลขบัญชี: 123-4-56789-0</span>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg p-3 border border-gray-100">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-xs font-medium text-gray-900">หลักฐาน: 3 รายการ</span>
                </div>
              </div>
              <div className="absolute top-1/2 -left-6 bg-white rounded-xl shadow-lg p-3 border border-gray-100">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-gray-900">AI กำลังทำงาน</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How it Works */}
      <div id="how-it-works" className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">วิธีการทำงาน</h2>
            <p className="text-2xl text-gray-600 font-light">กระบวนการที่เป็นระบบและมีประสิทธิภาพ</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {[
              { num: "1", title: "รับแจ้งเหตุ", desc: "ผู้ใช้แจ้งหรือสแกนอัตโนมัติ", icon: Search },
              { num: "2", title: "วิเคราะห์ AI", desc: "ประเมินระดับความเสี่ยง", icon: BarChart3 },
              { num: "3", title: "AI ล่อซื้อ", desc: "เก็บหลักฐานแอบแฝง", icon: Eye },
              { num: "4", title: "ส่งต่อข้อมูล", desc: "รายงานไปตำรวจไซเบอร์", icon: FileText },
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8">
                  <span className="text-white font-bold text-2xl">{step.num}</span>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 text-lg">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-32">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl font-bold text-white mb-8">พร้อมที่จะเริ่มต้นแล้วหรือยัง?</h2>
          <p className="text-2xl text-blue-100 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
            ร่วมเป็นส่วนหนึ่งในการสร้างระบบป้องกันการฉ้อโกงออนไลน์ เพื่อสังคมไทยที่ปลอดภัย
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 px-10 py-6 rounded-full font-medium text-xl h-auto"
              >
                เริ่มใช้งานฟรี
              </Button>
            </Link>
            <Link href="/submit">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 px-10 py-6 rounded-full font-medium text-xl bg-transparent h-auto"
              >
                แจ้งเพจต้องสงสัย
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center items-center mb-8">
              <div className="p-2 bg-blue-600 rounded-xl mr-3">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="text-3xl font-bold text-white">
                Fake<span className="text-blue-400">Sense</span>
              </span>
            </div>
            <p className="text-gray-400 mb-3 text-lg">ระบบตรวจจับเพจปลอม Facebook ด้วย AI</p>
            <p className="text-base text-gray-500">พัฒนาโดย Team &quot;fight for นายช&quot; • Hackathon 2025</p>
          </div>
        </div>
      </footer>
    </div>
  )
}