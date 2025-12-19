
export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

export type GradeLevel = 'Class 1-2' | 'Class 3-4' | 'Class 5-6' | 'Class 7-8' | 'Class 9';

export interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  userAnswers: number[];
  score: number | null;
  timeLeft: number;
  isCompleted: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface UserProfile {
  name: string;
  grade: GradeLevel;
}
