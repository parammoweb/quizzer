
export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

export type GradeLevel = 'Class 1-2' | 'Class 3-4' | 'Class 5-6' | 'Class 7-8' | 'Class 9';

export interface UserProfile {
  name: string;
  grade: GradeLevel;
}

export interface LocalQuizData {
  [key: string]: Question[]; // key is GradeLevel
}
