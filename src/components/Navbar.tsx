import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo / Home Link */}
        <Link href="/" className="text-2xl font-black tracking-tighter uppercase italic hover:text-blue-600 transition-colors">
          Free Course Hub
        </Link>

        {/* Top Right Navigation Sections */}
        <div className="flex items-center gap-8">
          <Link 
            href="/about" 
            className="text-sm font-bold uppercase tracking-widest text-gray-600 hover:text-black transition-colors"
          >
            About
          </Link>
          <Link 
            href="/contact" 
            className="text-sm font-bold uppercase tracking-widest text-gray-600 hover:text-black transition-colors"
          >
            Contact Us
          </Link>
          
          {/* Optional: GitHub Link to match your project's developer feel */}
          <a 
            href="https://github.com" 
            target="_blank" 
            className="bg-black text-white px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95"
          >
            GitHub
          </a>
        </div>
      </div>
    </nav>
  );
}