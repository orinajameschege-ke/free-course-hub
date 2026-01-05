"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import CourseCard from '@/components/CourseCard';

// The categories we want to show on our filter bar
const CATEGORIES = ["All", "AI Tools", "Coding", "Marketing", "Design", "Business"];

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      // 1. Start our database query
      let query = supabase.from('courses').select('*');

      // 2. If a specific category is selected, tell Supabase to only send those!
      if (selectedCategory !== "All") {
        query = query.eq('category', selectedCategory);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (!error) setCourses(data || []);
      setLoading(false);
    };

    fetchCourses();
  }, [selectedCategory]); // This triggers every time the category changes!

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Free Course Hub</h1>

        {/* Category Filter Bar */}
        <div className="flex space-x-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full whitespace-nowrap transition-all ${
                selectedCategory === cat 
                ? "bg-indigo-600 text-white shadow-md" 
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Course Display Grid */}
        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading courses...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}

        {courses.length === 0 && !loading && (
          <div className="text-center py-20 text-gray-500">
            No courses found in this category yet. Our robot is still hunting!
          </div>
        )}
      </div>
    </main>
  );
}