import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = decodeURIComponent(resolvedParams?.slug || "");

  if (!slug) return notFound();

  // Fetching specifically from the 'link' column seen in your screenshots
  const { data: courses, error } = await supabase
    .from('courses')
    .select('*')
    .eq('category', slug);

  return (
    <main className="min-h-screen bg-[#0f1115] text-white p-8 pt-32">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="text-blue-500 mb-8 inline-block">← Back to Hub</Link>
        <h1 className="text-5xl font-bold mb-12 capitalize">{slug} Courses</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses?.map((course) => (
            <div key={course.id} className="relative bg-slate-800/40 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-md flex flex-col">
              <h2 className="text-xl font-bold mb-3">{course.title}</h2>
              <p className="text-slate-400 text-sm mb-10 flex-grow">{course.description}</p>
              
              {/* THE ULTIMATE FIX:
                 1. We use an 'a' tag (standard for external links)
                 2. 'relative z-50' forces it to stay on top of the blur effect
                 3. 'pointer-events-auto' tells the browser it is clickable
              */}
              <a 
                href={course.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="relative z-50 pointer-events-auto w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl text-center transition-all shadow-xl block"
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