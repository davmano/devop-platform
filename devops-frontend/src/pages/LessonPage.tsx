import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CheckCircle, Clock, ExternalLink } from 'lucide-react'
import { courseApi } from '../services/api'

const LessonPage = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [isCompleted, setIsCompleted] = useState(false)

  const { data: course } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => courseApi.getCourse(courseId!),
    enabled: !!courseId,
  })

  const { data: lesson, isLoading } = useQuery({
    queryKey: ['lesson', courseId, lessonId],
    queryFn: () => courseApi.getLesson(courseId!, lessonId!),
    enabled: !!courseId && !!lessonId,
  })

  const { data: progress } = useQuery({
    queryKey: ['progress', courseId],
    queryFn: () => courseApi.getProgress(courseId!),
    enabled: !!courseId,
  })

  const updateProgressMutation = useMutation({
    mutationFn: (newProgress: any) => courseApi.updateProgress(courseId!, newProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progress', courseId] })
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!lesson || !course) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Lesson not found.</p>
        <Link to={`/course/${courseId}`} className="text-blue-600 hover:underline mt-4 inline-block">
          Back to course
        </Link>
      </div>
    )
  }

  const currentLessonIndex = course.lessons.findIndex(l => l.id === lessonId)
  const nextLesson = course.lessons[currentLessonIndex + 1]
  const prevLesson = course.lessons[currentLessonIndex - 1]
  const completedLessons = progress?.completed_lessons || []
  const isLessonCompleted = completedLessons.includes(lessonId!)

  const handleCompleteLesson = () => {
    if (!isLessonCompleted) {
      const newCompletedLessons = [...completedLessons, lessonId!]
      const progressPercentage = (newCompletedLessons.length / course.lessons.length) * 100
      
      updateProgressMutation.mutate({
        course_id: courseId!,
        completed_lessons: newCompletedLessons,
        progress_percentage: progressPercentage,
        last_accessed: new Date().toISOString(),
      })
      setIsCompleted(true)
    }
  }

  const handleNextLesson = () => {
    if (nextLesson) {
      navigate(`/course/${courseId}/lesson/${nextLesson.id}`)
    }
  }

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.split('v=')[1]?.split('&')[0]
    return `https://www.youtube.com/embed/${videoId}`
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link 
          to={`/course/${courseId}`}
          className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to course</span>
        </Link>
        
        <div className="text-sm text-gray-600">
          Lesson {currentLessonIndex + 1} of {course.lessons.length}
        </div>
      </div>

      {/* Lesson Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{lesson.title}</h1>
            <p className="text-gray-600 mb-4">{lesson.description}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{lesson.duration_minutes} minutes</span>
              </div>
              <span className="text-blue-600 font-medium">{course.category}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {(isLessonCompleted || isCompleted) && (
              <div className="flex items-center space-x-1 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm font-medium">Completed</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Video Player */}
      {lesson.video_url && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="aspect-video">
            <iframe
              src={getYouTubeEmbedUrl(lesson.video_url)}
              title={lesson.title}
              className="w-full h-full"
              allowFullScreen
            />
          </div>
          <div className="p-4 border-t">
            <a 
              href={lesson.video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Watch on YouTube</span>
            </a>
          </div>
        </div>
      )}

      {/* Lesson Content */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Lesson Content</h2>
        <div className="prose max-w-none">
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {lesson.content}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between bg-white rounded-lg shadow-md p-6">
        <div>
          {prevLesson && (
            <Link
              to={`/course/${courseId}/lesson/${prevLesson.id}`}
              className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Previous: {prevLesson.title}</span>
            </Link>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {!isLessonCompleted && !isCompleted && (
            <button
              onClick={handleCompleteLesson}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <CheckCircle className="h-4 w-4" />
              <span>Mark Complete</span>
            </button>
          )}

          {nextLesson && (
            <button
              onClick={handleNextLesson}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <span>Next: {nextLesson.title}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default LessonPage
