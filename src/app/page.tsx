"use client";
import Link from 'next/link';
import { Analytics } from "@vercel/analytics/react";

// Professional Category Data for the Grid
const CATEGORIES = [
  { id: 'ai', title: 'Artificial Intelligence', count: '50+', desc: 'Machine Learning & Neural Networks', style: 'md:col-span-2 md:row-span-2 bg-gradient-to-br from-blue-600 to-indigo-900', text: 'text-white' },
  { id: 'development', title: 'Development', count: '120+', desc: 'Fullstack & Mobile', style: 'bg-slate-800/40', text: 'text-slate-200' },
  { id: 'business', title: 'Digital Business', count: '85+', desc: 'Marketing & Strategy', style: 'bg-slate-800/40', text: 'text-slate-200' },
  { id: 'design', title: 'Creative Design', count: '60+', desc: 'UI/UX & Motion', style: 'md:col-span-2 bg-slate-800/20', text: 'text-slate-200' },
  { id: 'cybersecurity', title: 'Cybersecurity', count: '40+', desc: 'Ethical Hacking', style: 'bg-slate-800/40', text: 'text-slate-200' },
  { id: 'data-science', title: 'Data Science', count: '55+', desc: 'Analysis & Viz', style: 'bg-slate-800/40', text: 'text-slate-200' },
];

export default function CourseHub() {
  return (
    <main className="min-h-screen bg-[#0f1115] text-slate-200 selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-900/50 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold tracking-tighter text-white uppercase italic">
          FreeCourse<span className="text-blue-500">Hub</span>
        </Link>
        <div className="flex gap-8 text-xs font-bold uppercase tracking-widest">
          <Link href="/about" className="hover:text-blue-400 transition-colors">About</Link>
          <Link href="/contact" className="hover:text-blue-400 transition-colors">Contact</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-16 px-6 text-center">
        <h1 className="text-5xl md:text-8xl font-black text-white mb-6 tracking-tighter uppercase leading-[0.9]">
          The Library of <br /><span className="text-blue-600">The Future.</span>
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-slate-400 leading-relaxed font-light">
          Access a hand-vetted sanctuary of 400+ world-class courses. <br />Handpicked for the elite 2026 professional.
        </p>
      </section>

      {/* Interactive Bento Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[220px]">
          {CATEGORIES.map((cat) => (
            <Link 
              key={cat.id} 
              href={`/category/${cat.id}`}
              className={`${cat.style} border border-white/5 rounded-[2.5rem] p-8 flex flex-col justify-between group hover:scale-[1.01] hover:border-blue-500/50 transition-all duration-300 shadow-2xl shadow-black/50`}
            >
              <div className="flex justify-between items-start">
                <span className={`text-xs font-bold uppercase tracking-widest opacity-60 ${cat.text}`}>{cat.count} Courses</span>
                <span className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </div>
              <div>
                <h3 className={`text-2xl font-bold mb-1 ${cat.text}`}>{cat.title}</h3>
                <p className={`text-sm opacity-50 ${cat.text}`}>{cat.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Analytics />
    </main>
  );
}