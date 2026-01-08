import React, { useState } from 'react';
import { 
  Save, 
  Plus, 
  Trash2, 
  Upload, 
  X, 
  ChevronRight,
  BookOpen,
  Video,
  FileText,
  HelpCircle,
  Clock
} from 'lucide-react';
import { Course, CourseModule, Lesson } from '../../types';
import { mockCourses } from '../../data/mockCourses';

interface CreateCourseProps {
  onClose: () => void;
  onCourseCreated: (course: Course) => void;
}

export default function CreateCourse({ onClose, onCourseCreated }: CreateCourseProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    originalPrice: '',
    level: 'Beginner' as 'Beginner' | 'Intermediate' | 'Advanced',
    category: 'Development',
    image: '',
    whatYouWillLearn: [''],
    requirements: [''],
    curriculum: [] as CourseModule[]
  });

  const [newModule, setNewModule] = useState({
    title: '',
    lessons: [] as Lesson[]
  });

  const [newLesson, setNewLesson] = useState({
    title: '',
    duration: '',
    type: 'video' as 'video' | 'text' | 'quiz' | 'assignment',
    videoUrl: '',
    content: '',
    isFree: false
  });

  const categories = [
    'Development', 'Business', 'Design', 'Marketing', 'Data Science', 
    'Photography', 'Music', 'Health & Fitness', 'Language', 'Personal Development'
  ];

  const levels = ['Beginner', 'Intermediate', 'Advanced'];

  const steps = [
    { id: 1, title: 'Basic Info', icon: BookOpen },
    { id: 2, title: 'Curriculum', icon: Video },
    { id: 3, title: 'Additional Info', icon: FileText },
    { id: 4, title: 'Review & Publish', icon: Save }
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: string, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field as keyof typeof prev].map((item: string, i: number) => 
        i === index ? value : item
      )
    }));
  };

  const addArrayItem = (field: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field as keyof typeof prev] as string[], '']
    }));
  };

  const removeArrayItem = (field: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as string[]).filter((_, i) => i !== index)
    }));
  };

  const addLesson = () => {
    if (!newLesson.title || !newLesson.duration) return;
    
    const lesson: Lesson = {
      id: `lesson-${Date.now()}`,
      title: newLesson.title,
      duration: newLesson.duration,
      type: newLesson.type,
      videoUrl: newLesson.videoUrl || undefined,
      content: newLesson.content || undefined,
      isFree: newLesson.isFree
    };

    setNewModule(prev => ({
      ...prev,
      lessons: [...prev.lessons, lesson]
    }));

    setNewLesson({
      title: '',
      duration: '',
      type: 'video',
      videoUrl: '',
      content: '',
      isFree: false
    });
  };

  const addModule = () => {
    if (!newModule.title || newModule.lessons.length === 0) return;

    const module: CourseModule = {
      id: `module-${Date.now()}`,
      title: newModule.title,
      duration: calculateModuleDuration(newModule.lessons),
      lessons: newModule.lessons
    };

    setFormData(prev => ({
      ...prev,
      curriculum: [...prev.curriculum, module]
    }));

    setNewModule({ title: '', lessons: [] });
  };

  const calculateModuleDuration = (lessons: Lesson[]): string => {
    const totalMinutes = lessons.reduce((total, lesson) => {
      const [hours, minutes] = lesson.duration.split(/[hm]/).map(n => parseInt(n) || 0);
      return total + (hours * 60) + minutes;
    }, 0);
    
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.title && formData.description && formData.price && formData.category);
      case 2:
        return formData.curriculum.length > 0;
      case 3:
        return formData.whatYouWillLearn.some(item => item.trim()) && 
               formData.requirements.some(item => item.trim());
      default:
        return true;
    }
  };

  const handleSubmit = () => {
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      alert('Please fill in all required fields');
      return;
    }

    const newCourse: Course = {
      id: `course-${Date.now()}`,
      title: formData.title,
      description: formData.description,
      instructor: {
        id: 'instructor-current',
        name: 'Current User', // This would come from auth context
        avatar: 'https://ui-avatars.com/api/?name=Current+User&background=0D8ABC&color=fff',
        bio: 'Course instructor',
        rating: 5.0,
        students: 0
      },
      image: formData.image || 'https://images.pexels.com/photos/2004161/pexels-photo-2004161.jpeg?auto=compress&cs=tinysrgb&w=800',
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
      rating: 5.0,
      reviews: 0,
      duration: calculateModuleDuration(formData.curriculum.flatMap(m => m.lessons)),
      students: '0',
      level: formData.level,
      category: formData.category,
      curriculum: formData.curriculum,
      whatYouWillLearn: formData.whatYouWillLearn.filter(item => item.trim()),
      requirements: formData.requirements.filter(item => item.trim()),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Add to mock courses (in a real app, this would be an API call)
    mockCourses.push(newCourse);
    
    onCourseCreated(newCourse);
    onClose();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Course Basics</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter course title"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe what students will learn"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Level *</label>
                <select
                  value={formData.level}
                  onChange={(e) => handleInputChange('level', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {levels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="19.99"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Original Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.originalPrice}
                  onChange={(e) => handleInputChange('originalPrice', e.target.value)}
                  placeholder="49.99"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course Image URL</label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => handleInputChange('image', e.target.value)}
                placeholder="https://example.com/course-image.jpg"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Course Curriculum</h2>

            {/* Existing Modules */}
            {formData.curriculum.map((module, index) => (
              <div key={module.id} className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">{module.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{module.duration} • {module.lessons.length} lessons</p>
                <div className="space-y-2">
                  {module.lessons.map(lesson => (
                    <div key={lesson.id} className="flex items-center space-x-2 text-sm text-gray-700">
                      <Video className="w-4 h-4" />
                      <span>{lesson.title}</span>
                      <span className="text-gray-500">({lesson.duration})</span>
                      {lesson.isFree && <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Free</span>}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Add New Module */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Add New Module</h3>
              
              <div className="mb-4">
                <input
                  type="text"
                  value={newModule.title}
                  onChange={(e) => setNewModule(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Module title"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Lessons in current module */}
              {newModule.lessons.map((lesson, index) => (
                <div key={lesson.id} className="flex items-center justify-between bg-gray-50 p-3 rounded mb-2">
                  <div className="flex items-center space-x-2">
                    <Video className="w-4 h-4" />
                    <span>{lesson.title}</span>
                    <span className="text-gray-500 text-sm">({lesson.duration})</span>
                  </div>
                  <button
                    onClick={() => setNewModule(prev => ({
                      ...prev,
                      lessons: prev.lessons.filter((_, i) => i !== index)
                    }))}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {/* Add Lesson Form */}
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  value={newLesson.title}
                  onChange={(e) => setNewLesson(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Lesson title"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={newLesson.duration}
                  onChange={(e) => setNewLesson(prev => ({ ...prev, duration: e.target.value }))}
                  placeholder="Duration (e.g., 15 min)"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={newLesson.type}
                  onChange={(e) => setNewLesson(prev => ({ ...prev, type: e.target.value as any }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="video">Video</option>
                  <option value="text">Text</option>
                  <option value="quiz">Quiz</option>
                  <option value="assignment">Assignment</option>
                </select>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isFree"
                    checked={newLesson.isFree}
                    onChange={(e) => setNewLesson(prev => ({ ...prev, isFree: e.target.checked }))}
                    className="rounded"
                  />
                  <label htmlFor="isFree" className="text-sm text-gray-700">Free preview</label>
                </div>
              </div>

              {newLesson.type === 'video' && (
                <div className="mb-4">
                  <input
                    type="url"
                    value={newLesson.videoUrl}
                    onChange={(e) => setNewLesson(prev => ({ ...prev, videoUrl: e.target.value }))}
                    placeholder="Video URL"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <div className="flex space-x-2 mb-4">
                <button
                  onClick={addLesson}
                  disabled={!newLesson.title || !newLesson.duration}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Lesson
                </button>
                <button
                  onClick={addModule}
                  disabled={!newModule.title || newModule.lessons.length === 0}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Module
                </button>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Additional Information</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">What will students learn? *</label>
              {formData.whatYouWillLearn.map((item, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleArrayChange('whatYouWillLearn', index, e.target.value)}
                    placeholder="Learning outcome"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {formData.whatYouWillLearn.length > 1 && (
                    <button
                      onClick={() => removeArrayItem('whatYouWillLearn', index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => addArrayItem('whatYouWillLearn')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                + Add learning outcome
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Requirements *</label>
              {formData.requirements.map((item, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
                    placeholder="Requirement"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {formData.requirements.length > 1 && (
                    <button
                      onClick={() => removeArrayItem('requirements', index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => addArrayItem('requirements')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                + Add requirement
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Review & Publish</h2>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">{formData.title}</h3>
              <p className="text-gray-600 mb-4">{formData.description}</p>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="text-sm font-medium text-gray-700">Category:</span>
                  <span className="ml-2">{formData.category}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Level:</span>
                  <span className="ml-2">{formData.level}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Price:</span>
                  <span className="ml-2">${formData.price}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Modules:</span>
                  <span className="ml-2">{formData.curriculum.length}</span>
                </div>
              </div>

              <div className="mb-4">
                <span className="text-sm font-medium text-gray-700">Learning outcomes:</span>
                <ul className="list-disc list-inside mt-1 text-gray-600">
                  {formData.whatYouWillLearn.filter(item => item.trim()).map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <p className="text-yellow-800 text-sm">
                ⚠️ Once published, your course will be available to students. You can still edit it later.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">Create New Course</h1>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center space-x-2 ${
                    isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isActive ? 'bg-blue-100' : isCompleted ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-medium">{step.title}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-gray-400 mx-4" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-96">
          {renderStep()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <button
            onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            
            {currentStep < 4 ? (
              <button
                onClick={() => {
                  if (validateStep(currentStep)) {
                    setCurrentStep(prev => prev + 1);
                  } else {
                    alert('Please fill in all required fields before continuing.');
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
              >
                Publish Course
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}