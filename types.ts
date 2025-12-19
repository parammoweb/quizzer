
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

export type CertFont = 'Great Vibes' | 'EB Garamond' | 'Plus Jakarta Sans' | 'Dancing Script';

export interface CertificateConfig {
  title: string;
  subTitle: string;
  issuedBy: string;
  signature1: string;
  signature2: string;
  primaryColor: string;
  // New fields for custom PDF/Image template
  useCustomTemplate: boolean;
  templateImage?: string; // Base64 image
  nameXPos: number; // Percentage from left
  nameYPos: number; // Percentage from top
  nameFontSize: number;
  nameColor: string;
  nameFontFamily: CertFont;
}
