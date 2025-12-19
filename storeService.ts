
import { Question, GradeLevel, LocalQuizData, CertificateConfig } from './types';

const STORAGE_KEY = 'quiz_pro_manual_questions';
const CERT_KEY = 'quiz_pro_cert_config';

const DEFAULT_QUESTIONS: LocalQuizData = {
  'Class 1-2': [
    { id: '1', question: 'What is 5 + 3?', options: ['6', '7', '8', '9'], correctAnswerIndex: 2 },
    { id: '2', question: 'Which animal says "Meow"?', options: ['Dog', 'Cat', 'Cow', 'Lion'], correctAnswerIndex: 1 }
  ],
  'Class 3-4': [],
  'Class 5-6': [],
  'Class 7-8': [],
  'Class 9': []
};

const DEFAULT_CERT_CONFIG: CertificateConfig = {
  title: 'CERTIFICATE',
  subTitle: 'Of Achievement',
  issuedBy: 'Smart-Quiz AI assessment',
  signature1: 'School Director',
  signature2: 'AI Examination Body',
  primaryColor: '#1e3a8a',
  useCustomTemplate: false,
  nameXPos: 50,
  nameYPos: 45,
  nameFontSize: 72,
  nameColor: '#000000',
  nameFontFamily: 'Great Vibes'
};

export const getLocalQuestions = (grade: GradeLevel): Question[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return DEFAULT_QUESTIONS[grade] || [];
  const parsed: LocalQuizData = JSON.parse(data);
  return parsed[grade] || [];
};

export const saveLocalQuestions = (grade: GradeLevel, questions: Question[]) => {
  const data = localStorage.getItem(STORAGE_KEY);
  const parsed: LocalQuizData = data ? JSON.parse(data) : { ...DEFAULT_QUESTIONS };
  parsed[grade] = questions;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
};

export const getAllLocalQuestions = (): LocalQuizData => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : { ...DEFAULT_QUESTIONS };
};

export const getCertConfig = (): CertificateConfig => {
  const data = localStorage.getItem(CERT_KEY);
  return data ? JSON.parse(data) : DEFAULT_CERT_CONFIG;
};

export const saveCertConfig = (config: CertificateConfig) => {
  localStorage.setItem(CERT_KEY, JSON.stringify(config));
};
