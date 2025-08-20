from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from datetime import datetime

from .models import Course, Lesson, CourseProgress
from .data import get_sample_courses

app = FastAPI(title="DevOps Learning Platform API", version="1.0.0")

# Disable CORS. Do not remove this for full-stack development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

courses_db = {}
user_progress_db = {}

def initialize_courses():
    """Initialize courses on startup"""
    courses_data = get_sample_courses()
    for course_data in courses_data:
        course = Course(**course_data)
        courses_db[course.id] = course

initialize_courses()

@app.get("/healthz")
async def healthz():
    return {"status": "ok"}

@app.get("/api/courses", response_model=List[Course])
async def get_courses():
    """Get all available courses"""
    return list(courses_db.values())

@app.get("/api/courses/{course_id}", response_model=Course)
async def get_course(course_id: str):
    """Get a specific course by ID"""
    if course_id not in courses_db:
        raise HTTPException(status_code=404, detail="Course not found")
    return courses_db[course_id]

@app.get("/api/courses/category/{category}")
async def get_courses_by_category(category: str):
    """Get courses by category"""
    filtered_courses = [course for course in courses_db.values() if course.category.lower() == category.lower()]
    return filtered_courses

@app.get("/api/courses/{course_id}/lessons/{lesson_id}")
async def get_lesson(course_id: str, lesson_id: str):
    """Get a specific lesson from a course"""
    if course_id not in courses_db:
        raise HTTPException(status_code=404, detail="Course not found")
    
    course = courses_db[course_id]
    lesson = next((l for l in course.lessons if l.id == lesson_id), None)
    
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    
    return lesson

@app.post("/api/progress/{course_id}")
async def update_progress(course_id: str, progress: CourseProgress):
    """Update user progress for a course"""
    if course_id not in courses_db:
        raise HTTPException(status_code=404, detail="Course not found")
    
    user_progress_db[course_id] = progress
    return {"message": "Progress updated successfully"}

@app.get("/api/progress/{course_id}")
async def get_progress(course_id: str):
    """Get user progress for a course"""
    if course_id not in courses_db:
        raise HTTPException(status_code=404, detail="Course not found")
    
    if course_id not in user_progress_db:
        return CourseProgress(
            course_id=course_id,
            completed_lessons=[],
            progress_percentage=0.0,
            last_accessed=datetime.now()
        )
    
    return user_progress_db[course_id]

@app.get("/api/categories")
async def get_categories():
    """Get all available course categories"""
    categories = list(set(course.category for course in courses_db.values()))
    return {"categories": categories}
