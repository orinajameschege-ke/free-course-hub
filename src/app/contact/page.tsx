"use client";
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Transmitting...');
    const { error } = await supabase.from('contacts').insert([formData]);
    if (error) setStatus('Submission Error. Please retry.');
    else {
      setStatus('Success. We will review your inquiry.');
      setFormData({ name: '', email: '', message: '' });
    }
  };

  return (
    <main className="min-h-screen bg-[#0f1115] flex items-center justify-center p-6 pt-32">
      <div className="w-full max-w-xl bg-slate-900/40 border border-white/5 p-12 rounded-[2.5rem] backdrop-blur-lg">
        <h1 className="text-4xl font-bold text-white mb-2">Inquiries</h1>
        <p className="text-slate-500 mb-8 font-light">Direct communication with the FreeCourseHub team.</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input 
            type="text" placeholder="Full Name" required
            className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-white outline-none focus:border-blue-500 transition-all"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          <input 
            type="email" placeholder="Email Address" required
            className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-white outline-none focus:border-blue-500 transition-all"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <textarea 
            rows={4} placeholder="Your Message" required
            className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-white outline-none focus:border-blue-500 transition-all resize-none"
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
          />
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-blue-500/10 uppercase tracking-widest text-xs">
            Send Message
          </button>
          {status && <p className="text-center text-blue-400 text-xs mt-4 tracking-widest">{status}</p>}
        </form>
      </div>
    </main>
  );
}