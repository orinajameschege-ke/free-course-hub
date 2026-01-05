interface Course {
  id: string;
  title: string;
  provider: string;
  url: string;
  thumbnail_url?: string;
}

export default function CourseCard({ course }: { course: Course }) {
  return (
    <a 
      href={course.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="block group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all overflow-hidden"
    >
      <div className="aspect-video w-full bg-gray-100 overflow-hidden">
        <img 
          src={course.thumbnail_url || 'https://via.placeholder.com/400x225?text=Course+Image'} 
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4 space-y-2">
        <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
          {course.provider}
        </span>
        <h3 className="font-bold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors">
          {course.title}
        </h3>
        <div className="pt-2 flex items-center text-sm text-indigo-500 font-medium">
          View Course 
          <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </a>
  );
}