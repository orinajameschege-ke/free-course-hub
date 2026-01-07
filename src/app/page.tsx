"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// 1. Initialize Supabase Client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function CourseHub() {
  const [courses, setCourses] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  // 2. Fetch Data from Supabase
  useEffect(() => {
    async function getCourses() {
      const { data } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) setCourses(data);
      setLoading(false);
    }
    getCourses();
  }, []);

  // 3. New Categories List with your requested filters
  const categories = [
    "All", 
    "AI Tools", 
    "Coding", 
    "Cybersecurity", 
    "Cloud Computing", 
    "Data", 
    "Cooking", 
    "Marketing", 
    "Design", 
    "Business",
    "General Learning"
  ];

  // 4. Combined Search and Filter Logic
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">Free Course Hub</h1>
          <p className="text-xl text-gray-600 mb-8">Access 300+ technical and vocational resources updated daily.</p>
          
          {/* High Contrast Search Bar */}
          <div className="max-w-2xl mx-auto relative group">
            <input
              type="text"
              placeholder="Search by title or topic (e.g., 'Python', 'Chef', 'AWS')..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-5 pl-8 rounded-2xl border-2 border-blue-200 bg-white 
                         text-gray-900 font-bold placeholder-gray-400 
                         focus:border-blue-600 focus:ring-4 focus:ring-blue-100 
                         outline-none transition-all shadow-sm"
            />
          </div>
        </header>

        {/* Updated Category Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all border ${
                selectedCategory === cat 
                  ? "bg-blue-600 text-white border-blue-600 shadow-md scale-105" 
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-blue-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500 font-medium">Syncing courses from database...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <article key={course.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100 overflow-hidden flex flex-col">
                <img src={course.thumbnail_url} className="w-full h-48 object-cover" alt={course.title} />
                <div className="p-6 flex-grow">
                  <div className="flex justify-between items-start mb-3">
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-black rounded-md uppercase tracking-wide">
                      {course.category}
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase">{course.provider}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 leading-snug h-14 line-clamp-2">
                    {course.title}
                  </h3>
                  <a 
                    href={course.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-4 w-full text-center py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-blue-600 transition-colors inline-block"
                  >
                    Start Learning →
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredCourses.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-500 text-xl font-medium">No courses found in "{selectedCategory}"</p>
            <button 
              onClick={() => {setSearchTerm(""); setSelectedCategory("All");}} 
              className="mt-4 text-blue-600 font-bold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </main>
  );
}