import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Next.js 15 requires awaiting params
export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  // 1. Critical Build Fix: Ensure slug exists before using it
  if (!slug) {
    return notFound();
  }

  const { data: courses, error } = await supabase
    .from('courses')
    .select('*')
    .eq('category', slug);

  return (
    <main className="min-h-screen bg-[#0f1115] text-white p-8 pt-32">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="text-blue-500 hover:underline mb-8 inline-block">← Back to Hub</Link>
        
        {/* 2. Format title safely */}
        <h1 className="text-5xl font-bold mb-12 capitalize">
          {slug.replace(/-/g, ' ')} Courses
        </h1>

        {error && <p className="text-red-500">Error loading courses.</p>}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses?.length ? (
            courses.map((course) => (
              <div key={course.id} className="bg-slate-800/40 border border-white/5 p-6 rounded-3xl backdrop-blur-md">
                <h2 className="text-xl font-bold mb-2">{course.title}</h2>
                <p className="text-slate-400 text-sm mb-4">{course.description}</p>
                <a href={course.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 font-bold">Start Learning →</a>
              </div>
            ))
          ) : (
            <p className="text-slate-500">No courses found in this category.</p>
          )}
        </div>
      </div>
    </main>
  );
}