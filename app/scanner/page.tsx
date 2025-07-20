"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings,
  Play,
  Pause,
  Trash2,
  Search,
  Zap,
  TrendingUp,
  Eye,
  Plus,
  X,
} from "lucide-react"

interface ScanResult {
  id: string
  url: string
  riskLevel: "Low" | "Medium" | "High"
  score: number
  timestamp: string
  scanType: "manual" | "auto"
  details: {
    profileAge: number
    nameChanges: number
    suspiciousKeywords: string[]
    bankAccount?: string
  }
  recommendation: string
}

export default function ScannerPage() {
  const [activeTab, setActiveTab] = useState<"manual" | "auto">("manual")

  // Manual scan states
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ScanResult | null>(null)
  const [error, setError] = useState("")

  // Auto scan states
  const [autoConfig, setAutoConfig] = useState({
    enabled: false,
    interval: 5,
    keywords: ["โปรโมชั่น", "รางวัล", "ลงทุน"],
  })
  const [autoResults, setAutoResults] = useState<ScanResult[]>([])
  const [autoStats, setAutoStats] = useState({
    total: 0,
    high: 0,
    medium: 0,
    low: 0,
  })
  const [newKeyword, setNewKeyword] = useState("")

  // Auto scan interval
  useEffect(() => {
    if (!autoConfig.enabled) return

    const interval = setInterval(
      async () => {
        try {
          const response = await fetch("/api/auto-scan", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ keywords: autoConfig.keywords }),
          })

          if (response.ok) {
            const newResults = await response.json()
            setAutoResults((prev) => [...newResults, ...prev].slice(0, 20))

            // Update stats
            newResults.forEach((result: ScanResult) => {
              setAutoStats((prev) => ({
                total: prev.total + 1,
                high: prev.high + (result.riskLevel === "High" ? 1 : 0),
                medium: prev.medium + (result.riskLevel === "Medium" ? 1 : 0),
                low: prev.low + (result.riskLevel === "Low" ? 1 : 0),
              }))
            })
          }
        } catch (error) {
          console.error("Auto scan error:", error)
        }
      },
      autoConfig.interval * 60 * 1000,
    )

    return () => clearInterval(interval)
  }, [autoConfig.enabled, autoConfig.interval, autoConfig.keywords])

  const handleManualScan = async () => {
    if (!url.trim()) {
      setError("กรุณาใส่ URL")
      return
    }

    if (!url.includes("facebook.com")) {
      setError("รองรับเฉพาะ Facebook เท่านั้น")
      return
    }

    setLoading(true)
    setError("")
    setResult(null)

    try {
      const response = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) {
        throw new Error("Scan failed")
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการสแกน")
    } finally {
      setLoading(false)
    }
  }

  const toggleAutoScan = () => {
    setAutoConfig((prev) => ({ ...prev, enabled: !prev.enabled }))
  }

  const addKeyword = () => {
    if (newKeyword.trim() && !autoConfig.keywords.includes(newKeyword.trim())) {
      setAutoConfig((prev) => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword.trim()],
      }))
      setNewKeyword("")
    }
  }

  const removeKeyword = (keyword: string) => {
    setAutoConfig((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((k) => k !== keyword),
    }))
  }

  const clearAutoResults = () => {
    setAutoResults([])
    setAutoStats({ total: 0, high: 0, medium: 0, low: 0 })
  }

  const getRiskColor = (level: string) => {
    switch (level) {
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

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "High":
        return <AlertTriangle className="w-4 h-4" />
      case "Medium":
        return <Shield className="w-4 h-4" />
      case "Low":
        return <CheckCircle className="w-4 h-4" />
      default:
        return <Shield className="w-4 h-4" />
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 70) return "bg-emerald-500"
    if (score >= 40) return "bg-amber-500"
    return "bg-red-500"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="p-4 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg">
                  <Shield className="h-12 w-12 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full animate-pulse"></div>
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4">
              ระบบสแกน<span className="text-blue-600">อัตโนมัติ</span>
            </h1>
            <p className="text-xl text-slate-600 font-medium max-w-2xl mx-auto">
              ระบบสแกนอัตโนมัติตลอด 24 ชั่วโมง เพื่อตรวจจับภัยคุกคาม
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <Card className="bg-white/90 backdrop-blur-xl border-slate-200 shadow-xl">
          <div className="flex">
            <button
              onClick={() => setActiveTab("manual")}
              className={`flex-1 py-4 px-6 text-center font-semibold border-b-2 transition-all duration-300 ${
                activeTab === "manual"
                  ? "border-blue-600 text-blue-600 bg-blue-50"
                  : "border-transparent text-slate-600 hover:text-blue-600 hover:bg-slate-50"
              }`}
            >
              <Search className="w-5 h-5 inline mr-3" />
              Manual Scan
            </button>
            <button
              onClick={() => setActiveTab("auto")}
              className={`flex-1 py-4 px-6 text-center font-semibold border-b-2 transition-all duration-300 ${
                activeTab === "auto"
                  ? "border-blue-600 text-blue-600 bg-blue-50"
                  : "border-transparent text-slate-600 hover:text-blue-600 hover:bg-slate-50"
              }`}
            >
              <Zap className="w-5 h-5 inline mr-3" />
              Auto Scan
            </button>
          </div>
        </Card>

        {/* Manual Scan Tab */}
        {activeTab === "manual" && (
          <div className="space-y-8">
            {/* Manual Scan Form */}
            <Card className="bg-white/90 backdrop-blur-xl border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-slate-800 flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl shadow-lg">
                    <Search className="h-6 w-6 text-emerald-600" />
                  </div>
                  <span>สแกนเพจ Facebook</span>
                </CardTitle>
                <CardDescription className="text-slate-600 text-base">
                  ใส่ URL เพจ Facebook เพื่อวิเคราะห์ความเสี่ยงทันที
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="url" className="text-slate-700 font-semibold">
                    URL เพจ Facebook
                  </Label>
                  <div className="flex gap-3">
                    <Input
                      type="url"
                      id="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://www.facebook.com/example-page"
                      className="flex-1 h-12 border-slate-300 focus:border-blue-600 focus:ring-blue-600"
                      disabled={loading}
                    />
                    <Button
                      onClick={handleManualScan}
                      disabled={loading}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-3 h-12 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <Clock className="w-4 h-4 mr-2 animate-spin" />
                          กำลังสแกน...
                        </>
                      ) : (
                        <>
                          <Shield className="w-4 h-4 mr-2" />
                          สแกนเลย
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="font-semibold">{error}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Manual Scan Results */}
            {result && (
              <Card className="bg-white/90 backdrop-blur-xl border-slate-200 shadow-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl font-semibold text-slate-800">ผลการสแกน</CardTitle>
                    <Badge className={`px-4 py-2 text-sm font-semibold border ${getRiskColor(result.riskLevel)}`}>
                      <div className="flex items-center space-x-2">
                        {getRiskIcon(result.riskLevel)}
                        <span>{result.riskLevel} Risk</span>
                      </div>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold text-slate-800 mb-4 text-lg">คะแนนความเสี่ยง</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-600">Score</span>
                            <span className="text-3xl font-bold text-slate-800">{result.score}%</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-4">
                            <div
                              className={`h-4 rounded-full transition-all duration-1000 ${getScoreColor(result.score)}`}
                              style={{ width: `${result.score}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4 p-6 bg-slate-50 rounded-xl">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">อายุเพจ:</span>
                          <span className="font-semibold text-slate-800">{result.details.profileAge} วัน</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">เปลี่ยนชื่อ:</span>
                          <span className="font-semibold text-slate-800">{result.details.nameChanges} ครั้ง</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold text-slate-800 mb-4 text-lg">คำสำคัญต้องสงสัย</h3>
                        <div className="flex flex-wrap gap-2">
                          {result.details.suspiciousKeywords.map((keyword, index) => (
                            <Badge
                              key={index}
                              className="bg-red-50 text-red-700 border-red-200 px-3 py-1 text-sm font-semibold"
                            >
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {result.details.bankAccount && (
                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                          <h4 className="font-semibold text-amber-800 mb-2">เลขบัญชีที่พบ:</h4>
                          <p className="text-amber-700 font-mono text-sm bg-white p-2 rounded border">
                            {result.details.bankAccount}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
                    <h3 className="font-semibold text-blue-900 mb-3 flex items-center space-x-2">
                      <Eye className="h-5 w-5" />
                      <span>คำแนะนำ</span>
                    </h3>
                    <p className="text-blue-800 leading-relaxed">{result.recommendation}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Auto Scan Tab */}
        {activeTab === "auto" && (
          <div className="space-y-8">
            {/* Auto Scan Config */}
            <Card className="bg-white/90 backdrop-blur-xl border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-semibold text-slate-800 flex items-center space-x-3">
                      <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl shadow-lg">
                        <Settings className="h-6 w-6 text-purple-600" />
                      </div>
                      <span>การตั้งค่า Auto Scan</span>
                    </CardTitle>
                    <CardDescription className="text-slate-600 text-base mt-2">
                      กำหนดค่าการสแกนอัตโนมัติและคำสำคัญที่ต้องการติดตาม
                    </CardDescription>
                  </div>
                  <Button
                    onClick={toggleAutoScan}
                    className={`px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 ${
                      autoConfig.enabled
                        ? "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800"
                        : "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800"
                    }`}
                  >
                    {autoConfig.enabled ? (
                      <>
                        <Pause className="w-4 h-4 mr-2" />
                        หยุดการทำงาน
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        เริ่มการทำงาน
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-slate-700 font-semibold">ความถี่การสแกน</Label>
                    <select
                      value={autoConfig.interval}
                      onChange={(e) =>
                        setAutoConfig((prev) => ({ ...prev, interval: Number.parseInt(e.target.value) }))
                      }
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-white"
                    >
                      <option value={1}>ทุก 1 นาที</option>
                      <option value={5}>ทุก 5 นาที</option>
                      <option value={10}>ทุก 10 นาที</option>
                      <option value={30}>ทุก 30 นาที</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-slate-700 font-semibold">สถานะระบบ</Label>
                    <div
                      className={`px-4 py-3 rounded-xl text-sm font-semibold border ${
                        autoConfig.enabled
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-slate-50 text-slate-600 border-slate-200"
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            autoConfig.enabled ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                          }`}
                        ></div>
                        <span>{autoConfig.enabled ? "กำลังทำงาน" : "หยุดทำงาน"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-slate-700 font-semibold">คำสำคัญที่ติดตาม</Label>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {autoConfig.keywords.map((keyword) => (
                      <Badge
                        key={keyword}
                        className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-2 text-sm font-semibold flex items-center space-x-2"
                      >
                        <span>{keyword}</span>
                        <button onClick={() => removeKeyword(keyword)} className="hover:text-blue-600 ml-1">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      placeholder="เพิ่มคำสำคัญใหม่..."
                      className="flex-1 h-12 border-slate-300 focus:border-blue-600 focus:ring-blue-600"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          addKeyword()
                        }
                      }}
                    />
                    <Button
                      onClick={addKeyword}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-6 py-3 h-12 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      เพิ่ม
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Auto Scan Stats */}
            <Card className="bg-white/90 backdrop-blur-xl border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-semibold text-slate-800 flex items-center space-x-3">
                      <div className="p-3 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl shadow-lg">
                        <TrendingUp className="h-6 w-6 text-amber-600" />
                      </div>
                      <span>สถิติการสแกน</span>
                    </CardTitle>
                    <CardDescription className="text-slate-600 text-base mt-2">
                      ผลสรุปการตรวจจับจากระบบอัตโนมัติ
                    </CardDescription>
                  </div>
                  <Button
                    onClick={clearAutoResults}
                    variant="outline"
                    className="border-slate-300 text-slate-600 hover:bg-slate-50 px-4 py-2 rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    ล้างข้อมูล
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center p-6 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="text-4xl font-bold text-slate-800 mb-2">{autoStats.total}</div>
                    <div className="text-sm text-slate-600 font-semibold">ทั้งหมด</div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-red-50 to-white rounded-xl border border-red-200 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="text-4xl font-bold text-red-700 mb-2">{autoStats.high}</div>
                    <div className="text-sm text-slate-600 font-semibold">ความเสี่ยงสูง</div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-amber-50 to-white rounded-xl border border-amber-200 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="text-4xl font-bold text-amber-700 mb-2">{autoStats.medium}</div>
                    <div className="text-sm text-slate-600 font-semibold">ความเสี่ยงกลาง</div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-white rounded-xl border border-emerald-200 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="text-4xl font-bold text-emerald-700 mb-2">{autoStats.low}</div>
                    <div className="text-sm text-slate-600 font-semibold">ความเสี่ยงต่ำ</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Auto Scan Results */}
            {autoResults.length > 0 && (
              <Card className="bg-white/90 backdrop-blur-xl border-slate-200 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold text-slate-800">ผลการสแกนอัตโนมัติ</CardTitle>
                  <CardDescription className="text-slate-600 text-base">
                    รายการเพจที่ตรวจพบจากระบบอัตโนมัติ (แสดง 20 รายการล่าสุด)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {autoResults.map((result) => (
                      <div
                        key={result.id}
                        className="border border-slate-200 rounded-xl p-6 bg-gradient-to-r from-slate-50 to-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <Badge className={`px-3 py-1 text-sm font-semibold border ${getRiskColor(result.riskLevel)}`}>
                            <div className="flex items-center space-x-2">
                              {getRiskIcon(result.riskLevel)}
                              <span>{result.riskLevel}</span>
                            </div>
                          </Badge>
                          <div className="text-3xl font-bold text-slate-800">{result.score}%</div>
                        </div>

                        <div className="text-sm text-slate-600 mb-3 break-all font-mono bg-slate-100 px-3 py-2 rounded-lg">
                          {result.url}
                        </div>

                        <div className="flex flex-wrap gap-2 mb-3">
                          {result.details.suspiciousKeywords.map((keyword, index) => (
                            <Badge
                              key={index}
                              className="bg-red-50 text-red-700 border-red-200 px-2 py-1 text-xs font-semibold"
                            >
                              {keyword}
                            </Badge>
                          ))}
                        </div>

                        <div className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded inline-block">
                          {new Date(result.timestamp).toLocaleString("th-TH")}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
