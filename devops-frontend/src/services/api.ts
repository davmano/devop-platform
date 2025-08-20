import axios from 'axios'
import { Course, Lesson, CourseProgress } from '../types'

const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
})

export const courseApi = {
  getAllCourses: async (): Promise<Course[]> => {
    const response = await api.get('/api/courses')
    return response.data
  },

  getCourse: async (courseId: string): Promise<Course> => {
    const response = await api.get(`/api/courses/${courseId}`)
    return response.data
  },

  getCoursesByCategory: async (category: string): Promise<Course[]> => {
    const response = await api.get(`/api/courses/category/${category}`)
    return response.data
  },

  getLesson: async (courseId: string, lessonId: string): Promise<Lesson> => {
    const response = await api.get(`/api/courses/${courseId}/lessons/${lessonId}`)
    return response.data
  },

  getCategories: async (): Promise<{ categories: string[] }> => {
    const response = await api.get('/api/categories')
    return response.data
  },

  getProgress: async (courseId: string): Promise<CourseProgress> => {
    const response = await api.get(`/api/progress/${courseId}`)
    return response.data
  },

  updateProgress: async (courseId: string, progress: CourseProgress): Promise<{ message: string }> => {
    const response = await api.post(`/api/progress/${courseId}`, progress)
    return response.data
  },
}
