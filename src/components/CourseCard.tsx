export default function CourseCard({ course }: { course: any }) {
  return (
    <div className="p-4 border rounded shadow">
      <h2 className="text-xl font-bold">{course.title}</h2>
      <p>{course.description}</p>
    </div>
  )
}