import React, { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Maximize, ArrowLeft, BookOpen, MessageSquare, CheckCircle } from 'lucide-react';
import { Course, Lesson, Note } from '../../types';

interface CoursePlayerProps {
  course: Course;
  currentLesson: Lesson;
  onBack: () => void;
  onLessonComplete: (lessonId: string) => void;
}

export default function CoursePlayer({ course, currentLesson, onBack, onLessonComplete }: CoursePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(300); // Mock duration in seconds
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [showNotes, setShowNotes] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      const note: Note = {
        id: Date.now().toString(),
        lessonId: currentLesson.id,
        content: newNote,
        timestamp: currentTime,
        createdAt: new Date()
      };
      setNotes([...notes, note]);
      setNewNote('');
    }
  };

  const handleMarkComplete = () => {
    onLessonComplete(currentLesson.id);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-lg font-semibold">{course.title}</h1>
              <p className="text-gray-400 text-sm">{currentLesson.title}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowNotes(!showNotes)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                showNotes ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Notes</span>
            </button>
            
            <button
              onClick={handleMarkComplete}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Mark Complete</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Video Player */}
        <div className={`${showNotes ? 'w-3/4' : 'w-full'} flex flex-col`}>
          {/* Video Area */}
          <div className="flex-1 bg-black flex items-center justify-center relative">
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="w-16 h-16 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{currentLesson.title}</h3>
                <p className="text-gray-400">Video content would be displayed here</p>
              </div>
            </div>
            
            {/* Video Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
              <div className="space-y-4">
                {/* Progress Bar */}
                <div className="flex items-center space-x-4">
                  <span className="text-sm">{formatTime(currentTime)}</span>
                  <div className="flex-1 bg-gray-600 rounded-full h-2 cursor-pointer">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm">{formatTime(duration)}</span>
                </div>
                
                {/* Control Buttons */}
                <div className="flex items-center justify-center space-x-6">
                  <button className="text-white hover:text-blue-400 transition-colors">
                    <SkipBack className="w-6 h-6" />
                  </button>
                  
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="bg-blue-600 hover:bg-blue-700 rounded-full p-3 transition-colors"
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                  </button>
                  
                  <button className="text-white hover:text-blue-400 transition-colors">
                    <SkipForward className="w-6 h-6" />
                  </button>
                  
                  <button className="text-white hover:text-blue-400 transition-colors">
                    <Volume2 className="w-6 h-6" />
                  </button>
                  
                  <button className="text-white hover:text-blue-400 transition-colors">
                    <Maximize className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notes Sidebar */}
        {showNotes && (
          <div className="w-1/4 bg-gray-800 border-l border-gray-700 flex flex-col">
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <BookOpen className="w-5 h-5" />
                <span>My Notes</span>
              </h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {notes.map((note) => (
                <div key={note.id} className="bg-gray-700 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-blue-400 text-sm">{formatTime(note.timestamp)}</span>
                    <span className="text-gray-400 text-xs">
                      {note.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-200 text-sm">{note.content}</p>
                </div>
              ))}
              
              {notes.length === 0 && (
                <div className="text-center text-gray-400 py-8">
                  <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No notes yet. Add your first note!</p>
                </div>
              )}
            </div>
            
            {/* Add Note */}
            <div className="p-4 border-t border-gray-700">
              <div className="space-y-3">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a note at current time..."
                  className="w-full bg-gray-700 text-white placeholder-gray-400 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
                <button
                  onClick={handleAddNote}
                  disabled={!newNote.trim()}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Add Note at {formatTime(currentTime)}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}