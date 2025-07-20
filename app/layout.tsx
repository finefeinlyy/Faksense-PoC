"use client"
import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import Link from "next/link"
import Head from "next/head"
import { Shield, BarChart3, Search, Activity, Users, ChevronRight, Sun, Moon } from "lucide-react"
import { Suspense, useState, useEffect, useCallback } from "react"
import { usePathname } from "next/navigation"

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isHomePage = pathname === "/"
  const isSubmitPage = pathname === "/submit"
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  // ตั้งค่า title ตามหน้าที่เปิดอยู่
  const getPageTitle = useCallback(() => {
    switch (pathname) {
      case "/dashboard":
        return "ศูนย์ควบคุม - FakeSense"
      case "/submit":
        return "แจ้งเพจต้องสงสัย - FakeSense"
      case "/scanner":
        return "สแกนเนอร์ - FakeSense"
      case "/review":
        return "คิวตรวจสอบ - FakeSense"
      case "/status":
        return "ติดตามสถานะ - FakeSense"
      case "/info":
        return "ข้อมูล - FakeSense"
      case "/contact":
        return "ติดต่อเรา - FakeSense"
      default:
        return "FakeSense - ระบบตรวจสอบเพจต้องสงสัย"
    }
  }, [pathname])

  // อัปเดต title เมื่อเปลี่ยนหน้า
  useEffect(() => {
    document.title = getPageTitle()
  }, [pathname, getPageTitle])

  return (
    <html lang="th" className="h-full">
      <Head>
        <title>{getPageTitle()}</title>
        <meta name="description" content="ระบบตรวจสอบเพจต้องสงสัยด้วยเทคโนโลยี AI" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        {/* Theme color */}
        <meta name="theme-color" content="#1e3a8a" />
        <meta name="msapplication-TileColor" content="#1e3a8a" />
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={getPageTitle()} />
        <meta property="og:description" content="ระบบตรวจสอบเพจต้องสงสัยด้วยเทคโนโลยี AI" />
        <meta property="og:image" content="/og-image.png" />
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content={getPageTitle()} />
        <meta property="twitter:description" content="ระบบตรวจสอบเพจต้องสงสัยด้วยเทคโนโลยี AI" />
        <meta property="twitter:image" content="/og-image.png" />
      </Head>
      <body className={`${inter.className} h-full`}>
        <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex overflow-hidden">
          {/* Sidebar - Hide on homepage and submit page */}
          {!isHomePage && !isSubmitPage && (
            <Suspense fallback={<div>Loading...</div>}>
              <div
                className={`${
                  isCollapsed ? "w-16" : "w-64"
                } bg-white/95 backdrop-blur-sm border-r border-stone-200 flex flex-col transition-all duration-300 flex-shrink-0 h-full`}
              >
                {/* Header */}
                <div className="p-4 border-b border-stone-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-900 rounded-xl shadow-sm">
                        <Shield className="h-6 w-6 text-white" />
                      </div>
                      {!isCollapsed && (
                        <div className="flex flex-col">
                          <span className="text-xl font-light text-stone-800">
                            Fake<span className="font-medium text-blue-900">Sense</span>
                          </span>
                          <span className="text-xs text-stone-500 font-light -mt-1">ระบบตรวจสอบเพจต้องสงสัย</span>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => setIsCollapsed(!isCollapsed)}
                      className="p-1 rounded-lg hover:bg-stone-100 transition-colors"
                    >
                      <ChevronRight
                        className={`h-4 w-4 text-stone-500 transition-transform ${isCollapsed ? "rotate-180" : ""}`}
                      />
                    </button>
                  </div>
                </div>

                {/* Search Bar */}
                {!isCollapsed && (
                  <div className="p-4 border-b border-stone-100">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stone-400" />
                      <input
                        type="text"
                        placeholder="Search"
                        className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}

                {/* Navigation Menu */}
                <div className="flex-1 py-4">
                  {!isCollapsed && (
                    <div className="px-4 mb-4">
                      <h3 className="text-xs font-medium text-stone-500 uppercase tracking-wider">เมนู</h3>
                    </div>
                  )}
                  <nav className="space-y-1 px-2">
                    <Link
                      href="/dashboard"
                      className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all group ${
                        pathname === "/dashboard"
                          ? "text-blue-900 bg-blue-50 font-medium"
                          : "text-stone-600 hover:text-blue-900 hover:bg-stone-50"
                      }`}
                    >
                      <BarChart3 className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      {!isCollapsed && <span className="font-light">ศูนย์ควบคุม</span>}
                    </Link>
                    <Link
                      href="/scanner"
                      className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all group ${
                        pathname === "/scanner"
                          ? "text-blue-900 bg-blue-50 font-medium"
                          : "text-stone-600 hover:text-blue-900 hover:bg-stone-50"
                      }`}
                    >
                      <Shield className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      {!isCollapsed && <span className="font-light">สแกนเนอร์</span>}
                    </Link>
                    <Link
                      href="/review"
                      className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all group ${
                        pathname === "/review"
                          ? "text-blue-900 bg-blue-50 font-medium"
                          : "text-stone-600 hover:text-blue-900 hover:bg-stone-50"
                      }`}
                    >
                      <Users className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      {!isCollapsed && <span className="font-light">คิวตรวจสอบ</span>}
                    </Link>
                    <Link
                      href="/status"
                      className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all group ${
                        pathname === "/status"
                          ? "text-blue-900 bg-blue-50 font-medium"
                          : "text-stone-600 hover:text-blue-900 hover:bg-stone-50"
                      }`}
                    >
                      <Activity className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      {!isCollapsed && <span className="font-light">ติดตามสถานะ</span>}
                    </Link>
                  </nav>

                  {/* Others Section */}
                  {!isCollapsed && (
                    <>
                      <div className="px-4 mt-8 mb-4">
                        <h3 className="text-xs font-medium text-stone-400 uppercase tracking-wider">อื่นๆ</h3>
                      </div>
                      <nav className="space-y-1 px-2">
                        <Link
                          href="/info"
                          className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all ${
                            pathname === "/info"
                              ? "text-blue-900 bg-blue-50 font-medium"
                              : "text-stone-600 hover:text-blue-900 hover:bg-stone-50"
                          }`}
                        >
                          <div className="h-5 w-5 bg-stone-300 rounded"></div>
                          <span className="font-light">ข้อมูล</span>
                        </Link>
                        <Link
                          href="/contact"
                          className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all ${
                            pathname === "/contact"
                              ? "text-blue-900 bg-blue-50 font-medium"
                              : "text-stone-600 hover:text-blue-900 hover:bg-stone-50"
                          }`}
                        >
                          <div className="h-5 w-5 bg-stone-300 rounded"></div>
                          <span className="font-light">ติดต่อเรา</span>
                        </Link>
                      </nav>
                    </>
                  )}
                </div>

                {/* Bottom Section */}
                <div className="border-t border-stone-100 p-4 space-y-4">
                  {/* Theme Toggle */}
                  {!isCollapsed && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Sun className="h-4 w-4 text-stone-500" />
                        <span className="text-sm text-stone-600 font-light">Light</span>
                      </div>
                      <button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className="relative w-10 h-5 bg-stone-200 rounded-full transition-colors"
                      >
                        <div
                          className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                            isDarkMode ? "translate-x-5" : ""
                          }`}
                        ></div>
                      </button>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-stone-600 font-light">Dark</span>
                        <Moon className="h-4 w-4 text-stone-500" />
                      </div>
                    </div>
                  )}

                  {/* User Profile */}
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">F</span>
                    </div>
                    {!isCollapsed && (
                      <div className="flex-1">
                        <div className="text-sm font-medium text-stone-800">FakeSense Admin</div>
                        <div className="text-xs text-stone-500">admin@fakesense.th</div>
                      </div>
                    )}
                    {!isCollapsed && (
                      <button className="p-1 rounded hover:bg-stone-100">
                        <div className="w-1 h-4 flex flex-col justify-between">
                          <div className="w-1 h-1 bg-stone-400 rounded-full"></div>
                          <div className="w-1 h-1 bg-stone-400 rounded-full"></div>
                          <div className="w-1 h-1 bg-stone-400 rounded-full"></div>
                        </div>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </Suspense>
          )}

          {/* Main Content */}
          <div className="flex-1 flex flex-col min-w-0 h-full">
            <main className="flex-1 p-6 overflow-auto h-full">{children}</main>
          </div>
        </div>
      </body>
    </html>
  )
}