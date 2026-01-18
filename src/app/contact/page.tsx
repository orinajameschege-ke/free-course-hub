import Link from 'next/link';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white text-black p-8 pt-12 font-sans">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-blue-600 font-bold hover:underline mb-8 block transition-colors">
          ← Back to Hub
        </Link>
        
        <h1 className="text-5xl font-black uppercase italic tracking-tighter mb-10 border-b-8 border-black pb-4">
          Get In Touch
        </h1>

        <div className="border-4 border-black p-10 bg-gray-50 shadow-[12px_12px_0px_0px_rgba(37,99,235,1)]">
          <p className="text-2xl font-bold mb-8">
            Have a suggestion for a new course? Found a broken link? Reach out to us below!
          </p>
          
          <div className="space-y-6">
            {/* Updated Email Section */}
            <div className="border-4 border-black p-6 bg-white hover:bg-yellow-50 transition-colors">
              <span className="block text-xs uppercase tracking-widest font-black text-gray-400 mb-1">Email</span>
              <a href="mailto:orinajameschege@gmail.com" className="text-xl font-bold hover:text-blue-600 transition-colors">
                orinajameschege@gmail.com
              </a>
            </div>
            
            {/* Updated WhatsApp Section */}
            <div className="border-4 border-black p-6 bg-white hover:bg-yellow-50 transition-colors">
              <span className="block text-xs uppercase tracking-widest font-black text-gray-400 mb-1">WhatsApp</span>
              <a 
                href="https://wa.me/254705191437" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xl font-bold text-green-600 hover:text-green-700 transition-colors"
              >
                0705191437
              </a>
            </div>
          </div>

          <p className="mt-10 text-gray-500 italic">
            Note: We do not host the videos. All links redirect to the original creators on YouTube.
          </p>
        </div>
      </div>
    </main>
  );
}