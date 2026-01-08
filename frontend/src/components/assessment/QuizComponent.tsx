import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, Award, RotateCcw } from 'lucide-react';
import { Quiz, QuizAttempt, QuizAnswer } from '../../types/assessment';

interface QuizComponentProps {
  quiz: Quiz;
  onComplete: (attempt: QuizAttempt) => void;
  onClose: () => void;
}

export default function QuizComponent({ quiz, onComplete, onClose }: QuizComponentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit ? quiz.timeLimit * 60 : null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [startTime] = useState(new Date());

  useEffect(() => {
    if (timeLeft === null) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === null || prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId: string, answer: string | string[]) => {
    setAnswers(prev => {
      const existing = prev.find(a => a.questionId === questionId);
      const question = quiz.questions.find(q => q.id === questionId);
      
      if (!question) return prev;

      const isCorrect = Array.isArray(question.correctAnswer) 
        ? JSON.stringify(question.correctAnswer.sort()) === JSON.stringify((answer as string[]).sort())
        : question.correctAnswer === answer;

      const newAnswer: QuizAnswer = {
        questionId,
        answer,
        isCorrect,
        pointsEarned: isCorrect ? question.points : 0
      };

      if (existing) {
        return prev.map(a => a.questionId === questionId ? newAnswer : a);
      } else {
        return [...prev, newAnswer];
      }
    });
  };

  const handleSubmit = () => {
    const endTime = new Date();
    const timeSpent = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
    const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);
    const earnedPoints = answers.reduce((sum, a) => sum + a.pointsEarned, 0);
    const score = Math.round((earnedPoints / totalPoints) * 100);
    const passed = score >= quiz.passingScore;

    const attempt: QuizAttempt = {
      id: Date.now().toString(),
      quizId: quiz.id,
      userId: 'current-user', // In real app, get from auth context
      answers,
      score,
      passed,
      timeSpent,
      startedAt: startTime,
      completedAt: endTime
    };

    setIsSubmitted(true);
    onComplete(attempt);
  };

  const currentQ = quiz.questions[currentQuestion];
  const isLastQuestion = currentQuestion === quiz.questions.length - 1;
  const hasAnswered = answers.some(a => a.questionId === currentQ.id);

  if (isSubmitted) {
    const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);
    const earnedPoints = answers.reduce((sum, a) => sum + a.pointsEarned, 0);
    const score = Math.round((earnedPoints / totalPoints) * 100);
    const passed = score >= quiz.passingScore;

    return (
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="text-center">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
            passed ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {passed ? (
              <Award className="w-10 h-10 text-green-600" />
            ) : (
              <XCircle className="w-10 h-10 text-red-600" />
            )}
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            {passed ? 'Congratulations!' : 'Quiz Complete'}
          </h2>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600">{score}%</div>
                <div className="text-gray-600">Your Score</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-800">{earnedPoints}/{totalPoints}</div>
                <div className="text-gray-600">Points Earned</div>
              </div>
            </div>
          </div>

          <div className="text-center mb-6">
            <p className={`text-lg font-semibold ${passed ? 'text-green-600' : 'text-red-600'}`}>
              {passed 
                ? `You passed! (Required: ${quiz.passingScore}%)`
                : `You need ${quiz.passingScore}% to pass. Try again!`
              }
            </p>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={onClose}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              Continue Learning
            </button>
            {!passed && (
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Retake Quiz</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="bg-blue-600 text-white p-6 rounded-t-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{quiz.title}</h2>
            <p className="text-blue-100">{quiz.description}</p>
          </div>
          {timeLeft !== null && (
            <div className="flex items-center space-x-2 bg-blue-700 px-4 py-2 rounded-lg">
              <Clock className="w-5 h-5" />
              <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </span>
          <span className="text-sm text-gray-600">
            {Math.round(((currentQuestion + 1) / quiz.questions.length) * 100)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <div className="p-8">
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">{currentQ.question}</h3>
          
          {currentQ.type === 'multiple_choice' && (
            <div className="space-y-3">
              {currentQ.options?.map((option, index) => (
                <label key={index} className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name={`question-${currentQ.id}`}
                    value={option}
                    onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-gray-800">{option}</span>
                </label>
              ))}
            </div>
          )}

          {currentQ.type === 'true_false' && (
            <div className="space-y-3">
              {['True', 'False'].map((option) => (
                <label key={option} className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name={`question-${currentQ.id}`}
                    value={option}
                    onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-gray-800">{option}</span>
                </label>
              ))}
            </div>
          )}

          {currentQ.type === 'fill_blank' && (
            <input
              type="text"
              placeholder="Enter your answer..."
              onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}

          {currentQ.type === 'essay' && (
            <textarea
              rows={6}
              placeholder="Enter your essay response..."
              onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="flex items-center space-x-2">
            {hasAnswered && (
              <CheckCircle className="w-5 h-5 text-green-600" />
            )}
            <span className="text-sm text-gray-600">
              {currentQ.points} point{currentQ.points !== 1 ? 's' : ''}
            </span>
          </div>

          {isLastQuestion ? (
            <button
              onClick={handleSubmit}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Submit Quiz
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestion(Math.min(quiz.questions.length - 1, currentQuestion + 1))}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}