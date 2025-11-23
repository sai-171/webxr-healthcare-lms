import React from 'react';
import { useParams } from 'react-router-dom';

export const CourseDetail: React.FC = () => {
  const {} = useParams<{ id: string }>();

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Title */}
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Human Anatomy Fundamentals</h1>
      <p className="text-md text-gray-600 mb-2">
        Dive into the basics of human anatomy with interactive modules and AR experiences to make learning engaging and effective.
      </p>

      {/* Video Embed */}
      <div className="aspect-video bg-gray-200 rounded-lg mb-6 overflow-hidden shadow">
        <iframe
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/h8KXzlTnHjs"
          title="Human Anatomy Fundamentals"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        ></iframe>
      </div>

      {/* Lessons List */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Course Lessons</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Introduction to Anatomy and Terminology</li>
          <li>Fundamentals of Cells and Tissues</li>
          <li>Cardiovascular System in Detail</li>
          <li>Musculoskeletal System</li>
          <li>Interactive AR Heart Exploration</li>
        </ul>
      </div>

      {/* Enrollment section */}
      <div className="mt-6 flex justify-end">
        <button className="bg-primary-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-primary-700 transition">
          Enroll
        </button>
      </div>
    </div>
  );
};
