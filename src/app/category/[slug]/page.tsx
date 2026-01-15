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
  
  // Decodes category names (e.g., "AI%20tools" -> "AI tools")
  const slug = decodeURIComponent(resolvedParams?.slug || "");

  if (!slug) return notFound();

  // Fetch only courses that match the category exactly as written in Supabase
  const { data: courses, error } = await supabase
    .from('courses')
    .select('*')
    .eq('category', slug); 

  return (
    <main className="min-h-screen bg-[#0f1115] text-white p-8 pt-32 font-sans">
      <div className="max-w-6xl mx-auto">
        <Link 
          href="/" 
          className="text-blue-500 hover:text-blue-400 mb-8 inline-flex items-center transition-colors font-medium"
        >
          <span className="mr-2">←</span> Back to Hub
        </Link>
        
        <h1 className="text-5xl font-bold mb-12 tracking-tight">
          {slug} Courses
        </h1>

        {error && <p className="text-red-500">Error loading courses.</p>}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses && courses.length > 0 ? (
            courses.map((course) => (
              <div 
                key={course.id} 
                className="bg-slate-800/40 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-md flex flex-col justify-between hover:border-blue-500/30 transition-all duration-300 shadow-2xl"
              >
                <div>
                  <h2 className="text-xl font-bold mb-3 text-white leading-tight">
                    {course.title}
                  </h2>
                  <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                    {course.description}
                  </p>
                </div>
                
                {/* FIXED: href={course.link} pulls the YouTube URL from your 'link' column
                   Using <a> instead of <Link> for external YouTube links
                */}
                <a 
                  href={course.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-2xl transition-all text-center flex items-center justify-center shadow-lg shadow-blue-900/20 block"
                >
                  Start Learning Now
                  <span className="ml-2">→</span>
                </a>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-slate-500 text-lg">No courses found in the "{slug}" category.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}