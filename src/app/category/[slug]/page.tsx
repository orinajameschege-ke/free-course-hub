import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  // 1. Properly await params for Next.js 15
  const resolvedParams = await params;
  const slug = decodeURIComponent(resolvedParams?.slug || "");

  // 2. Fetch all columns to avoid "column does not exist" errors
  const { data: courses, error } = await supabase
    .from('courses')
    .select('*') 
    .eq('category', slug);

  if (error) return <div className="p-10 text-red-500 font-mono">Database Error: {error.message}</div>;

  return (
    <div className="min-h-screen bg-white text-black p-10 font-sans">
      <Link href="/" className="text-blue-600 hover:underline mb-8 block font-bold">
        ← Return to Homepage
      </Link>
      
      <h1 className="text-4xl font-black mb-10 border-b-4 border-black pb-4 uppercase italic">
        {slug} Courses
      </h1>

      <div className="grid gap-8">
        {courses && courses.length > 0 ? (
          courses.map((course) => (
            <div key={course.id} className="border-4 border-black p-8 bg-gray-50 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-2xl font-bold mb-4">{course.title}</h2>
              <p className="text-gray-700 mb-8 text-lg">{course.description}</p>
              
              {/* THE DIRECT LINK: No complex layering */}
              <a 
                href={course.link || course.url || "#"} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block bg-black text-white px-10 py-4 font-black uppercase tracking-tighter hover:bg-blue-600 transition-colors text-xl"
              >
                Open YouTube Video →
              </a>
            </div>
          ))
        ) : (
          <p className="text-xl italic text-gray-500">No courses found in the "{slug}" category.</p>
        )}
      </div>
    </div>
  );
}