import React, { useState } from 'react';

export const CreateCoursePage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [lessons, setLessons] = useState<string[]>([]);
  const [lessonInput, setLessonInput] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  // Handle adding a new lesson
  const addLesson = () => {
    if (lessonInput.trim()) {
      setLessons([...lessons, lessonInput.trim()]);
      setLessonInput('');
    }
  };

  // Handle course submission (dummy)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here, send to backend or show a success message as needed
    alert('Course created (demo)!');
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Create New Course</h1>
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Course Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Course Title</label>
          <input
            type="text"
            className="block w-full p-2 border border-gray-300 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="E.g. Human Anatomy Fundamentals"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            className="block w-full p-2 border border-gray-300 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Course objectives, topics, and outcomes"
            rows={3}
          />
        </div>

        {/* Add lessons */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Lessons</label>
          <div className="flex space-x-2 mb-2">
            <input
              type="text"
              className="flex-1 p-2 border border-gray-300 rounded"
              value={lessonInput}
              onChange={(e) => setLessonInput(e.target.value)}
              placeholder="Lesson title"
            />
            <button
              type="button"
              className="bg-primary-600 text-white px-4 py-1 rounded"
              onClick={addLesson}
            >
              Add
            </button>
          </div>
          {lessons.length > 0 && (
            <ul className="list-disc pl-6">
              {lessons.map((lesson, idx) => (
                <li key={idx}>{lesson}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Upload/Embed Video (for demo, just URL) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Demo Video (YouTube embed URL)</label>
          <input
            type="text"
            className="block w-full p-2 border border-gray-300 rounded"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://www.youtube.com/embed/xyz"
          />
          {videoUrl && (
            <div className="aspect-video bg-gray-200 rounded mt-3 overflow-hidden">
              <iframe
                width="100%"
                height="100%"
                src={videoUrl}
                title="Demo Course Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="bg-primary-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-primary-700 transition w-full"
        >
          Create Course
        </button>
      </form>
    </div>
  );
};
