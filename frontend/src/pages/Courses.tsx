import React from 'react';
import { Clock, Users, Star, Play, Book, Box } from 'lucide-react';
import { Button } from '../components/shared/Button';

export const CoursesPage: React.FC = () => {
  const mockCourses = [
    {
      id: '1',
      title: 'Human Anatomy Fundamentals',
      instructor: 'Dr. Sarah Martinez',
      duration: 120,
      level: 'beginner',
      enrollmentCount: 1248,
      rating: 4.8,
      totalRatings: 324,
      hasAR: true,
      price: 99,
      description: 'Comprehensive introduction to human anatomy with interactive 3D models and AR experiences.'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Medical Courses</h1>
        <p className="text-gray-600">Discover our comprehensive medical education programs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockCourses.map((course) => (
          <div key={course.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative h-48 bg-gradient-to-br from-primary-100 to-medical-100 flex items-center justify-center">
              <Book className="h-16 w-16 text-primary-300" />
              
              {course.hasAR && (
                <div className="absolute top-3 right-3 bg-purple-600 text-white px-2 py-1 rounded-md text-xs font-medium flex items-center space-x-1">
                  <Box className="h-3 w-3" />
                  <span>AR</span>
                </div>
              )}
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {course.title}
                </h3>
                <div className="text-lg font-bold text-primary-600">
                  ${course.price}
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-2">by {course.instructor}</p>
              
              <p className="text-sm text-gray-700 mb-4">
                {course.description}
              </p>

              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{course.duration}m</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{course.enrollmentCount.toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>{course.rating}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button variant="primary" className="flex-1">
                  <Play className="h-4 w-4 mr-2" />
                  Enroll Now
                </Button>
                <Button variant="outline">
                  Preview
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
