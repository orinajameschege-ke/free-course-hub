import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  // 1. Resolve params for Next.js 15
  const resolvedParams = await params;
  const slug = decodeURIComponent(resolvedParams?.slug || "");

  if (!slug) return notFound();

  // 2. Fetch data using the 'link' column from your Supabase screenshot
  const { data: courses, error } = await supabase
    .from('courses')
    .select('*')
    .eq('category', slug);

  return (
    <main className="min-h-screen bg-[#0f1115] text-white p-8 pt-32">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="text-blue-500 mb-8 inline-block hover:underline">← Back to Hub</Link>
        <h1 className="text-5xl font-bold mb-12 capitalize tracking-tight">{slug} Courses</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses?.map((course) => (
            <div 
              key={course.id} 
              className="relative bg-slate-900/40 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-md flex flex-col h-full overflow-visible"
            >
              <h2 className="text-xl font-bold mb-3">{course.title}</h2>
              <p className="text-slate-400 text-sm mb-12 flex-grow leading-relaxed">
                {course.description}
              </p>
              
              {/* THE CRITICAL FIX:
                  1. href={course.link} - Points to your YouTube URL
                  2. relative z-[100] - Puts the button physically above all blurs/layers
                  3. pointer-events-auto - Forces the browser to recognize the click
              */}
              <a 
                href={course.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="relative z-[100] pointer-events-auto block w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl text-center transition-all shadow-2xl active:scale-95 cursor-pointer"
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