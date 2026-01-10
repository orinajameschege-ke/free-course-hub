"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Head from 'next/head';
import Newsletter from '@/components/Newsletter';

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
      // Fetching 400 courses for a well-populated site
      const { data } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(400);
      
      if (data) setCourses(data);
      setLoading(false);
    }
    getCourses();
  }, []);

  const categories = ["All", "AI Tools", "Coding", "Cybersecurity", "Cloud Computing", "Data", "Chef", "Marketing", "Design", "Business", "General Learning"];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Head>
        <title>Free Course Hub | 400+ Free YouTube Courses</title>
        <meta name="description" content="Discover curated free courses in Coding, AI, Chef, and Cybersecurity." />
        
        {/* Mandatory AdSense Verification Meta Tag */}
        <meta name="google-adsense-account" content="ca-pub-6287383384390386" />

        {/* Mandatory AdSense Script Snippet */}
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6287383384390386"
          crossOrigin="anonymous"
        ></script>
      </Head>

      <main className="min-h-screen bg-gray-50 p-6 md:p-12">
        <div className="max-w-7xl mx-auto">
          <header className="text-center mb-10">
            <h1 className="text-5xl font-black text-gray-900 mb-4">Free Course Hub</h1>
            <div className="max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Search 400+ free courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-5 rounded-2xl border-2 border-blue-200 bg-white text-gray-900 font-bold focus:border-blue-600 outline-none shadow-md"
              />
            </div>
          </header>

          {/* AdSense Display Slot */}
          <div className="max-w-4xl mx-auto mb-10 p-4 bg-white rounded-xl border border-gray-200 shadow-sm text-center min-h-[100px] flex flex-col justify-center">
             <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Advertisement</p>
             <ins className="adsbygoogle"
                  style={{ display: 'block' }}
                  data-ad-client="ca-pub-6287383384390386"
                  data-ad-slot="auto"
                  data-ad-format="auto"
                  data-full-width-responsive="true"></ins>
             <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((cat) => (
              <button 
                key={cat} 
                onClick={() => setSelectedCategory(cat)} 
                className={`px-5 py-2 rounded-xl text-sm font-bold border transition-all ${
                    selectedCategory === cat ? "bg-blue-600 text-white shadow-lg border-blue-600" : "bg-white text-gray-700 border-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-20 font-bold text-gray-400">Loading 400+ Resources...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course) => (
                <div key={course.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-xl transition-all">
                  <img src={course.thumbnail_url} alt={course.title} className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <span className="text-xs font-black text-blue-600 uppercase tracking-widest">{course.category}</span>
                    <h3 className="text-lg font-bold text-gray-900 mt-2 line-clamp-2 h-14">{course.title}</h3>
                    <a href={course.url} target="_blank" className="mt-4 block text-center py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-blue-600 transition-colors">Start Learning →</a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <Newsletter />
      </main>
    </>
  );
}