import Link from 'next/link';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white text-black p-8 pt-32 font-sans">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-blue-600 font-bold hover:underline mb-8 block">
          ← Back to Hub
        </Link>
        
        <h1 className="text-5xl font-black uppercase italic tracking-tighter mb-10 border-b-8 border-black pb-4">
          Get In Touch
        </h1>

        <div className="border-4 border-black p-8 bg-gray-50 shadow-[12px_12px_0px_0px_rgba(37,99,235,1)]">
          <p className="text-xl mb-8">
            Have a suggestion for a new course? Found a broken link? Or just want to say hi? 
            Reach out to us below.
          </p>
          
          <div className="space-y-4">
            <div className="border-2 border-black p-4 font-bold text-lg">
              Email: <span className="text-blue-600">hello@freecoursehub.com</span>
            </div>
            <div className="border-2 border-black p-4 font-bold text-lg">
              Twitter: <span className="text-blue-600">@FreeCourseHub</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}