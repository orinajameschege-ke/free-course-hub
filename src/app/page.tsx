"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function CourseHub() {
  const [courses, setCourses] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getCourses() {
      const { data } = await supabase.from("courses").select("*").order("created_at", { ascending: false });
      if (data) setCourses(data);
      setLoading(false);
    }
    getCourses();
  }, []);

  // Updated categories list with 'Chef'
  const categories = [
    "All", "AI Tools", "Coding", "Cybersecurity", 
    "Cloud Computing", "Data", "Chef", 
    "Marketing", "Design", "Business", "General Learning"
  ];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">Free Course Hub</h1>
          
          {/* High Contrast Search Bar */}
          <div className="max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-5 rounded-2xl border-2 border-blue-200 bg-white text-gray-900 font-bold focus:border-blue-600 outline-none shadow-sm"
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
                selectedCategory === cat ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results Grid */}
        {loading ? (
          <p className="text-center text-gray-500">Loading courses...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <div key={course.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                <img src={course.thumbnail_url} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <span className="text-xs font-black text-blue-600 uppercase">{course.category}</span>
                  <h3 className="text-lg font-bold text-gray-900 mt-2 line-clamp-2 h-14">{course.title}</h3>
                  <a href={course.url} target="_blank" className="mt-4 block text-center py-3 bg-gray-900 text-white rounded-xl font-bold">Start Learning →</a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
