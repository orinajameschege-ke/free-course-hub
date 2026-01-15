import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function CategoryPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const resolvedParams = await params;
  const slug = decodeURIComponent(resolvedParams?.slug || "");

  if (!slug) return notFound();

  // Fetching from your 'courses' table
  const { data: courses, error } = await supabase
    .from('courses')
    .select('*')
    .eq('category', slug); 

  return (
    <main className="min-h-screen bg-[#0f1115] text-white p-8 pt-32">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="text-blue-500 hover:text-blue-400 mb-8 inline-flex items-center">
          <span className="mr-2">←</span> Back to Hub
        </Link>
        
        <h1 className="text-5xl font-bold mb-12 capitalize">{slug} Courses</h1>

        {error && <p className="text-red-500">Error loading data.</p>}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses && courses.length > 0 ? (
            courses.map((course) => (
              <div 
                key={course.id} 
                className="relative bg-slate-800/40 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-md flex flex-col justify-between"
              >
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-3">{course.title}</h2>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {course.description}
                  </p>
                </div>
                
                {/* THE ULTIMATE FIX:
                   1. href={course.link} matches your Supabase column exactly
                   2. 'pointer-events-auto' ensures the button is interactive
                   3. 'z-50' puts the button on top of all transparent card layers
                */}
                <a 
                  href={course.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="relative z-50 pointer-events-auto inline-block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-2xl text-center transition-all shadow-lg active:scale-95"
                >
                  Start Learning Now →
                </a>
              </div>
            ))
          ) : (
            <p className="text-slate-500">No courses available here yet.</p>
          )}
        </div>
      </div>
    </main>
  );
}