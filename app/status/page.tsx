"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  AlertCircle,
  Clock,
  CheckCircle,
  Eye,
  FileText,
  Activity,
  RefreshCw,
  ExternalLink,
  Download,
  TrendingUp,
  Search,
  User,
} from "lucide-react"

interface CaseData {
  id: string
  pageUrl: string
  reportedBy: string
  status: "Under Review" | "Generating" | "Ready"
  riskLevel: "Low" | "Medium" | "High"
  aiScore: number
  submittedAt: string
  lastUpdated: string
  evidence?: {
    accountNumbers: string[]
    conversationLogs: string[]
    pageHistory: string[]
  }
}

export default function StatusPage() {
  const [cases, setCases] = useState<CaseData[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [filter, setFilter] = useState<"all" | "Under Review" | "Generating" | "Ready">("all")

  useEffect(() => {
    fetchCases()
    const interval = setInterval(fetchCases, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchCases = async () => {
    try {
      const response = await fetch("/api/status")
      const data = await response.json()
      setCases(data.cases)
    } catch (error) {
      console.error("Error fetching cases:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchCases()
    setRefreshing(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Ready":
        return <CheckCircle className="w-5 h-5 text-emerald-600" />
      case "Generating":
        return <Clock className="w-5 h-5 text-amber-600 animate-spin" />
      case "Under Review":
        return <Eye className="w-5 h-5 text-blue-600" />
      default:
        return <AlertCircle className="w-5 h-5 text-slate-500" />
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
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
      case "Ready":
        return "text-emerald-700 bg-emerald-50 border-emerald-200"
      case "Generating":
        return "text-amber-700 bg-amber-50 border-amber-200"
      case "Under Review":
        return "text-blue-700 bg-blue-50 border-blue-200"
      default:
        return "text-slate-700 bg-slate-50 border-slate-200"
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 70) return "bg-red-500"
    if (score >= 40) return "bg-amber-500"
    return "bg-emerald-500"
  }

  const filteredCases = filter === "all" ? cases : cases.filter((caseItem) => caseItem.status === filter)

  const statusCounts = {
    total: cases.length,
    "Under Review": cases.filter((c) => c.status === "Under Review").length,
    Generating: cases.filter((c) => c.status === "Generating").length,
    Ready: cases.filter((c) => c.status === "Ready").length,
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
                  <Activity className="h-8 w-8 lg:h-10 lg:w-10 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
                  ติดตาม<span className="text-blue-600">สถานะ</span>
                </h1>
                <p className="text-slate-600 text-base lg:text-lg font-medium">
                  ติดตามสถานะการดำเนินการจากต้นทางถึงปลายทาง
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
                    คดีทั้งหมด
                  </p>
                  <p className="text-2xl lg:text-4xl font-bold text-slate-800 mb-2">{statusCounts.total}</p>
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
                  <p className="text-2xl lg:text-4xl font-bold text-blue-700 mb-2">{statusCounts["Under Review"]}</p>
                </div>
                <div className="p-2 lg:p-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                  <Eye className="h-6 w-6 lg:h-8 lg:w-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-xl border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group">
            <CardContent className="p-4 lg:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs lg:text-sm font-semibold text-slate-600 mb-2 uppercase tracking-wide">
                    กำลังดำเนินการ
                  </p>
                  <p className="text-2xl lg:text-4xl font-bold text-amber-700 mb-2">{statusCounts.Generating}</p>
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
                  <p className="text-xs lg:text-sm font-semibold text-slate-600 mb-2 uppercase tracking-wide">เสร็จสิ้น</p>
                  <p className="text-2xl lg:text-4xl font-bold text-emerald-700 mb-2">{statusCounts.Ready}</p>
                </div>
                <div className="p-2 lg:p-4 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                  <CheckCircle className="h-6 w-6 lg:h-8 lg:w-8 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Tabs */}
        <Card className="bg-white/90 backdrop-blur-xl border-slate-200 shadow-xl">
          <div className="border-b border-slate-200">
            <nav className="flex space-x-8 px-6 overflow-x-auto">
              {(["all", "Under Review", "Generating", "Ready"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`py-6 px-2 border-b-2 font-medium text-sm transition-all duration-300 whitespace-nowrap ${
                    filter === status
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-600 hover:text-blue-600 hover:border-slate-300"
                  }`}
                >
                  {status === "all"
                    ? "ทั้งหมด"
                    : status === "Under Review"
                      ? "รอตรวจสอบ"
                      : status === "Generating"
                        ? "กำลังดำเนินการ"
                        : "เสร็จสิ้น"}
                  <span className="ml-2 text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                    ({status === "all" ? statusCounts.total : statusCounts[status]})
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </Card>

        {/* Cases List */}
        <Card className="bg-white/90 backdrop-blur-xl border-slate-200 shadow-xl">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl lg:text-2xl font-semibold text-slate-800">รายการคดี</CardTitle>
              <Badge className="bg-slate-100 text-slate-700 border-slate-200 px-3 py-1 font-semibold">
                แสดง {filteredCases.length} รายการ
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {filteredCases.length === 0 ? (
              <div className="text-center py-12">
                <Search className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-600 mb-2">ไม่พบข้อมูลคดี</h3>
                <p className="text-slate-500">ไม่มีคดีในสถานะที่เลือกในขณะนี้</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <div className="min-w-full">
                  {/* Mobile Card View */}
                  <div className="block lg:hidden space-y-4 p-4">
                    {filteredCases.map((caseItem) => (
                      <Card key={caseItem.id} className="border border-slate-200 shadow-sm">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-semibold text-slate-800">#{caseItem.id}</span>
                            <Badge className={`text-xs font-semibold border ${getStatusColor(caseItem.status)}`}>
                              {caseItem.status === "Under Review"
                                ? "รอตรวจสอบ"
                                : caseItem.status === "Generating"
                                  ? "กำลังดำเนินการ"
                                  : "เสร็จสิ้น"}
                            </Badge>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-600">URL:</span>
                              <a
                                href={caseItem.pageUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-700 truncate ml-2 flex items-center space-x-1"
                              >
                                <span className="truncate max-w-32">{caseItem.pageUrl}</span>
                                <ExternalLink className="h-3 w-3 flex-shrink-0" />
                              </a>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">ระดับความเสี่ยง:</span>
                              <Badge className={`text-xs font-semibold border ${getRiskColor(caseItem.riskLevel)}`}>
                                {caseItem.riskLevel === "High"
                                  ? "สูง"
                                  : caseItem.riskLevel === "Medium"
                                    ? "ปานกลาง"
                                    : "ต่ำ"}
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-600">คะแนน AI:</span>
                              <div className="flex items-center space-x-2">
                                <div className="w-16 bg-slate-200 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full transition-all duration-500 ${getScoreColor(caseItem.aiScore)}`}
                                    style={{ width: `${caseItem.aiScore}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs font-semibold">{caseItem.aiScore}%</span>
                              </div>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">ผู้แจ้ง:</span>
                              <span className="font-medium">{caseItem.reportedBy}</span>
                            </div>
                          </div>
                          <div className="mt-3 pt-3 border-t border-slate-200 flex space-x-2">
                            <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                              <Eye className="h-3 w-3 mr-1" />
                              ดูรายละเอียด
                            </Button>
                            {caseItem.status === "Ready" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50 bg-transparent"
                              >
                                <Download className="h-3 w-3 mr-1" />
                                ส่งออก
                              </Button>
                            )}
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
                          รหัสคดี
                        </th>
                        <th className="px-4 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          URL เพจ
                        </th>
                        <th className="px-4 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          สถานะ
                        </th>
                        <th className="px-4 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          ระดับความเสี่ยง
                        </th>
                        <th className="px-4 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          คะแนน AI
                        </th>
                        <th className="px-4 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          ผู้แจ้ง
                        </th>
                        <th className="px-4 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          วันที่ส่ง
                        </th>
                        <th className="px-4 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          การดำเนินการ
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {filteredCases.map((caseItem) => (
                        <tr key={caseItem.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="text-sm font-semibold text-slate-800">#{caseItem.id}</span>
                          </td>
                          <td className="px-4 py-4 max-w-48">
                            <a
                              href={caseItem.pageUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1"
                            >
                              <span className="truncate" title={caseItem.pageUrl}>
                                {caseItem.pageUrl}
                              </span>
                              <ExternalLink className="h-3 w-3 flex-shrink-0" />
                            </a>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(caseItem.status)}
                              <Badge className={`text-xs font-semibold border ${getStatusColor(caseItem.status)}`}>
                                {caseItem.status === "Under Review"
                                  ? "รอตรวจสอบ"
                                  : caseItem.status === "Generating"
                                    ? "กำลังดำเนินการ"
                                    : "เสร็จสิ้น"}
                              </Badge>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <Badge className={`text-xs font-semibold border ${getRiskColor(caseItem.riskLevel)}`}>
                              {caseItem.riskLevel === "High"
                                ? "สูง"
                                : caseItem.riskLevel === "Medium"
                                  ? "ปานกลาง"
                                  : "ต่ำ"}
                            </Badge>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-3">
                              <div className="flex-1 bg-slate-200 rounded-full h-2 w-16">
                                <div
                                  className={`h-2 rounded-full transition-all duration-500 ${getScoreColor(caseItem.aiScore)}`}
                                  style={{ width: `${caseItem.aiScore}%` }}
                                ></div>
                              </div>
                              <span className="text-xs font-semibold text-slate-700 min-w-[3rem]">
                                {caseItem.aiScore}%
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="text-sm text-slate-700 font-medium">{caseItem.reportedBy}</span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="text-sm text-slate-600 font-medium">
                              {new Date(caseItem.submittedAt).toLocaleDateString("th-TH", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-3">
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-blue-300 text-blue-700 hover:bg-blue-50 text-xs px-3 py-1 h-8 bg-transparent"
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                ดูรายละเอียด
                              </Button>
                              {caseItem.status === "Ready" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 text-xs px-3 py-1 h-8 bg-transparent"
                                >
                                  <Download className="h-3 w-3 mr-1" />
                                  ส่งออกรายงาน
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary Card */}
        <Card className="bg-white/90 backdrop-blur-xl border-slate-200 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl lg:text-2xl font-semibold text-slate-800 flex items-center space-x-3">
              <div className="p-2 lg:p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl shadow-lg">
                <TrendingUp className="h-6 w-6 lg:h-8 lg:w-8 text-blue-600" />
              </div>
              <span>สรุปภาพรวม</span>
            </CardTitle>
            <CardDescription className="text-slate-600 font-medium">สถิติการดำเนินการและประสิทธิภาพของระบบ</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-slate-50 to-white rounded-2xl shadow-sm border border-slate-200">
                <div className="text-3xl lg:text-4xl font-bold text-slate-800 mb-2">
                  {cases.length > 0 ? Math.round((statusCounts.Ready / statusCounts.total) * 100) : 0}%
                </div>
                <div className="text-sm font-semibold text-slate-600 uppercase tracking-wide">อัตราความสำเร็จ</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-slate-50 to-white rounded-2xl shadow-sm border border-slate-200">
                <div className="text-3xl lg:text-4xl font-bold text-red-700 mb-2">
                  {cases.filter((c) => c.riskLevel === "High").length}
                </div>
                <div className="text-sm font-semibold text-slate-600 uppercase tracking-wide">คดีความเสี่ยงสูง</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-slate-50 to-white rounded-2xl shadow-sm border border-slate-200">
                <div className="text-3xl lg:text-4xl font-bold text-slate-800 mb-2">
                  {cases.length > 0 ? Math.round(cases.reduce((sum, c) => sum + c.aiScore, 0) / cases.length) : 0}
                </div>
                <div className="text-sm font-semibold text-slate-600 uppercase tracking-wide">คะแนน AI เฉลี่ย</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
