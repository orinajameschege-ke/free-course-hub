import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 h-20">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        {/* Left Side: Logo */}
        <Link href="/" className="text-xl font-black uppercase italic tracking-tighter hover:text-blue-600 transition-colors">
          Free Course Hub
        </Link>

        {/* Right Side: Navigation Links */}
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
        </div>
      </div>
    </nav>
  );
}