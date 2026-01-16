import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Helper function to extract YouTube ID for thumbnails
function getYouTubeID(url: string) {
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url?.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = decodeURIComponent(resolvedParams?.slug || "");

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
      
      <h1 className="text-4xl font-black mb-10 border-b-4 border-black pb-4 uppercase italic">
        {slug} Courses
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {courses && courses.length > 0 ? (
          courses.map((course) => {
            const videoId = getYouTubeID(course.link || "");
            const thumbnailUrl = videoId 
              ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` 
              : null;

            return (
              <div key={course.id} className="border-4 border-black bg-gray-50 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] flex flex-col h-full">
                {/* 1. YouTube Thumbnail Display */}
                <div className="w-full aspect-video bg-gray-200 border-b-4 border-black overflow-hidden">
                  {thumbnailUrl ? (
                    <img 
                      src={thumbnailUrl} 
                      alt={course.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 font-bold uppercase">No Thumbnail</div>
                  )}
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <h2 className="text-xl font-bold mb-4 line-clamp-2">{course.title}</h2>
                  <p className="text-gray-700 mb-8 text-sm leading-relaxed flex-grow">
                    {course.description}
                  </p>
                  
                  {/* 2. Updated Button Text: "Start Learning" */}
                  <a 
                    href={course.link} 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-block w-full bg-black text-white px-6 py-4 font-black uppercase tracking-tighter transition-all duration-200 text-lg text-center border-4 border-black shadow-[4px_4px_0px_0px_rgba(37,99,235,1)] hover:bg-blue-600 hover:translate-x-1 hover:translate-y-1 hover:shadow-none active:scale-95"
                  >
                    Start Learning →
                  </a>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-xl italic text-gray-500">No courses available in "{slug}" yet.</p>
        )}
      </div>
    </div>
  );
}