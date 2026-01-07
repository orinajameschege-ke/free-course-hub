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

  const categories = [
    "All", "AI Tools", "Coding", "Cybersecurity", 
    "Cloud Computing", "Data", "Cooking", 
    "Marketing", "Design", "Business"
  ];

  // Logic to handle search + category filtering
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Free Course Hub</h1>
          
          {/* High Contrast Search Bar */}
          <div className="max-w-xl mx-auto relative">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-4 rounded-xl border-2 border-blue-200 bg-white text-gray-900 font-bold focus:border-blue-500 outline-none"
            />
          </div>
        </header>

        {/* Dynamic Category Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                selectedCategory === cat ? "bg-blue-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <img src={course.thumbnail_url} className="w-full h-40 object-cover" />
              <div className="p-4">
                <span className="text-xs font-bold text-blue-500 uppercase">{course.category}</span>
                <h3 className="text-md font-bold text-gray-900 mt-1">{course.title}</h3>
                <a href={course.url} target="_blank" className="inline-block mt-3 text-sm font-bold text-blue-600">View Course →</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
