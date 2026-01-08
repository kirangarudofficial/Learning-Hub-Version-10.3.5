import React from 'react';

// Mock data for courses
const courses = [
  { id: 1, title: 'Advanced React Patterns', students: 152, rating: 4.8, status: 'Published' },
  { id: 2, title: 'Modern JavaScript from Scratch', students: 340, rating: 4.9, status: 'Published' },
  { id: 3, title: 'TypeScript for Enterprise', students: 210, rating: 4.7, status: 'Published' },
  { id: 4, title: 'Microservices with Node.js', students: 0, rating: 0, status: 'Draft' },
];

export const MyCourses: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">My Courses</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Create New Course
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {courses.map((course) => (
              <tr key={course.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{course.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.students}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.rating > 0 ? course.rating : 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${course.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {course.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};