"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import CourseCard from '@/components/CourseCard';

const CATEGORIES = ["All", "AI Tools", "Coding", "Marketing", "Design", "Business"];

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState(""); // Track user typing
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      let query = supabase.from('courses').select('*');

      // 1. Filter by Category
      if (selectedCategory !== "All") {
        query = query.eq('category', selectedCategory);
      }

      // 2. Filter by Search Text (Search title or provider)
      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`); 
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (!error) setCourses(data || []);
      setLoading(false);
    };

    // Use a small delay (debounce) so we don't spam the database while typing
    const timeoutId = setTimeout(fetchCourses, 300);
    return () => clearTimeout(timeoutId);
  }, [selectedCategory, searchQuery]); 

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-4xl font-extrabold text-center text-gray-900">Free Course Hub</h1>

        {/* Search Bar */}
        <div className="relative max-w-lg mx-auto">
          <input
            type="text"
            placeholder="Search courses (e.g. 'Python', 'ChatGPT')..."
            className="w-full px-5 py-3 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Bar */}
        <div className="flex space-x-2 overflow-x-auto pb-2 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition ${
                selectedCategory === cat ? "bg-indigo-600 text-white shadow-md" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid Display */}
        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => <CourseCard key={course.id} course={course} />)}
          </div>
        )}
      </div>
    </main>
  );
}