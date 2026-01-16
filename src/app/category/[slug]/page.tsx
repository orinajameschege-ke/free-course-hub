import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  // 1. Next.js 15 Fix: Await the params properly
  const resolvedParams = await params;
  const slug = decodeURIComponent(resolvedParams?.slug || "");

  if (!slug) return notFound();

  // 2. Database Fetch
  const { data: courses, error } = await supabase
    .from('courses')
    .select('*')
    .eq('category', slug);

  return (
    <main className="min-h-screen bg-[#0f1115] text-white p-8 pt-32">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="text-blue-500 mb-8 inline-block hover:underline">← Back to Hub</Link>
        <h1 className="text-5xl font-bold mb-12 capitalize">{slug} Courses</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses?.map((course) => (
            <div key={course.id} className="relative bg-slate-900/60 border border-white/10 p-8 rounded-[2rem] flex flex-col h-full overflow-hidden">
              <h2 className="text-xl font-bold mb-3">{course.title}</h2>
              <p className="text-slate-400 text-sm mb-12 flex-grow">{course.description}</p>
              
              {/* 3. The Click Fix: Standard <a> tag with high Z-index */}
              <a 
                href={course.link} // Matches your 'link' column
                target="_blank" 
                rel="noopener noreferrer"
                className="relative z-50 block w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl text-center transition-all shadow-lg cursor-pointer"
                style={{ pointerEvents: 'auto' }} 
              >
                Watch on YouTube →
              </a>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}