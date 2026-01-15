import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// We must await params in Next.js 15+
export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  // Safety check to prevent the 'replace' error
  if (!slug) {
    return (
      <main className="min-h-screen bg-[#0f1115] text-white p-8">
        <p>Category not found.</p>
      </main>
    );
  }

  const { data: courses, error } = await supabase
    .from('courses')
    .select('*')
    .eq('category', slug);

  return (
    <main className="min-h-screen bg-[#0f1115] text-white p-8 pt-32">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="text-blue-500 hover:underline mb-8 inline-block">← Back to Hub</Link>
        
        {/* The fix: slug is now guaranteed to exist before calling .replace() */}
        <h1 className="text-5xl font-bold mb-12 capitalize">
          {slug.replace(/-/g, ' ')} Courses
        </h1>

        {error && <p className="text-red-500">Error loading courses.</p>}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses?.map((course) => (
            <div key={course.id} className="bg-slate-800/40 border border-white/5 p-6 rounded-3xl backdrop-blur-md">
              <h2 className="text-xl font-bold mb-2">{course.title}</h2>
              <p className="text-slate-400 text-sm mb-4">{course.description}</p>
              <a href={course.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 font-bold">Start Learning →</a>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}