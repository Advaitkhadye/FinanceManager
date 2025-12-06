"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Shield, Zap, LayoutDashboard } from "lucide-react";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-[#1a1b1e] text-white font-sans selection:bg-blue-500/30">
            {/* Navbar */}
            <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-600 rounded-lg">
                        <LayoutDashboard className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-xl tracking-tight">MoneyManager</span>
                </div>
                <Link
                    href="/dashboard"
                    className="bg-white text-black px-5 py-2.5 rounded-full font-medium text-sm hover:bg-gray-100 transition-colors"
                >
                    Get Started
                </Link>
            </nav>

            {/* Hero Section */}
            <main className="max-w-7xl mx-auto px-6 pt-20 pb-32">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
                            Master Your <br />
                            <span className="text-blue-500">Finances</span> with <br />
                            AI Insights
                        </h1>
                        <p className="text-gray-400 text-lg lg:text-xl max-w-lg leading-relaxed">
                            Track, Analyze, and Optimize Your Wealth Efficiently. Stop guessing and start growing your net worth today.
                        </p>
                        <div className="flex items-center gap-4">
                            <Link
                                href="/dashboard"
                                className="bg-blue-600 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-blue-700 transition-all flex items-center gap-2 group"
                            >
                                Get Started
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>

                    {/* Hero Image / Chart Representation */}
                    <div className="relative flex justify-center items-center">
                        <div className="absolute -inset-4 bg-blue-500/20 blur-3xl rounded-full opacity-50"></div>
                        <div className="relative p-8 bg-gray-800/50 rounded-2xl border border-gray-700 backdrop-blur-sm shadow-2xl">
                            {/* Chart Container */}
                            <div className="w-[340px] h-[300px] relative flex items-end justify-between px-4 pb-4">

                                {/* Bars */}
                                <div className="w-8 bg-gradient-to-t from-blue-700 to-blue-500 rounded-t-md h-[30%]"></div>
                                <div className="w-8 bg-gradient-to-t from-blue-700 to-blue-500 rounded-t-md h-[45%]"></div>
                                <div className="w-8 bg-gradient-to-t from-blue-700 to-blue-500 rounded-t-md h-[40%]"></div>
                                <div className="w-8 bg-gradient-to-t from-blue-700 to-blue-500 rounded-t-md h-[60%]"></div>
                                <div className="w-8 bg-gradient-to-t from-blue-700 to-blue-500 rounded-t-md h-[55%]"></div>
                                <div className="w-8 bg-gradient-to-t from-blue-700 to-blue-500 rounded-t-md h-[75%]"></div>
                                <div className="w-8 bg-gradient-to-t from-blue-700 to-blue-500 rounded-t-md h-[90%]"></div>

                                {/* Trend Arrow SVG */}
                                <svg className="absolute top-0 left-0 w-full h-full pointer-events-none drop-shadow-lg" viewBox="0 0 340 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <defs>
                                        <linearGradient id="arrowGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#3b82f6" />
                                            <stop offset="100%" stopColor="#60a5fa" />
                                        </linearGradient>
                                    </defs>
                                    {/* Arrow Line */}
                                    <path
                                        d="M20 200 L60 160 L100 180 L140 120 L180 140 L220 80 L320 20"
                                        stroke="url(#arrowGradient)"
                                        strokeWidth="8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    {/* Arrow Head */}
                                    <path
                                        d="M290 20 L320 20 L320 50"
                                        stroke="url(#arrowGradient)"
                                        strokeWidth="8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>

                                {/* Bottom Curve */}
                                <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full opacity-80"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="mt-32 grid md:grid-cols-3 gap-6">
                    <div className="bg-white/5 p-8 rounded-2xl border border-white/10 hover:border-blue-500/50 transition-colors group">
                        <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500 transition-colors">
                            <Zap className="w-6 h-6 text-blue-400 group-hover:text-white" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3">Smart Tracking</h3>
                        <p className="text-gray-400 leading-relaxed">
                            Track spending automatically. Clean and intuitive interface that just works.
                        </p>
                    </div>

                    <div className="bg-white/5 p-8 rounded-2xl border border-white/10 hover:border-blue-500/50 transition-colors group">
                        <div className="w-12 h-12 bg-violet-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-violet-500 transition-colors">
                            <CheckCircle2 className="w-6 h-6 text-violet-400 group-hover:text-white" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3">AI Financial Advisor</h3>
                        <p className="text-gray-400 leading-relaxed">
                            Get real-time advice powered by Gemini 2.0. It's like having a CFO in your pocket.
                        </p>
                    </div>

                    <div className="bg-white/5 p-8 rounded-2xl border border-white/10 hover:border-blue-500/50 transition-colors group">
                        <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-500 transition-colors">
                            <Shield className="w-6 h-6 text-emerald-400 group-hover:text-white" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3">Secure & Private</h3>
                        <p className="text-gray-400 leading-relaxed">
                            Your financial data is yours. We prioritize security and privacy above all else.
                        </p>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-white/10 py-12">
                <div className="max-w-7xl mx-auto px-6 flex justify-center text-gray-500 text-sm">
                    © 2025 MoneyManager. Built with Next.js & Gemini.
                </div>
            </footer>
        </div>
    );
}
