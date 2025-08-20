export interface Lesson {
  id: string
  title: string
  description: string
  content: string
  duration_minutes: number
  video_url?: string
  order: number
}

export interface Course {
  id: string
  title: string
  description: string
  category: string
  difficulty: string
  duration_hours: number
  instructor: string
  image_url: string
  lessons: Lesson[]
  created_at: string
  updated_at: string
}

export interface CourseProgress {
  course_id: string
  completed_lessons: string[]
  progress_percentage: number
  last_accessed: string
}
