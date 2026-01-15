"use client";
import Link from 'next/link';
import { Analytics } from "@vercel/analytics/react";

export default function CourseHub() {
  return (
    <main className="min-h-screen bg-[#0f1115] text-slate-200 selection:bg-blue-500/30 font-sans">
      {/* Premium Glass Header */}
      <nav className="fixed top-0 w-full z-50 bg-slate-900/50 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold tracking-tight text-white italic">
          FREECOURSE<span className="text-blue-500">HUB</span>
        </Link>
        <div className="flex gap-8 text-sm font-medium uppercase tracking-widest">
          <Link href="/about" className="hover:text-blue-400 transition-colors">About</Link>
          <Link href="/contact" className="hover:text-blue-400 transition-colors">Contact</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 text-center">
        <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter leading-tight">
          ELITE LEARNING.<br /><span className="text-slate-500">ACCESSIBLE TO ALL.</span>
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-slate-400 leading-relaxed font-light">
          A hand-vetted sanctuary of 400+ world-class courses designed for the ambitious 2026 professional.
        </p>
      </section>

      {/* Main Bento Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[250px]">
          <div className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-blue-600 to-indigo-800 rounded-[2rem] p-10 flex flex-col justify-end group transition-all">
            <h2 className="text-4xl font-bold text-white mb-2">The AI Frontier</h2>
            <p className="text-white/70">Top 50 vetted courses for data & automation mastery.</p>
          </div>
          <div className="bg-slate-800/40 border border-white/5 rounded-[2rem] p-8 flex flex-col justify-between hover:bg-slate-800/60 transition-all">
            <h3 className="text-xl font-bold">Development</h3>
            <p className="text-sm text-slate-500">120+ Courses</p>
          </div>
          <div className="bg-slate-800/40 border border-white/5 rounded-[2rem] p-8 flex flex-col justify-between hover:bg-slate-800/60 transition-all">
            <h3 className="text-xl font-bold">Business</h3>
            <p className="text-sm text-slate-500">85+ Courses</p>
          </div>
          <div className="md:col-span-2 bg-slate-800/20 border border-white/10 rounded-[2rem] p-8 flex items-center justify-between">
            <span className="text-2xl font-bold text-white">Creative Design</span>
            <span className="text-blue-500 text-3xl">→</span>
          </div>
        </div>
      </section>
      <Analytics />
    </main>
  );
}