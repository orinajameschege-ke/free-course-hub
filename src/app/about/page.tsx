import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-black p-8 pt-12 font-sans">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-blue-600 font-bold hover:underline mb-8 block transition-colors">
          ← Back to Hub
        </Link>
        
        <h1 className="text-5xl font-black uppercase italic tracking-tighter mb-10 border-b-8 border-black pb-4">
          About the Hub
        </h1>

        <div className="border-4 border-black p-8 bg-gray-50 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] space-y-6">
          <p className="text-xl leading-relaxed">
            Welcome to the <strong>Free Course Hub</strong>. We believe that high-quality education should be accessible to everyone, everywhere.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Our platform curates over 400+ world-class courses from YouTube and other free providers. We organize them into easy-to-navigate categories like Coding, Design, and AI to help you skip the search and start learning immediately.
          </p>
          <div className="bg-blue-600 text-white p-6 border-4 border-black italic font-bold text-lg">
            "The best investment you can make is in yourself."
          </div>
        </div>
      </div>
    </main>
  );
}