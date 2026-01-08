import { Course } from '../types';
import { mockCourses } from '../data/mockCourses';

// Courses storage service (for demo purposes, using localStorage)
class CoursesService {
  private storageKey = 'learning-hub-courses';

  // Get all courses
  getAllCourses(): Course[] {
    try {
      const storedCourses = localStorage.getItem(this.storageKey);
      if (storedCourses) {
        const parsed = JSON.parse(storedCourses);
        return [...mockCourses, ...parsed];
      }
    } catch (error) {
      console.warn('Error loading courses from storage:', error);
    }
    return mockCourses;
  }

  // Add a new course
  addCourse(course: Course): void {
    try {
      const existingCourses = this.getStoredCourses();
      const updatedCourses = [...existingCourses, course];
      localStorage.setItem(this.storageKey, JSON.stringify(updatedCourses));
      
      // Also add to the mockCourses array for immediate availability
      mockCourses.push(course);
      
      console.log('Course added successfully:', course.title);
    } catch (error) {
      console.error('Error saving course:', error);
      throw new Error('Failed to save course');
    }
  }

  // Get courses by category
  getCoursesByCategory(category: string): Course[] {
    const allCourses = this.getAllCourses();
    return allCourses.filter(course => 
      course.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Get courses by instructor
  getCoursesByInstructor(instructorId: string): Course[] {
    const allCourses = this.getAllCourses();
    return allCourses.filter(course => course.instructor.id === instructorId);
  }

  // Search courses
  searchCourses(query: string): Course[] {
    const allCourses = this.getAllCourses();
    const lowerQuery = query.toLowerCase();
    
    return allCourses.filter(course =>
      course.title.toLowerCase().includes(lowerQuery) ||
      course.description.toLowerCase().includes(lowerQuery) ||
      course.category.toLowerCase().includes(lowerQuery) ||
      course.instructor.name.toLowerCase().includes(lowerQuery)
    );
  }

  // Get course by ID
  getCourseById(id: string): Course | undefined {
    const allCourses = this.getAllCourses();
    return allCourses.find(course => course.id === id);
  }

  // Update course
  updateCourse(id: string, updatedCourse: Course): void {
    try {
      const storedCourses = this.getStoredCourses();
      const courseIndex = storedCourses.findIndex(course => course.id === id);
      
      if (courseIndex !== -1) {
        storedCourses[courseIndex] = updatedCourse;
        localStorage.setItem(this.storageKey, JSON.stringify(storedCourses));
      }

      // Also update in mockCourses if it exists there
      const mockIndex = mockCourses.findIndex(course => course.id === id);
      if (mockIndex !== -1) {
        mockCourses[mockIndex] = updatedCourse;
      }

      console.log('Course updated successfully:', updatedCourse.title);
    } catch (error) {
      console.error('Error updating course:', error);
      throw new Error('Failed to update course');
    }
  }

  // Delete course
  deleteCourse(id: string): void {
    try {
      const storedCourses = this.getStoredCourses();
      const filteredCourses = storedCourses.filter(course => course.id !== id);
      localStorage.setItem(this.storageKey, JSON.stringify(filteredCourses));

      // Also remove from mockCourses if it exists there
      const mockIndex = mockCourses.findIndex(course => course.id === id);
      if (mockIndex !== -1) {
        mockCourses.splice(mockIndex, 1);
      }

      console.log('Course deleted successfully');
    } catch (error) {
      console.error('Error deleting course:', error);
      throw new Error('Failed to delete course');
    }
  }

  // Get courses stored in localStorage only
  private getStoredCourses(): Course[] {
    try {
      const storedCourses = localStorage.getItem(this.storageKey);
      return storedCourses ? JSON.parse(storedCourses) : [];
    } catch (error) {
      console.warn('Error parsing stored courses:', error);
      return [];
    }
  }

  // Get featured courses
  getFeaturedCourses(): Course[] {
    const allCourses = this.getAllCourses();
    return allCourses
      .filter(course => course.rating >= 4.5)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 6);
  }

  // Get trending courses
  getTrendingCourses(): Course[] {
    const allCourses = this.getAllCourses();
    return allCourses
      .sort((a, b) => parseInt(b.students.replace('k', '')) - parseInt(a.students.replace('k', '')))
      .slice(0, 8);
  }

  // Get course statistics
  getCourseStats(): {
    totalCourses: number;
    totalInstructors: number;
    totalStudents: number;
    categories: string[];
  } {
    const allCourses = this.getAllCourses();
    const instructors = new Set(allCourses.map(course => course.instructor.id));
    const categories = new Set(allCourses.map(course => course.category));
    const totalStudents = allCourses.reduce((sum, course) => {
      const studentCount = parseInt(course.students.replace('k', '').replace(',', '')) * 
        (course.students.includes('k') ? 1000 : 1);
      return sum + studentCount;
    }, 0);

    return {
      totalCourses: allCourses.length,
      totalInstructors: instructors.size,
      totalStudents,
      categories: Array.from(categories)
    };
  }

  // Clear all stored courses (for testing)
  clearStoredCourses(): void {
    localStorage.removeItem(this.storageKey);
  }
}

// Export singleton instance
export const coursesService = new CoursesService();
export default coursesService;