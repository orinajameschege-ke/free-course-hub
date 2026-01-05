"use client";
import { useState, useEffect } from 'react';

const CATEGORIES = ["All", "AI Tools", "Coding", "Marketing", "Design", "Business"];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    async function fetchFilteredCourses() {
      let query = supabase.from('courses').select('*');
      
      // If a specific category is chosen, filter the database result
      if (selectedCategory !== "All") {
        query = query.eq('category', selectedCategory);
      }
      
      const { data } = await query;
      setCourses(data || []);
    }
    fetchFilteredCourses();
  }, [selectedCategory]); // Re-runs every time user clicks a new button!

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {/* Category Navigation Bar */}
      <div className="flex space-x-2 overflow-x-auto pb-4 mb-8">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition ${
              selectedCategory === cat 
              ? "bg-blue-600 text-white shadow-lg" 
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      
      {/* Your Course Grid goes here... */}
    </div>
  );
}