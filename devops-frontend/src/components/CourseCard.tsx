import React from 'react'
import { Link } from 'react-router-dom'
import { Clock, User, Star } from 'lucide-react'
import { Course } from '../types'

interface CourseCardProps {
  course: Course
}

const CourseCard = ({ course }: CourseCardProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800'
      case 'advanced':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Link to={`/course/${course.id}`} className="block">
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
        <div className="relative">
          <img 
            src={course.image_url} 
            alt={course.title}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-4 left-4">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(course.difficulty)}`}>
              {course.difficulty}
            </span>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
              {course.category}
            </span>
            <div className="flex items-center text-yellow-500">
              <Star className="h-4 w-4 fill-current" />
              <span className="text-sm text-gray-600 ml-1">4.8</span>
            </div>
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
            {course.title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {course.description}
          </p>
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>{course.instructor}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{course.duration_hours}h</span>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {course.lessons.length} lessons
            </span>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
              Start Learning
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default CourseCard
