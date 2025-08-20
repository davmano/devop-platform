import React from 'react'
import { Link } from 'react-router-dom'
import { GraduationCap, BookOpen, Users } from 'lucide-react'

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">DevOps Academy</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <BookOpen className="h-4 w-4" />
              <span>Courses</span>
            </Link>
            <div className="flex items-center space-x-1 text-gray-600">
              <Users className="h-4 w-4" />
              <span>Community</span>
            </div>
          </nav>

          <div className="flex items-center space-x-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Sign In
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
