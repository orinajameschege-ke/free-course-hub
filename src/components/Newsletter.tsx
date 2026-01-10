"use client";
import { useState, useEffect } from 'react';
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Newsletter() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    // Insert the email into the new subscribers table
    const { error } = await supabase
      .from("subscribers")
      .insert([{ email }]);

    if (error) {
      console.error(error);
      setStatus("error");
    } else {
      setStatus("success");
      setTimeout(() => setIsVisible(false), 3000); // Hide after success
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-8 right-8 z-50 animate-bounce-in">
      <div className="bg-white p-6 rounded-2xl shadow-2xl border-2 border-blue-600 max-w-xs relative">
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 text-gray-400 hover:text-black font-bold"
        >
          ✕
        </button>

        {status === "success" ? (
          <div className="text-center py-4">
            <h3 className="text-lg font-black text-green-600">You're in! 🎉</h3>
            <p className="text-sm text-gray-600">Check your inbox soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubscribe}>
            <h3 className="text-lg font-black text-gray-900 mb-2">Don't Miss Out! 🚀</h3>
            <p className="text-sm text-gray-600 mb-4">
              Get the top 5 free courses of the week delivered to your inbox.
            </p>
            <input 
              type="email" 
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-200 mb-3 text-black font-bold focus:border-blue-600 outline-none"
            />
            <button 
              disabled={status === "loading"}
              className="w-full bg-blue-600 text-white font-black py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            >
              {status === "loading" ? "Joining..." : "Subscribe Now"}
            </button>
            {status === "error" && (
              <p className="text-xs text-red-500 mt-2">Something went wrong. Try again!</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}