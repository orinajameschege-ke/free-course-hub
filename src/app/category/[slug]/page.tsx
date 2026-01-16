import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  // 1. Resolve params (Next.js 15 requirement)
  const resolvedParams = await params;
  const slug = decodeURIComponent(resolvedParams?.slug || "");

  // 2. Fetch data from the 'link' column in Supabase
  const { data: courses, error } = await supabase
    .from('courses')
    .select('id, title, description, link')
    .eq('category', slug);

  if (error) return <div className="p-10 text-red-500">Error: {error.message}</div>;

  return (
    <div className="min-h-screen bg-white text-black p-10">
      <Link href="/" className="text-blue-600 underline mb-10 block">← Back to Homepage</Link>
      
      <h1 className="text-4xl font-bold mb-10">{slug} Courses</h1>

      <div className="space-y-6">
        {courses?.map((course) => (
          <div key={course.id} className="border-2 border-gray-200 p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold mb-2">{course.title}</h2>
            <p className="text-gray-600 mb-6">{course.description}</p>
            
            {/* THE DIRECT LINK: No layers, no blurs, just a standard tag */}
            <a 
              href={course.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded font-bold hover:bg-blue-700"
            >
              GO TO YOUTUBE VIDEO
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}