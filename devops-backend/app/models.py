from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class Lesson(BaseModel):
    id: str
    title: str
    description: str
    content: str
    duration_minutes: int
    video_url: Optional[str] = None
    order: int

class Course(BaseModel):
    id: str
    title: str
    description: str
    category: str
    difficulty: str
    duration_hours: int
    instructor: str
    image_url: str
    lessons: List[Lesson]
    created_at: datetime
    updated_at: datetime

class CourseProgress(BaseModel):
    course_id: str
    completed_lessons: List[str]
    progress_percentage: float
    last_accessed: datetime
