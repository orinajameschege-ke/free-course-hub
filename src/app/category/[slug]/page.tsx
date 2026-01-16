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

  // 2. Fetch all columns using * to ensure 'link' is included
  const { data: courses, error } = await supabase
    .from('courses')
    .select('*') 
    .eq('category', slug);

  if (error) return <div className="p-10 text-red-500 font-mono">Error: {error.message}</div>;

  return (
    <div className="min-h-screen bg-white text-black p-6 md:p-12 font-sans">
      <Link href="/" className="text-blue-600 hover:underline mb-8 block font-bold">
        ← Return to Homepage
      </Link>
      
      <h1 className="text-4xl font-black mb-10 border-b-4 border-black pb-4 uppercase italic tracking-tighter">
        {slug} Courses
      </h1>

      <div className="grid gap-8">
        {courses && courses.length > 0 ? (
          courses.map((course) => (
            <div key={course.id} className="border-4 border-black p-8 bg-gray-50 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-2xl font-bold mb-2">{course.title}</h2>
              <p className="text-gray-700 mb-8 text-lg">{course.description}</p>
              
              {/* THE DIRECT LINK: No complex layering or thumbnails */}
              <a 
                href={course.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block w-full sm:w-auto bg-black text-white px-10 py-4 font-black uppercase tracking-tighter transition-all duration-200 text-xl text-center border-4 border-black hover:bg-blue-600 active:scale-95 shadow-[4px_4px_0px_0px_rgba(37,99,235,1)] hover:shadow-none"
              >
                Start Learning →
              </a>
            </div>
          ))
        ) : (
          <p className="text-xl italic text-gray-500">No courses available in "{slug}" yet.</p>
        )}
      </div>
    </div>
  );
}