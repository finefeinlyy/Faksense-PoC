"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Shield,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Activity,
  RefreshCw,
  TrendingUp,
  ArrowRight,
  FileText,
  Clock,
  Users,
  Zap,
  Target,
  Globe,
  Eye,
  Search,
  Bell,
  ChevronRight,
  X,
} from "lucide-react"

// Types matching the backend
interface DashboardStats {
  totalPages: number
  highRisk: number
  underReview: number
  resolved: number
  todaySubmissions: number
  weeklyGrowth: number
}

interface ActivityItem {
  id: number
  type: string
  title: string
  url: string
  riskLevel: "low" | "medium" | "high" | "critical"
  riskScore: number
  status: string
  timestamp: string
  caseId: string
}

interface RiskDistribution {
  name: string
  value: number
  color: string
  percentage: number
}

interface RealTimeData {
  timestamp: string
  activeScans: number
  queueSize: number
  systemStatus: string
  alerts: Array<{
    id: number
    type: string
    message: string
    timestamp: string
    severity: string
  }>
  performance: {
    cpuUsage: number
    memoryUsage: number
    apiResponseTime: number
  }
}

export default function PoliceDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [riskDistribution, setRiskDistribution] = useState<RiskDistribution[]>([])
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([])
  const [realTimeData, setRealTimeData] = useState<RealTimeData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [alertsVisible, setAlertsVisible] = useState(true)

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/dashboard?type=summary")
      const result = await response.json()
      if (result.success) {
        setStats(result.data.stats || result.data)
        setRiskDistribution(result.data.riskDistribution || [])
        setRecentActivity(result.data.recentActivity || [])
        setLastUpdated(new Date())
      } else {
        setError("ไม่สามารถโหลดข้อมูลได้")
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการโหลดข้อมูล")
      console.error("Dashboard fetch error:", err)
    }
  }

  // Fetch real-time data
  const fetchRealTimeData = async () => {
    try {
      const response = await fetch("/api/dashboard/real-time")
      const result = await response.json()
      if (result.success) {
        setRealTimeData(result.data)
      }
    } catch (err) {
      console.error("Real-time data fetch error:", err)
    }
  }

  // Refresh stats manually
  const refreshStats = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "refresh-stats" }),
      })
      const result = await response.json()
      if (result.success) {
        setStats(result.data)
        setLastUpdated(new Date())
      }
    } catch (err) {
      console.error("Refresh error:", err)
    } finally {
      setLoading(false)
    }
  }

  // Get relative time
  const getRelativeTime = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))
    if (diffInMinutes < 1) return "เมื่อสักครู่"
    if (diffInMinutes < 60) return `${diffInMinutes} นาทีที่แล้ว`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} ชั่วโมงที่แล้ว`
    return `${Math.floor(diffInMinutes / 1440)} วันที่แล้ว`
  }

  // Get status color with modern design
  const getStatusColor = (status: string) => {
    switch (status) {
      case "flagged":
        return "bg-gradient-to-r from-red-50 to-red-100 text-red-800 border-red-200 shadow-sm"
      case "analyzing":
        return "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 border-blue-200 shadow-sm"
      case "under-review":
        return "bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800 border-amber-200 shadow-sm"
      case "resolved":
        return "bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-800 border-emerald-200 shadow-sm"
      case "ai-decoy-active":
        return "bg-gradient-to-r from-purple-50 to-purple-100 text-purple-800 border-purple-200 shadow-sm"
      default:
        return "bg-gradient-to-r from-slate-50 to-slate-100 text-slate-800 border-slate-200 shadow-sm"
    }
  }

  // Get risk level color with modern design
  const getRiskColor = (level: string) => {
    switch (level) {
      case "low":
        return "text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full text-xs font-semibold"
      case "medium":
        return "text-blue-700 bg-blue-50 px-2 py-1 rounded-full text-xs font-semibold"
      case "high":
        return "text-orange-700 bg-orange-50 px-2 py-1 rounded-full text-xs font-semibold"
      case "critical":
        return "text-red-700 bg-red-50 px-2 py-1 rounded-full text-xs font-semibold"
      default:
        return "text-slate-700 bg-slate-50 px-2 py-1 rounded-full text-xs font-semibold"
    }
  }

  useEffect(() => {
    // Initial load
    setLoading(true)
    Promise.all([fetchDashboardData(), fetchRealTimeData()]).finally(() => setLoading(false))

    // Set up real-time updates every 30 seconds
    const interval = setInterval(() => {
      fetchRealTimeData()
      fetchDashboardData()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  if (loading && !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-6">
        <div className="text-center bg-white/90 backdrop-blur-xl p-12 rounded-2xl shadow-2xl border border-white/20">
          <div className="relative mb-8">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-slate-200 border-t-blue-600 mx-auto"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 opacity-20 animate-pulse"></div>
          </div>
          <h2 className="text-2xl font-semibold text-slate-800 mb-3">กำลังโหลดระบบ</h2>
          <p className="text-slate-600 text-lg">กรุณารอสักครู่...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="p-4 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg">
                  <Shield className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
                  ศูนย์ควบคุม<span className="text-blue-600">การตรวจสอบ</span>
                </h1>
                <p className="text-slate-600 text-lg font-medium">ระบบติดตามเพจต้องสงสัย</p>
                <p className="text-sm text-slate-500 mt-2 flex items-center bg-slate-50 px-3 py-1 rounded-full">
                  <Clock className="h-4 w-4 mr-2" />
                  อัปเดตล่าสุด: {lastUpdated.toLocaleString("th-TH")}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 mt-6 lg:mt-0">
              {realTimeData?.systemStatus && (
                <div className="flex items-center space-x-3 px-4 py-3 bg-white/80 rounded-xl border border-slate-200 shadow-sm">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      realTimeData.systemStatus === "operational"
                        ? "bg-emerald-500 shadow-emerald-500/50"
                        : "bg-red-500 shadow-red-500/50"
                    } animate-pulse shadow-lg`}
                  ></div>
                  <span className="text-sm font-semibold text-slate-700">
                    สถานะ: {realTimeData.systemStatus === "operational" ? "ปกติ" : "ผิดปกติ"}
                  </span>
                </div>
              )}

              <Button
                onClick={refreshStats}
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3 rounded-xl"
              >
                <RefreshCw className={`h-5 w-5 mr-2 ${loading ? "animate-spin" : ""}`} />
                {loading ? "กำลังอัปเดต..." : "อัปเดตข้อมูล"}
              </Button>
            </div>
          </div>
        </div>

        {error && (
          <Card className="border-red-200 bg-gradient-to-r from-red-50 to-red-100 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-red-100 rounded-xl shadow-sm">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-red-800 text-lg">เกิดข้อผิดพลาด</h3>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Urgent Alerts */}
        {realTimeData?.alerts && realTimeData.alerts.length > 0 && alertsVisible && (
          <Card className="border-red-200 bg-white shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-bold text-red-800 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Bell className="h-4 w-4 text-red-600" />
                  </div>
                  <span>แจ้งเตือนเร่งด่วน</span>
                </div>
                <button
                  onClick={() => setAlertsVisible(false)}
                  className="p-1 hover:bg-red-100 rounded-lg transition-colors"
                  title="ปิดแจ้งเตือน"
                >
                  <X className="h-4 w-4 text-red-600" />
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {realTimeData.alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-3 rounded-lg border-l-3 ${
                      alert.severity === "high"
                        ? "border-red-500 bg-red-50"
                        : alert.severity === "medium"
                          ? "border-amber-500 bg-amber-50"
                          : "border-blue-500 bg-blue-50"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <p className="font-medium text-slate-800 text-sm">{alert.message}</p>
                      <span className="text-xs text-slate-600 bg-white px-2 py-1 rounded font-medium">
                        {getRelativeTime(alert.timestamp)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white/90 backdrop-blur-xl border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-600 mb-2 uppercase tracking-wide">เพจทั้งหมด</p>
                    <p className="text-4xl font-bold text-slate-800 mb-2">{stats.totalPages.toLocaleString()}</p>
                    <p className="text-sm text-emerald-600 font-semibold flex items-center bg-emerald-50 px-2 py-1 rounded-full">
                      <TrendingUp className="h-4 w-4 mr-1" />+{stats.todaySubmissions} วันนี้
                    </p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                    <BarChart3 className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-xl border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-600 mb-2 uppercase tracking-wide">เร่งด่วน</p>
                    <p className="text-4xl font-bold text-red-700 mb-2">{stats.highRisk}</p>
                    <p className="text-sm text-red-600 font-semibold flex items-center bg-red-50 px-2 py-1 rounded-full">
                      <Zap className="h-4 w-4 mr-1" />
                      ต้องดำเนินการทันที
                    </p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-xl border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-600 mb-2 uppercase tracking-wide">รอพิจารณา</p>
                    <p className="text-4xl font-bold text-amber-700 mb-2">{stats.underReview}</p>
                    <p className="text-sm text-amber-600 font-semibold flex items-center bg-amber-50 px-2 py-1 rounded-full">
                      <Clock className="h-4 w-4 mr-1" />
                      รอเจ้าหน้าที่ตรวจสอบ
                    </p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                    <Clock className="h-8 w-8 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-xl border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-600 mb-2 uppercase tracking-wide">ดำเนินการแล้ว</p>
                    <p className="text-4xl font-bold text-emerald-700 mb-2">{stats.resolved.toLocaleString()}</p>
                    <p className="text-sm text-emerald-600 font-semibold flex items-center bg-emerald-50 px-2 py-1 rounded-full">
                      <TrendingUp className="h-4 w-4 mr-1" />+{stats.weeklyGrowth}% สัปดาห์นี้
                    </p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                    <CheckCircle className="h-8 w-8 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* System Status Cards */}
        {realTimeData && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white/90 backdrop-blur-xl border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-slate-800 text-lg">การสแกนที่ใช้งาน</h3>
                  <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl shadow-lg">
                    <Activity className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-slate-800 mb-4">{realTimeData.activeScans}</p>
                <p className="text-sm text-slate-600 bg-slate-50 px-3 py-2 rounded-xl inline-block font-medium">
                  คิว: {realTimeData.queueSize} รอดำเนินการ
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-xl border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-slate-800 text-lg">ประสิทธิภาพระบบ</h3>
                  <div className="p-3 bg-gradient-to-br from-teal-100 to-teal-200 rounded-xl shadow-lg">
                    <TrendingUp className="h-6 w-6 text-teal-600" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">CPU:</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-20 h-3 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-teal-500 to-teal-600 transition-all duration-1000 rounded-full"
                          style={{ width: `${realTimeData.performance.cpuUsage}%` }}
                        ></div>
                      </div>
                      <span className="font-bold text-slate-700 text-sm min-w-[3rem]">
                        {realTimeData.performance.cpuUsage}%
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">หน่วยความจำ:</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-20 h-3 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-teal-500 to-teal-600 transition-all duration-1000 rounded-full"
                          style={{ width: `${realTimeData.performance.memoryUsage}%` }}
                        ></div>
                      </div>
                      <span className="font-bold text-slate-700 text-sm min-w-[3rem]">
                        {realTimeData.performance.memoryUsage}%
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">ความเร็วตอบสนอง:</span>
                    <span className="font-bold text-slate-700 bg-slate-50 px-3 py-1 rounded-xl text-sm">
                      {realTimeData.performance.apiResponseTime}ms
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-xl border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-slate-800 text-lg">สถานะระบบ</h3>
                  <div className="p-3 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl shadow-lg">
                    <Shield className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
                <div className="flex items-center space-x-3 mb-4">
                  <div
                    className={`w-4 h-4 rounded-full ${
                      realTimeData.systemStatus === "operational"
                        ? "bg-emerald-500 shadow-emerald-500/50"
                        : "bg-red-500 shadow-red-500/50"
                    } animate-pulse shadow-lg`}
                  ></div>
                  <span className="font-semibold text-slate-800 text-lg">
                    {realTimeData.systemStatus === "operational" ? "ระบบทำงานปกติ" : "ระบบมีปัญหา"}
                  </span>
                </div>
                <p className="text-sm text-slate-600 bg-slate-50 px-3 py-2 rounded-xl inline-block font-medium">
                  ตรวจสอบล่าสุด: {getRelativeTime(realTimeData.timestamp)}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Risk Distribution Chart */}
          <Card className="bg-white/90 backdrop-blur-xl border-slate-200 shadow-xl">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl font-semibold text-slate-900 flex items-center">
                <Target className="h-6 w-6 mr-3 text-blue-600" />
                การจำแนกความเสี่ยง
              </CardTitle>
              <CardDescription className="text-slate-600 text-base">สัดส่วนระดับความเสี่ยงของเพจที่ตรวจพบ</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {riskDistribution.map((item, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-slate-800 text-lg">{item.name}</span>
                      <span className="text-slate-700 bg-slate-100 px-3 py-2 rounded-xl text-sm font-semibold shadow-sm">
                        {item.value} เพจ ({item.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-4 shadow-inner">
                      <div
                        className="h-4 rounded-full transition-all duration-1000 shadow-sm"
                        style={{
                          width: `${item.percentage}%`,
                          background: `linear-gradient(90deg, ${item.color}, ${item.color}dd)`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-white/90 backdrop-blur-xl border-slate-200 shadow-xl">
            <CardHeader className="pb-6">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl font-semibold text-slate-900 flex items-center">
                    <Activity className="h-6 w-6 mr-3 text-blue-600" />
                    กิจกรรมล่าสุด
                  </CardTitle>
                  <CardDescription className="text-slate-600 text-base">การตรวจจับและการดำเนินการล่าสุด</CardDescription>
                </div>
                <Link
                  href="/status"
                  className="text-blue-600 hover:text-blue-700 font-semibold flex items-center bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-all duration-300 text-sm shadow-sm hover:shadow-md"
                >
                  ดูทั้งหมด
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="p-6 bg-gradient-to-r from-slate-50 to-white rounded-xl border border-slate-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h4 className="font-semibold text-slate-900 text-lg">{activity.title}</h4>
                          <Badge className={`text-xs font-semibold ${getStatusColor(activity.status)}`}>
                            {activity.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 mb-3 font-mono bg-slate-100 px-3 py-2 rounded-lg">
                          {activity.url}
                        </p>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className={getRiskColor(activity.riskLevel)}>
                            {activity.riskLevel.toUpperCase()} ({activity.riskScore})
                          </span>
                          <span className="text-slate-600 bg-slate-100 px-3 py-1 rounded-full font-semibold">
                            {activity.caseId}
                          </span>
                        </div>
                      </div>
                      <div className="text-right ml-6">
                        <p className="text-sm text-slate-500 mb-3 bg-slate-100 px-3 py-1 rounded-full font-medium">
                          {getRelativeTime(activity.timestamp)}
                        </p>
                        <Link
                          href={`/status/track/${activity.caseId}`}
                          className="text-sm text-blue-600 hover:text-blue-700 font-semibold bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition-all duration-300 inline-flex items-center shadow-sm hover:shadow-md"
                        >
                          ติดตาม
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-white/90 backdrop-blur-xl border-slate-200 shadow-xl">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-semibold text-slate-900 flex items-center">
              <Globe className="h-7 w-7 mr-4 text-blue-600" />
              เมนูหลัก
            </CardTitle>
            <CardDescription className="text-slate-600 text-lg">เข้าถึงฟังก์ชันหลักของระบบ</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link
                href="/submit"
                className="group flex flex-col items-center p-8 bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl hover:bg-gradient-to-br hover:from-emerald-50 hover:to-white hover:border-emerald-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
              >
                <div className="p-4 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  <FileText className="h-8 w-8 text-emerald-600" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-slate-900 mb-2 text-lg">แจ้งเพจต้องสงสัย</p>
                  <p className="text-sm text-slate-600">รายงานเพจที่พบความผิดปกติ</p>
                </div>
              </Link>

              <Link
                href="/scanner"
                className="group flex flex-col items-center p-8 bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-white hover:border-blue-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
              >
                <div className="p-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  <Search className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-slate-900 mb-2 text-lg">ระบบสแกนอัตโนมัติ</p>
                  <p className="text-sm text-slate-600">ตั้งค่าและจัดการการสแกน</p>
                </div>
              </Link>

              <Link
                href="/review"
                className="group flex flex-col items-center p-8 bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl hover:bg-gradient-to-br hover:from-amber-50 hover:to-white hover:border-amber-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
              >
                <div className="p-4 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  <Users className="h-8 w-8 text-amber-600" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-slate-900 mb-2 text-lg">คิวงานตรวจสอบ</p>
                  <p className="text-sm text-slate-600">จัดการงานที่รอพิจารณา</p>
                </div>
              </Link>

              <Link
                href="/status"
                className="group flex flex-col items-center p-8 bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl hover:bg-gradient-to-br hover:from-purple-50 hover:to-white hover:border-purple-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
              >
                <div className="p-4 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  <Eye className="h-8 w-8 text-purple-600" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-slate-900 mb-2 text-lg">ติดตามสถานะ</p>
                  <p className="text-sm text-slate-600">ตรวจสอบความคืบหน้าคดี</p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
