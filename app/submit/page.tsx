"use client"
import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Shield,
  Search,
  Upload,
  CheckCircle,
  AlertTriangle,
  Activity,
  Loader2,
  User,
  FileText,
  Globe,
  Eye,
  ArrowLeft,
} from "lucide-react"

interface SubmitResult {
  caseId: string
  status: string
  message: string
}

export default function Submit() {
  const [url, setUrl] = useState("")
  const [reporterName, setReporterName] = useState("")
  const [description, setDescription] = useState("")
  const [evidence, setEvidence] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SubmitResult | null>(null)
  const [error, setError] = useState("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setEvidence(Array.from(e.target.files))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setResult(null)

    try {
      const formData = new FormData()
      formData.append("url", url)
      formData.append("reporterName", reporterName)
      formData.append("description", description)

      evidence.forEach((file, index) => {
        formData.append(`evidence_${index}`, file)
      })

      const response = await fetch("/api/submit", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong")
      }

      setResult(data)
      // Reset form
      setUrl("")
      setReporterName("")
      setDescription("")
      setEvidence([])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ"
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const validateURL = (url: string) => {
    const facebookPattern = /^https?:\/\/(www\.)?(facebook|fb)\.com\/.+/i
    return facebookPattern.test(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 lg:p-6">
      <div className="max-w-4xl mx-auto space-y-6 lg:space-y-8">
        {/* Back Button */}
        <div className="flex justify-start">
          <Link href="/">
            <Button
              variant="ghost"
              className="bg-white/80 backdrop-blur-sm border border-white/30 shadow-lg hover:bg-white/90 hover:shadow-xl transition-all duration-300 rounded-xl px-6 py-3"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span className="font-semibold text-slate-700">กลับหน้าหลัก</span>
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 lg:p-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="p-4 lg:p-5 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg">
                  <Search className="h-10 w-10 lg:h-12 lg:w-12 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full animate-pulse"></div>
              </div>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4">
              แจ้ง<span className="text-blue-600">เพจต้องสงสัย</span>
            </h1>
            <p className="text-slate-600 text-base lg:text-lg font-medium max-w-2xl mx-auto leading-relaxed">
              ส่ง URL เพจ Facebook ที่ต้องสงสัยเพื่อให้ระบบ AI วิเคราะห์และประเมินความเสี่ยง
            </p>
          </div>
        </div>

        {/* Success Result */}
        {result && (
          <Card className="bg-white/90 backdrop-blur-xl border-slate-200 shadow-xl">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl shadow-lg">
                  <CheckCircle className="h-8 w-8 text-emerald-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-semibold text-emerald-700">ส่งข้อมูลสำเร็จ!</CardTitle>
                  <p className="text-emerald-600 font-medium">ระบบได้รับข้อมูลและเริ่มการวิเคราะห์แล้ว</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-700">Case ID:</span>
                      <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 font-mono font-semibold">
                        {result.caseId}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-700">Status:</span>
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200 font-semibold">{result.status}</Badge>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200">
                  <span className="font-semibold text-slate-700">Message:</span>
                  <p className="mt-2 text-slate-600 font-medium">{result.message}</p>
                </div>
                <div className="pt-4">
                  <Link href={`/status/track/${result.caseId}`}>
                    <Button className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl py-3">
                      <Activity className="h-5 w-5 mr-2" />
                      ติดตามสถานะคดีนี้
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error Message */}
        {error && (
          <Card className="bg-white/90 backdrop-blur-xl border-red-200 shadow-xl">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl shadow-lg">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-red-800 text-lg">เกิดข้อผิดพลาด</h3>
                  <p className="text-red-600 font-medium">{error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Submit Form */}
        <Card className="bg-white/90 backdrop-blur-xl border-slate-200 shadow-xl">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-semibold text-slate-800">ข้อมูลการแจ้ง</CardTitle>
            <CardDescription className="text-slate-600 font-medium">
              กรุณากรอกข้อมูลให้ครบถ้วนเพื่อความแม่นยำในการวิเคราะห์
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* URL Input */}
              <div className="space-y-3">
                <Label htmlFor="url" className="text-slate-700 font-semibold">
                  URL เพจ Facebook <span className="text-red-600">*</span>
                </Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    type="url"
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://facebook.com/suspicious-page"
                    required
                    className="pl-10 h-12 border-slate-300 focus:border-blue-600 focus:ring-blue-600"
                  />
                </div>
                {url && !validateURL(url) && (
                  <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0" />
                    <span className="text-sm text-red-700 font-medium">กรุณาใส่ URL ของ Facebook เท่านั้น</span>
                  </div>
                )}
              </div>

              {/* Reporter Name */}
              <div className="space-y-3">
                <Label htmlFor="reporterName" className="text-slate-700 font-semibold">
                  ชื่อผู้แจ้ง
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    type="text"
                    id="reporterName"
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    placeholder="ชื่อ-นามสกุล (ไม่บังคับ)"
                    className="pl-10 h-12 border-slate-300 focus:border-blue-600 focus:ring-blue-600"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <Label htmlFor="description" className="text-slate-700 font-semibold">
                  รายละเอียดเพิ่มเติม
                </Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    placeholder="อธิบายเหตุผลที่สงสัยว่าเป็นเพจปลอม เช่น หลอกขายของ, แอบอ้างเป็นธนาคาร, ขอข้อมูลส่วนตัว"
                    className="pl-10 border-slate-300 focus:border-blue-600 focus:ring-blue-600 resize-none"
                  />
                </div>
              </div>

              {/* File Upload */}
              <div className="space-y-3">
                <Label htmlFor="evidence" className="text-slate-700 font-semibold">
                  อัปโหลดหลักฐาน (รูปภาพ, สกรีนช็อต)
                </Label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 hover:border-blue-600 hover:bg-blue-50/50 transition-all duration-300">
                  <div className="text-center">
                    <div className="p-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl w-fit mx-auto mb-4">
                      <Upload className="h-8 w-8 text-blue-600" />
                    </div>
                    <input
                      type="file"
                      id="evidence"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="evidence"
                      className="cursor-pointer text-blue-600 hover:text-blue-700 font-semibold text-lg"
                    >
                      คลิกเพื่อเลือกไฟล์
                    </label>
                    <p className="text-sm text-slate-500 mt-2 font-medium">
                      รองรับไฟล์: JPG, PNG, GIF (สูงสุด 5MB ต่อไฟล์)
                    </p>
                  </div>
                </div>
                {evidence.length > 0 && (
                  <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="text-sm font-semibold text-slate-700 mb-3">ไฟล์ที่เลือก:</p>
                    <div className="space-y-2">
                      {evidence.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 shadow-sm"
                        >
                          <span className="text-sm text-slate-700 font-medium truncate">{file.name}</span>
                          <Badge className="bg-slate-100 text-slate-700 border-slate-200 font-semibold">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={loading || !url || !validateURL(url)}
                  className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="animate-spin h-5 w-5 mr-3" />
                      กำลังส่งข้อมูล...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <Search className="h-5 w-5 mr-3" />
                      ส่งข้อมูลเพื่อวิเคราะห์
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Information Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Analysis Info */}
          <Card className="bg-white/90 backdrop-blur-xl border-slate-200 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-slate-800 flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl shadow-lg">
                  <Eye className="h-6 w-6 text-blue-600" />
                </div>
                <span>ระบบจะวิเคราะห์</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  "ประวัติการเปลี่ยนชื่อเพจ",
                  "ความสัมพันธ์ของยอด Like/Comment",
                  "เนื้อหาที่โพสต์และคอมเมนต์",
                  "รูปแบบการหลอกลวง"
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 bg-gradient-to-r from-slate-50 to-white rounded-lg border border-slate-200"
                  >
                    <div className="p-1 bg-blue-100 rounded-full">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="text-slate-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Process Info */}
          <Card className="bg-white/90 backdrop-blur-xl border-slate-200 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-slate-800 flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl shadow-lg">
                  <Shield className="h-6 w-6 text-emerald-600" />
                </div>
                <span>ขั้นตอนถัดไป</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  "ระบบ AI วิเคราะห์ความเสี่ยง",
                  "กรณีเสี่ยงสูง จะใช้ AI ล่อซื้อ",
                  "เจ้าหน้าที่ตรวจสอบผลลัพธ์",
                  "ส่งต่อข้อมูลไปยังหน่วยงานที่เกี่ยวข้อง",
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 bg-gradient-to-r from-slate-50 to-white rounded-lg border border-slate-200"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-sm font-bold text-emerald-700">{index + 1}</span>
                    </div>
                    <span className="text-slate-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}