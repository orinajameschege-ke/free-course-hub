export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#0f1115] text-slate-200 p-8 md:p-24 pt-32">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold mb-12 text-white">Our Philosophy</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
          <div className="md:col-span-2 md:row-span-2 bg-slate-800/40 border border-slate-700 rounded-[2.5rem] p-12 flex flex-col justify-end">
            <h2 className="text-3xl font-bold mb-4 text-blue-400">Knowledge as a Right.</h2>
            <p className="text-lg leading-relaxed text-slate-400 font-light">
              We sift through thousands of resources to bring you only the most relevant, high-impact learning paths available online today.
            </p>
          </div>
          <div className="bg-slate-800/40 border border-slate-700 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center">
            <span className="text-7xl font-black text-white">400+</span>
            <p className="text-slate-500 mt-2 uppercase tracking-widest text-xs font-bold">Catalogued Courses</p>
          </div>
          <div className="bg-slate-800/40 border border-slate-700 rounded-[2.5rem] p-8 flex flex-col justify-center">
            <h3 className="text-xl font-bold mb-2">Curated Daily</h3>
            <p className="text-slate-500 text-sm">Every link is checked weekly for accuracy and availability.</p>
          </div>
        </div>
      </div>
    </main>
  );
}