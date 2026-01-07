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
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) setCourses(data);
      setLoading(false);
    }
    getCourses();
  }, []);

  // 3. Robust Search and Filter Logic
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === "All" || 
      course.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const categories = ["All", "AI Tools", "Coding", "Marketing", "Design", "Business"];

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-2">Free Course Hub</h1>
        <p className="text-gray-600 mb-8">The best free technical resources, updated daily.</p>

        {/* Search Bar - Fixed Visibility */}
        <div className="relative max-w-2xl mx-auto mb-8">
          <input
            type="text"
            placeholder="Search for free courses (e.g. Harvard, Python)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-4 pl-6 rounded-2xl border-2 border-blue-100 bg-white 
                       text-gray-900 font-medium placeholder-gray-400 
                       focus:border-blue-500 focus:ring-4 focus:ring-blue-100 
                       outline-none transition-all shadow-sm"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white shadow-lg scale-105"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Course Grid */}
        {loading ? (
          <p className="text-gray-500">Loading courses...</p>
        ) : filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            {filteredCourses.map((course) => (
              <div key={course.id} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-gray-100">
                <img 
                  src={course.thumbnail_url || "/placeholder.png"} 
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                    {course.provider} • {course.category}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 mt-2 line-clamp-2 h-14">
                    {course.title}
                  </h3>
                  <a
                    href={course.url}
                    target="_blank"
                    className="inline-block mt-4 text-blue-600 font-bold hover:underline"
                  >
                    View Course →
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-dashed border-gray-300">
            <p className="text-gray-500 italic text-lg">No courses found matching "{searchTerm}" in {selectedCategory}.</p>
          </div>
        )}
      </div>
    </main>
  );
}
