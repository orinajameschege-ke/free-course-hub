"use client";
import Link from 'next/link';
import { Analytics } from "@vercel/analytics/react";

const CATEGORIES = [
  { id: 'Cloud Computing', title: 'Cloud Computing', style: 'bg-slate-800/40' },
  { id: 'Marketing', title: 'Marketing', style: 'bg-slate-800/40' },
  { id: 'Design', title: 'Design', style: 'bg-slate-800/40' },
  { id: 'AI tools', title: 'AI Tools', style: 'md:col-span-2 md:row-span-2 bg-gradient-to-br from-blue-600 to-indigo-900' },
  { id: 'Data', title: 'Data', style: 'bg-slate-800/40' },
  { id: 'Business', title: 'Business', style: 'bg-slate-800/40' },
  { id: 'Chef', title: 'Chef / Culinary', style: 'bg-slate-800/40' },
  { id: 'Coding', title: 'Coding', style: 'md:col-span-2 bg-slate-800/20' },
  { id: 'General Learning', title: 'General Learning', style: 'bg-slate-800/40' },
  { id: 'Cybersecurity', title: 'Cybersecurity', style: 'bg-slate-800/40' },
];

export default function CourseHub() {
  return (
    <main className="min-h-screen bg-[#0f1115] text-slate-200">
      <nav className="fixed top-0 w-full z-50 bg-slate-900/50 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold tracking-tighter text-white italic">
          FREECOURSE<span className="text-blue-500">HUB</span>
        </Link>
        <div className="flex gap-8 text-xs font-bold uppercase tracking-widest">
          <Link href="/about" className="hover:text-blue-400">About</Link>
          <Link href="/contact" className="hover:text-blue-400">Contact</Link>
        </div>
      </nav>

      <section className="pt-40 pb-16 px-6 text-center">
        <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase leading-none">
          THE HUB.
        </h1>
        <p className="max-w-2xl mx-auto mt-6 text-slate-400 font-light">
          A hand-vetted sanctuary of 400+ world-class courses.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[220px]">
          {CATEGORIES.map((cat) => (
            <Link 
              key={cat.id} 
              href={`/category/${cat.id}`}
              className={`${cat.style} border border-white/5 rounded-[2.5rem] p-8 flex flex-col justify-between group hover:border-blue-500/50 transition-all`}
            >
              <span className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              <h3 className="text-2xl font-bold text-white leading-tight">{cat.title}</h3>
            </Link>
          ))}
        </div>
      </section>
      <Analytics />
    </main>
  );
}