"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import CourseCard from '@/components/CourseCard';

// 1. Fix the "never" error by defining the shape of your data
interface Course {
  id: string;
  title: string;
  provider: string;
  category: string;
  url: string;
  thumbnail_url?: string;
  description?: string;
}

const CATEGORIES = ["All", "AI Tools", "Coding", "Marketing", "Design", "Business"];

export default function Home() {
  // 2. Use Generics <Course[]> to tell TypeScript this is an array of Courses
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      
      // Start the query
      let query = supabase.from('courses').select('*');

      // Filter by Category if not "All"
      if (selectedCategory !== "All") {
        query = query.eq('category', selectedCategory);
      }

      // Filter by Search Query if text exists
      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (!error) setCourses(data || []);
      setLoading(false);
    };

    // Debounce the search so we don't spam the database while typing
    const timeoutId = setTimeout(fetchCourses, 300);
    return () => clearTimeout(timeoutId);
    
  }, [selectedCategory, searchQuery]);

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold text-gray-900">Free Course Hub</h1>
          <p className="text-gray-500">The best free AI and technical resources, updated daily.</p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-lg mx-auto">
          <input
            type="text"
            placeholder="Search courses (e.g. 'Python', 'ChatGPT')..."
            className="w-full px-5 py-3 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Bar */}
        <div className="flex space-x-2 overflow-x-auto pb-2 no-scrollbar justify-center">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
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
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.length > 0 ? (
              courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))
            ) : (
              <p className="col-span-full text-center py-20 text-gray-500">
                No courses found matching your criteria.
              </p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}