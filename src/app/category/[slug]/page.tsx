import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  
  // Decodes category names with spaces (e.g., "AI tools")
  const slug = decodeURIComponent(resolvedParams?.slug || "");

  if (!slug) return notFound();

  // Fetches courses matching the exact category string in Supabase
  const { data: courses, error } = await supabase
    .from('courses')
    .select('*')
    .eq('category', slug); 

  return (
    <main className="min-h-screen bg-[#0f1115] text-white p-8 pt-32">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="text-blue-500 mb-8 inline-block hover:text-blue-400 transition-colors">
          ← Back to Hub
        </Link>
        
        <h1 className="text-5xl font-black mb-12 capitalize tracking-tighter text-white">
          {slug} Courses
        </h1>

        {error && <p className="text-red-500">Error loading resources.</p>}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses && courses.length > 0 ? (
            courses.map((course) => (
              <div key={course.id} className="bg-slate-800/40 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-md flex flex-col justify-between hover:border-blue-500/30 transition-all group">
                <div>
                  <h2 className="text-xl font-bold mb-3 text-white group-hover:text-blue-400 transition-colors">
                    {course.title}
                  </h2>
                  <p className="text-slate-400 text-sm mb-8 leading-relaxed font-light">
                    {course.description}
                  </p>
                </div>
                
                {/* Clickable link to YouTube */}
                <a 
                  href={course.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-blue-600/10 text-blue-400 text-center py-3 rounded-xl font-bold hover:bg-blue-600 hover:text-white transition-all border border-blue-500/20"
                >
                  Start Learning →
                </a>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-slate-800/20 rounded-[2.5rem] border border-dashed border-white/10">
              <p className="text-slate-500 uppercase tracking-widest text-sm font-bold">
                No courses available in this category yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}