import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  // 1. Next.js 15: Await params
  const resolvedParams = await params;
  const slug = decodeURIComponent(resolvedParams?.slug || "");

  // 2. Fetch data (selecting all columns to be safe)
  const { data: courses, error } = await supabase
    .from('courses')
    .select('*') 
    .eq('category', slug);

  if (error) return <div className="p-10 text-red-500 font-mono">Error: {error.message}</div>;

  return (
    <div className="min-h-screen bg-white text-black p-6 md:p-12">
      <Link href="/" className="text-blue-600 hover:underline mb-8 block font-bold">
        ← Back to Categories
      </Link>
      
      <h1 className="text-4xl font-black mb-10 border-b-4 border-black pb-4 uppercase italic">
        {slug} Courses
      </h1>

      <div className="grid gap-10">
        {courses && courses.length > 0 ? (
          courses.map((course) => (
            <div key={course.id} className="border-4 border-black p-8 bg-gray-50 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
              <h2 className="text-2xl font-bold mb-4">{course.title}</h2>
              <p className="text-gray-700 mb-8 text-lg leading-relaxed">{course.description}</p>
              
              {/* THE DIRECT LINK */}
              <a 
                href={course.link} 
                target="_blank" 
                rel="noreferrer"
                className="inline-block w-full sm:w-auto bg-blue-600 text-white px-12 py-5 font-black uppercase tracking-tighter transition-all duration-200 text-xl text-center border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-black active:scale-95 active:shadow-none"
              >
                Watch Video Now →
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