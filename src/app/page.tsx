import { supabase } from '@/lib/supabase'
import CourseCard from '@/components/CourseCard'

export default async function Home() {
  // This fetches data directly from your database
  const { data: courses, error } = await supabase.from('courses').select('*')

  if (error) {
    return <div className="p-10 text-red-500">Error: {error.message}</div>
  }

  return (
    <main className="p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Available Courses</h1>
      
      {/* If no courses exist yet, show this message */}
      {courses?.length === 0 && <p>No courses found. Add some in Supabase!</p>}

      <div className="grid gap-6">
        {courses?.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </main>
  )
}