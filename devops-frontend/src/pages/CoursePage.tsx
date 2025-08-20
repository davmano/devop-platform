import { useQuery } from '@tanstack/react-query'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Clock, User, BookOpen, Play, CheckCircle } from 'lucide-react'
import { courseApi } from '../services/api'

const CoursePage = () => {
  const { courseId } = useParams<{ courseId: string }>()

  const { data: course, isLoading } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => courseApi.getCourse(courseId!),
    enabled: !!courseId,
  })

  const { data: progress } = useQuery({
    queryKey: ['progress', courseId],
    queryFn: () => courseApi.getProgress(courseId!),
    enabled: !!courseId,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Course not found.</p>
        <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">
          Back to courses
        </Link>
      </div>
    )
  }

  const completedLessons = progress?.completed_lessons || []
  const progressPercentage = progress?.progress_percentage || 0

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Back Button */}
      <Link 
        to="/" 
        className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to courses</span>
      </Link>

      {/* Course Header */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="relative">
          <img 
            src={course.image_url} 
            alt={course.title}
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
            <div className="p-6 text-white">
              <div className="flex items-center space-x-2 mb-2">
                <span className="bg-blue-600 px-2 py-1 rounded text-sm font-medium">
                  {course.category}
                </span>
                <span className="bg-gray-800 bg-opacity-75 px-2 py-1 rounded text-sm">
                  {course.difficulty}
                </span>
              </div>
              <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
              <p className="text-lg opacity-90">{course.description}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Instructor</p>
                <p className="font-medium">{course.instructor}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Duration</p>
                <p className="font-medium">{course.duration_hours} hours</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Lessons</p>
                <p className="font-medium">{course.lessons.length} lessons</p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          {progressPercentage > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm text-gray-600">{Math.round(progressPercentage)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          )}

          <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
            {progressPercentage > 0 ? 'Continue Learning' : 'Start Course'}
          </button>
        </div>
      </div>

      {/* Course Content */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Course Content</h2>
        <div className="space-y-4">
          {course.lessons.map((lesson, index) => {
            const isCompleted = completedLessons.includes(lesson.id)
            const isAccessible = index === 0 || completedLessons.includes(course.lessons[index - 1].id)
            
            return (
              <div 
                key={lesson.id}
                className={`border rounded-lg p-4 transition-colors ${
                  isAccessible ? 'hover:bg-gray-50' : 'bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`flex-shrink-0 ${
                      isCompleted 
                        ? 'text-green-600' 
                        : isAccessible 
                          ? 'text-blue-600' 
                          : 'text-gray-400'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : (
                        <Play className="h-6 w-6" />
                      )}
                    </div>
                    <div>
                      <h3 className={`font-medium ${
                        isAccessible ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {lesson.title}
                      </h3>
                      <p className={`text-sm ${
                        isAccessible ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        {lesson.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`text-sm ${
                      isAccessible ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {lesson.duration_minutes} min
                    </span>
                    {isAccessible && (
                      <Link
                        to={`/course/${courseId}/lesson/${lesson.id}`}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
                      >
                        {isCompleted ? 'Review' : 'Start'}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default CoursePage
