import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 h-20">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        {/* Left Side: Logo */}
        <Link href="/" className="text-xl font-black uppercase italic tracking-tighter">
          Free Course Hub
        </Link>

        {/* Right Side: Navigation Links */}
        <div className="flex items-center gap-6">
          <Link href="/about" className="text-sm font-bold uppercase hover:text-blue-600">
            About
          </Link>
          <Link href="/contact" className="text-sm font-bold uppercase hover:text-blue-600">
            Contact Us
          </Link>
          <a 
            href="https://github.com" 
            target="_blank" 
            className="bg-black text-white px-4 py-2 rounded-full text-xs font-bold uppercase"
          >
            GitHub
          </a>
        </div>
      </div>
    </nav>
  );
}