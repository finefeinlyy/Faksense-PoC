"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  Filter,
  Search,
  User,
  Globe,
  Clock,
  FileText,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  RefreshCw,
} from "lucide-react"

interface ReviewLog {
  id: string
  incidentTime: string
  source: string
  channel: string
  destination: string
  severity: "Low" | "Medium" | "High" | "Critical"
  action: "Blocked" | "Allowed" | "Pending"
  status: "New" | "Under Review" | "Reviewed" | "Approved" | "Rejected"
  transactionSize: string
  pageUrl: string
  reportedBy: string
  aiScore: number
  riskFactors: string[]
  evidence: {
    accountNumbers: string[]
    conversationLogs: string[]
    pageHistory: string[]
    screenshots?: string[]
  }
  reviewerNotes?: string
  reviewedBy?: string
  reviewedAt?: string
}

interface Filters {
  severity: string
  status: string
  action: string
  dateRange: string
  source: string
}

export default function ReviewPage() {
  const [logs, setLogs] = useState<ReviewLog[]>([])
  const [selectedLog, setSelectedLog] = useState<ReviewLog | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [filters, setFilters] = useState<Filters>({
    severity: "all",
    status: "all",
    action: "all",
    dateRange: "last3days",
    source: "all",
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [showFilters, setShowFilters] = useState(false)
  const [reviewNotes, setReviewNotes] = useState("")

  const fetchReviewLogs = useCallback(async () => {
    try {
      const queryParams = new URLSearchParams()
      // Add filters to query params
      if (filters.severity !== "all") queryParams.set("severity", filters.severity)
      if (filters.status !== "all") queryParams.set("status", filters.status)
      if (filters.action !== "all") queryParams.set("action", filters.action)
      if (filters.dateRange !== "all") queryParams.set("dateRange", filters.dateRange)
      if (filters.source !== "all") queryParams.set("source", filters.source)
      if (searchTerm) queryParams.set("search", searchTerm)

      console.log("Fetching data from:", `/api/review?${queryParams}`)
      const response = await fetch(`/api/review?${queryParams}`)

      console.log("Response status:", response.status)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()

      console.log("Received data:", data)

      setLogs(data.logs || [])
    } catch (error) {
      console.error("Error fetching review logs:", error)
      // Set empty array as fallback
      setLogs([])
    } finally {
      setLoading(false)
    }
  }, [filters, searchTerm])

  useEffect(() => {
    fetchReviewLogs()
    const interval = setInterval(fetchReviewLogs, 30000)
    return () => clearInterval(interval)
  }, [fetchReviewLogs])

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchReviewLogs()
    setRefreshing(false)
  }

  const handleReview = async (logId: string, decision: "approve" | "reject", notes: string) => {
    try {
      const response = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logId, decision, notes }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Refresh the data after successful review
      await fetchReviewLogs()
      setSelectedLog(null)
      setReviewNotes("")
    } catch (error) {
      console.error("Error submitting review:", error)
      alert("เกิดข้อผิดพลาดในการส่งการตรวจสอบ กรุณาลองใหม่")
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "text-red-700 bg-red-50 border-red-200"
      case "High":
        return "text-red-700 bg-red-50 border-red-200"
      case "Medium":
        return "text-amber-700 bg-amber-50 border-amber-200"
      case "Low":
        return "text-emerald-700 bg-emerald-50 border-emerald-200"
      default:
        return "text-slate-700 bg-slate-50 border-slate-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New":
        return "text-blue-700 bg-blue-50 border-blue-200"
      case "Under Review":
        return "text-amber-700 bg-amber-50 border-amber-200"
      case "Reviewed":
        return "text-emerald-700 bg-emerald-50 border-emerald-200"
      case "Approved":
        return "text-emerald-700 bg-emerald-50 border-emerald-200"
      case "Rejected":
        return "text-red-700 bg-red-50 border-red-200"
      default:
        return "text-slate-700 bg-slate-50 border-slate-200"
    }
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case "Blocked":
        return <XCircle className="w-4 h-4 text-red-600" />
      case "Allowed":
        return <CheckCircle className="w-4 h-4 text-emerald-600" />
      case "Pending":
        return <Clock className="w-4 h-4 text-amber-600" />
      default:
        return <AlertTriangle className="w-4 h-4 text-slate-500" />
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 70) return "bg-red-500"
    if (score >= 40) return "bg-amber-500"
    return "bg-emerald-500"
  }

  const toggleRowExpansion = (logId: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(logId)) {
      newExpanded.delete(logId)
    } else {
      newExpanded.add(logId)
    }
    setExpandedRows(newExpanded)
  }

  const filteredLogs = logs.filter(
    (log) =>
      log.pageUrl?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.source?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.destination?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.reportedBy?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const stats = {
    total: logs.length,
    pending: logs.filter((l) => l.status === "New" || l.status === "Under Review").length,
    critical: logs.filter((l) => l.severity === "Critical").length,
    blocked: logs.filter((l) => l.action === "Blocked").length,
  }

  if (loading) {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 lg:p-6">
      <div className="max-w-full mx-auto space-y-6 lg:space-y-8">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex items-center space-x-4 lg:space-x-6">
              <div className="relative">
                <div className="p-3 lg:p-4 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg">
                  <Eye className="h-8 w-8 lg:h-10 lg:w-10 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
                  คิวงาน<span className="text-blue-600">ตรวจสอบ</span>
                </h1>
                <p className="text-slate-600 text-base lg:text-lg font-medium">
                  ระบบตรวจสอบโดยเจ้าหน้าที่เพื่อยืนยันผลการวิเคราะห์
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4 w-full lg:w-auto">
              <div className="flex items-center space-x-3 px-4 py-3 bg-white/80 rounded-xl border border-slate-200 shadow-sm">
                <User className="h-4 w-4 text-slate-600" />
                <span className="text-sm font-semibold text-slate-700">Super Administrator</span>
              </div>
              <Button
                onClick={handleRefresh}
                disabled={refreshing}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 px-4 lg:px-6 py-3 rounded-xl"
              >
                <RefreshCw className={`h-5 w-5 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                <span className="hidden sm:inline">{refreshing ? "กำลังอัปเดต..." : "รีเฟรช"}</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <Card className="bg-white/90 backdrop-blur-xl border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group">
            <CardContent className="p-4 lg:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs lg:text-sm font-semibold text-slate-600 mb-2 uppercase tracking-wide">
                    รายการทั้งหมด
                  </p>
                  <p className="text-2xl lg:text-4xl font-bold text-slate-800 mb-2">{stats.total}</p>
                </div>
                <div className="p-2 lg:p-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                  <FileText className="h-6 w-6 lg:h-8 lg:w-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-xl border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group">
            <CardContent className="p-4 lg:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs lg:text-sm font-semibold text-slate-600 mb-2 uppercase tracking-wide">
                    รอตรวจสอบ
                  </p>
                  <p className="text-2xl lg:text-4xl font-bold text-amber-700 mb-2">{stats.pending}</p>
                </div>
                <div className="p-2 lg:p-4 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                  <Clock className="h-6 w-6 lg:h-8 lg:w-8 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-xl border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group">
            <CardContent className="p-4 lg:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs lg:text-sm font-semibold text-slate-600 mb-2 uppercase tracking-wide">
                    ความเสี่ยงสูง
                  </p>
                  <p className="text-2xl lg:text-4xl font-bold text-red-700 mb-2">{stats.critical}</p>
                </div>
                <div className="p-2 lg:p-4 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                  <AlertTriangle className="h-6 w-6 lg:h-8 lg:w-8 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-xl border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group">
            <CardContent className="p-4 lg:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs lg:text-sm font-semibold text-slate-600 mb-2 uppercase tracking-wide">ถูกบล็อก</p>
                  <p className="text-2xl lg:text-4xl font-bold text-red-700 mb-2">{stats.blocked}</p>
                </div>
                <div className="p-2 lg:p-4 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                  <XCircle className="h-6 w-6 lg:h-8 lg:w-8 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col xl:flex-row gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Controls */}
            <Card className="mb-6 bg-white/90 backdrop-blur-xl border-slate-200 shadow-xl">
              <CardContent className="p-4 lg:p-6">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
                    <Button
                      onClick={() => setShowFilters(!showFilters)}
                      variant="outline"
                      className="border-slate-300 text-slate-600 hover:bg-slate-50 bg-white shadow-sm hover:shadow-md transition-all duration-300 w-full sm:w-auto"
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      ตัวกรอง
                    </Button>
                    <div className="relative w-full sm:w-64">
                      <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <Input
                        type="text"
                        placeholder="ค้นหาข้อมูล..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border-slate-300 focus:border-blue-600 focus:ring-blue-600"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 w-full lg:w-auto">
                    <select
                      value={filters.dateRange}
                      onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
                      className="px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-white flex-1 lg:flex-none"
                    >
                      <option value="last3days">3 วันที่แล้ว</option>
                      <option value="lastweek">สัปดาห์ที่แล้ว</option>
                      <option value="lastmonth">เดือนที่แล้ว</option>
                    </select>
                    <Button
                      variant="outline"
                      className="border-slate-300 text-slate-600 hover:bg-slate-50 bg-white shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Expanded Filters */}
                {showFilters && (
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl">
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold">ระดับความเสี่ยง</Label>
                      <select
                        value={filters.severity}
                        onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                      >
                        <option value="all">ทั้งหมด</option>
                        <option value="Critical">วิกฤต</option>
                        <option value="High">สูง</option>
                        <option value="Medium">ปานกลาง</option>
                        <option value="Low">ต่ำ</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold">สถานะ</Label>
                      <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                      >
                        <option value="all">ทั้งหมด</option>
                        <option value="New">ใหม่</option>
                        <option value="Under Review">กำลังตรวจสอบ</option>
                        <option value="Reviewed">ตรวจสอบแล้ว</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold">การดำเนินการ</Label>
                      <select
                        value={filters.action}
                        onChange={(e) => setFilters({ ...filters, action: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                      >
                        <option value="all">ทั้งหมด</option>
                        <option value="Blocked">บล็อก</option>
                        <option value="Allowed">อนุญาต</option>
                        <option value="Pending">รอดำเนินการ</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold">แหล่งที่มา</Label>
                      <select
                        value={filters.source}
                        onChange={(e) => setFilters({ ...filters, source: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                      >
                        <option value="all">ทั้งหมด</option>
                        <option value="AI Detection">AI ตรวจจับ</option>
                        <option value="User Report">รายงานผู้ใช้</option>
                        <option value="Auto Scan">สแกนอัตโนมัติ</option>
                      </select>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Logs Table */}
            <Card className="bg-white/90 backdrop-blur-xl border-slate-200 shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl lg:text-2xl font-semibold text-slate-800">รายการตรวจสอบ</CardTitle>
                  <Badge className="bg-slate-100 text-slate-700 border-slate-200 px-3 py-1 font-semibold">
                    แสดง {filteredLogs.length} รายการ
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {filteredLogs.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-600 mb-2">ไม่พบข้อมูล</h3>
                    <p className="text-slate-500">ไม่มีรายการที่ตรงกับเงื่อนไขการค้นหา</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <div className="min-w-full">
                      {/* Mobile Card View */}
                      <div className="block lg:hidden space-y-4 p-4">
                        {filteredLogs.map((log) => (
                          <Card key={log.id} className="border border-slate-200 shadow-sm">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-semibold text-slate-800">#{log.id}</span>
                                <Badge className={`text-xs font-semibold border ${getSeverityColor(log.severity)}`}>
                                  {log.severity === "Critical"
                                    ? "วิกฤต"
                                    : log.severity === "High"
                                      ? "สูง"
                                      : log.severity === "Medium"
                                        ? "ปานกลาง"
                                        : "ต่ำ"}
                                </Badge>
                              </div>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-slate-600">เวลา:</span>
                                  <span className="font-medium">
                                    {new Date(log.incidentTime).toLocaleString("th-TH")}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-600">แหล่งที่มา:</span>
                                  <span className="font-medium truncate ml-2">{log.source}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-600">ช่องทาง:</span>
                                  <span className="font-medium">{log.channel}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-slate-600">การดำเนินการ:</span>
                                  <div className="flex items-center space-x-2">
                                    {getActionIcon(log.action)}
                                    <span className="font-medium">{log.action}</span>
                                  </div>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-slate-600">คะแนน AI:</span>
                                  <div className="flex items-center space-x-2">
                                    <div className="w-16 bg-slate-200 rounded-full h-2">
                                      <div
                                        className={`h-2 rounded-full transition-all duration-500 ${getScoreColor(log.aiScore)}`}
                                        style={{ width: `${log.aiScore}%` }}
                                      ></div>
                                    </div>
                                    <span className="text-xs font-semibold">{log.aiScore}%</span>
                                  </div>
                                </div>
                              </div>
                              <div className="mt-3 pt-3 border-t border-slate-200">
                                <Button
                                  onClick={() => setSelectedLog(log)}
                                  size="sm"
                                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                  ดูรายละเอียด
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>

                      {/* Desktop Table View */}
                      <table className="hidden lg:table min-w-full">
                        <thead className="bg-slate-50">
                          <tr>
                            <th className="px-4 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                              ID
                            </th>
                            <th className="px-4 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                              เวลาเหตุการณ์
                            </th>
                            <th className="px-4 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                              แหล่งที่มา
                            </th>
                            <th className="px-4 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                              ช่องทาง
                            </th>
                            <th className="px-4 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                              ปลายทาง
                            </th>
                            <th className="px-4 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                              ความเสี่ยง
                            </th>
                            <th className="px-4 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                              การดำเนินการ
                            </th>
                            <th className="px-4 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                              คะแนน AI
                            </th>
                            <th className="px-4 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                              สถานะ
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {filteredLogs.map((log) => (
                            <>
                              <tr
                                key={log.id}
                                className={`hover:bg-slate-50 cursor-pointer transition-colors ${
                                  selectedLog?.id === log.id ? "bg-blue-50" : ""
                                }`}
                                onClick={() => setSelectedLog(log)}
                              >
                                <td className="px-4 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        toggleRowExpansion(log.id)
                                      }}
                                      className="mr-3 p-1 hover:bg-slate-200 rounded"
                                    >
                                      {expandedRows.has(log.id) ? (
                                        <ChevronDown className="w-4 h-4 text-slate-600" />
                                      ) : (
                                        <ChevronRight className="w-4 h-4 text-slate-600" />
                                      )}
                                    </button>
                                    <span className="text-sm font-semibold text-slate-800">#{log.id}</span>
                                  </div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">
                                  {new Date(log.incidentTime).toLocaleString("th-TH")}
                                </td>
                                <td className="px-4 py-4 text-sm text-slate-800 font-semibold max-w-32">
                                  <div className="truncate" title={log.source}>
                                    {log.source}
                                  </div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                  <div className="flex items-center text-sm text-slate-700">
                                    <Globe className="w-4 h-4 mr-2 text-blue-600 flex-shrink-0" />
                                    <span className="truncate">{log.channel}</span>
                                  </div>
                                </td>
                                <td className="px-4 py-4 text-sm text-slate-700 font-medium max-w-32">
                                  <div className="truncate" title={log.destination}>
                                    {log.destination}
                                  </div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                  <Badge className={`text-xs font-semibold border ${getSeverityColor(log.severity)}`}>
                                    {log.severity === "Critical"
                                      ? "วิกฤต"
                                      : log.severity === "High"
                                        ? "สูง"
                                        : log.severity === "Medium"
                                          ? "ปานกลาง"
                                          : "ต่ำ"}
                                  </Badge>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                  <div className="flex items-center space-x-2">
                                    {getActionIcon(log.action)}
                                    <span className="text-sm text-slate-700 font-medium">{log.action}</span>
                                  </div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                  <div className="flex items-center space-x-3">
                                    <div className="flex-1 bg-slate-200 rounded-full h-2 w-16">
                                      <div
                                        className={`h-2 rounded-full transition-all duration-500 ${getScoreColor(log.aiScore)}`}
                                        style={{ width: `${log.aiScore}%` }}
                                      ></div>
                                    </div>
                                    <span className="text-xs font-semibold text-slate-700 min-w-[3rem]">
                                      {log.aiScore}%
                                    </span>
                                  </div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                  <Badge className={`text-xs font-semibold border ${getStatusColor(log.status)}`}>
                                    {log.status === "New"
                                      ? "ใหม่"
                                      : log.status === "Under Review"
                                        ? "กำลังตรวจสอบ"
                                        : log.status === "Reviewed"
                                          ? "ตรวจสอบแล้ว"
                                          : log.status === "Approved"
                                            ? "อนุมัติ"
                                            : "ปฏิเสธ"}
                                  </Badge>
                                </td>
                              </tr>
                              {/* Expanded Row Details */}
                              {expandedRows.has(log.id) && (
                                <tr>
                                  <td colSpan={9} className="px-4 py-6 bg-slate-50">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                      <div>
                                        <h4 className="font-semibold text-slate-800 mb-4 text-lg">ปัจจัยเสี่ยง</h4>
                                        <div className="space-y-2">
                                          {log.riskFactors?.map((factor, index) => (
                                            <div
                                              key={index}
                                              className="flex items-center space-x-2 text-sm text-slate-700"
                                            >
                                              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                                              <span className="font-medium">{factor}</span>
                                            </div>
                                          )) || <p className="text-slate-500">ไม่มีข้อมูลปัจจัยเสี่ยง</p>}
                                        </div>
                                      </div>
                                      <div>
                                        <h4 className="font-semibold text-slate-800 mb-4 text-lg">สรุปหลักฐาน</h4>
                                        <div className="space-y-3">
                                          <div className="flex justify-between text-sm">
                                            <span className="text-slate-600">เลขบัญชี:</span>
                                            <span className="font-semibold text-slate-800">
                                              {log.evidence?.accountNumbers?.length || 0} รายการ
                                            </span>
                                          </div>
                                          <div className="flex justify-between text-sm">
                                            <span className="text-slate-600">บันทึกการสนทนา:</span>
                                            <span className="font-semibold text-slate-800">
                                              {log.evidence?.conversationLogs?.length || 0} รายการ
                                            </span>
                                          </div>
                                          <div className="flex justify-between text-sm">
                                            <span className="text-slate-600">ประวัติเพจ:</span>
                                            <span className="font-semibold text-slate-800">
                                              {log.evidence?.pageHistory?.length || 0} รายการ
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Detail Panel */}
          {selectedLog && (
            <div className="w-full xl:w-96 xl:flex-shrink-0">
              <Card className="bg-white/90 backdrop-blur-xl border-slate-200 shadow-xl sticky top-8">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-semibold text-slate-800">รายละเอียดเหตุการณ์</CardTitle>
                    <button
                      onClick={() => setSelectedLog(null)}
                      className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 max-h-[calc(100vh-12rem)] overflow-y-auto">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-slate-700 font-semibold">ระดับความเสี่ยง:</Label>
                      <div className="mt-1">
                        <Badge className={`text-sm font-semibold border ${getSeverityColor(selectedLog.severity)}`}>
                          {selectedLog.severity === "Critical"
                            ? "วิกฤต"
                            : selectedLog.severity === "High"
                              ? "สูง"
                              : selectedLog.severity === "Medium"
                                ? "ปานกลาง"
                                : "ต่ำ"}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <Label className="text-slate-700 font-semibold">สถานะ:</Label>
                      <div className="mt-1">
                        <Badge className={`text-sm font-semibold border ${getStatusColor(selectedLog.status)}`}>
                          {selectedLog.status === "New"
                            ? "ใหม่"
                            : selectedLog.status === "Under Review"
                              ? "กำลังตรวจสอบ"
                              : selectedLog.status === "Reviewed"
                                ? "ตรวจสอบแล้ว"
                                : selectedLog.status === "Approved"
                                  ? "อนุมัติ"
                                  : "ปฏิเสธ"}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <Label className="text-slate-700 font-semibold">URL เพจ:</Label>
                      <a
                        href={selectedLog.pageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 text-sm break-all font-medium flex items-center space-x-1 mt-1"
                      >
                        <span className="break-all">{selectedLog.pageUrl}</span>
                        <ExternalLink className="h-3 w-3 flex-shrink-0" />
                      </a>
                    </div>

                    <div>
                      <Label className="text-slate-700 font-semibold">ผู้แจ้ง:</Label>
                      <p className="text-sm text-slate-800 font-medium mt-1">{selectedLog.reportedBy}</p>
                    </div>

                    <div>
                      <Label className="text-slate-700 font-semibold">คะแนน AI:</Label>
                      <div className="flex items-center space-x-3 mt-2">
                        <div className="flex-1 bg-slate-200 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full transition-all duration-500 ${getScoreColor(selectedLog.aiScore)}`}
                            style={{ width: `${selectedLog.aiScore}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold text-slate-800 min-w-[3rem]">
                          {selectedLog.aiScore}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-slate-700 font-semibold">หลักฐาน:</Label>
                    <div className="mt-3 space-y-3">
                      {selectedLog.evidence?.accountNumbers && selectedLog.evidence.accountNumbers.length > 0 && (
                        <div className="p-3 bg-slate-50 rounded-xl">
                          <h5 className="font-semibold text-slate-800 mb-2">เลขบัญชี:</h5>
                          <div className="space-y-1 max-h-32 overflow-y-auto">
                            {selectedLog.evidence.accountNumbers.map((acc, i) => (
                              <div
                                key={i}
                                className="text-sm font-mono text-slate-700 bg-white p-2 rounded border break-all"
                              >
                                {acc}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedLog.evidence?.conversationLogs && selectedLog.evidence.conversationLogs.length > 0 && (
                        <div className="p-3 bg-slate-50 rounded-xl">
                          <h5 className="font-semibold text-slate-800 mb-2">บันทึกการสนทนา:</h5>
                          <div className="max-h-32 overflow-y-auto space-y-1">
                            {selectedLog.evidence.conversationLogs.map((log, i) => (
                              <div
                                key={i}
                                className="text-sm text-slate-700 bg-white p-2 rounded border font-medium break-words"
                              >
                                {log}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedLog.status === "New" || selectedLog.status === "Under Review" ? (
                    <div className="space-y-4 pt-4 border-t border-slate-200">
                      <div>
                        <Label htmlFor="reviewNotes" className="text-slate-700 font-semibold">
                          หมายเหตุการตรวจสอบ:
                        </Label>
                        <Textarea
                          id="reviewNotes"
                          value={reviewNotes}
                          onChange={(e) => setReviewNotes(e.target.value)}
                          className="mt-2 border-slate-300 focus:border-blue-600 focus:ring-blue-600 resize-none"
                          rows={3}
                          placeholder="เพิ่มหมายเหตุการตรวจสอบ..."
                        />
                      </div>
                      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                        <Button
                          onClick={() => handleReview(selectedLog.id, "approve", reviewNotes)}
                          className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          อนุมัติ
                        </Button>
                        <Button
                          onClick={() => handleReview(selectedLog.id, "reject", reviewNotes)}
                          className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          ปฏิเสธ
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-slate-50 rounded-xl border-t border-slate-200">
                      <h5 className="font-semibold text-slate-800 mb-2">ผลการตรวจสอบ:</h5>
                      <div className="text-sm text-slate-700 space-y-1 font-medium">
                        <p>
                          <span className="font-semibold">ตรวจสอบโดย:</span> {selectedLog.reviewedBy || "ไม่ระบุ"}
                        </p>
                        <p>
                          <span className="font-semibold">วันที่:</span>{" "}
                          {selectedLog.reviewedAt ? new Date(selectedLog.reviewedAt).toLocaleString("th-TH") : "ไม่ระบุ"}
                        </p>
                        <p className="break-words">
                          <span className="font-semibold">หมายเหตุ:</span> {selectedLog.reviewerNotes || "ไม่มีหมายเหตุ"}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}