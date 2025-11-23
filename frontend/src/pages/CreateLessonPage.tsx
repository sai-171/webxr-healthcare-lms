import React, { useState } from 'react';

export const CreateLessonPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  // Dummy submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Lesson created (demo)!');
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Create New Lesson</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Lesson Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Lesson Title</label>
          <input
            type="text"
            className="block w-full p-2 border border-gray-300 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="E.g. Cardiovascular System Overview"
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
            placeholder="Topics covered, learning objectives, etc."
            rows={3}
          />
        </div>

        {/* Video URL (YouTube Embed) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Lesson Video (YouTube embed URL)</label>
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
                title="Lesson Video"
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
          Create Lesson
        </button>
      </form>
    </div>
  );
};
