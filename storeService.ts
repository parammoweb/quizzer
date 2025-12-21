
import { Question, GradeLevel, CertificateConfig } from './types';
import { dbService } from './dbService';

const DEFAULT_QUESTIONS: Record<string, Question[]> = {
  'Class 1-2': [
    { id: '1', question: 'What is 5 + 3?', options: ['6', '7', '8', '9'], correctAnswerIndex: 2 },
    { id: '2', question: 'Which animal says "Meow"?', options: ['Dog', 'Cat', 'Cow', 'Lion'], correctAnswerIndex: 1 }
  ]
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

export const getLocalQuestions = async (grade: GradeLevel): Promise<Question[]> => {
  const dbQs = await dbService.getQuestions(grade);
  if (dbQs.length === 0 && DEFAULT_QUESTIONS[grade]) {
    return DEFAULT_QUESTIONS[grade];
  }
  return dbQs;
};

export const saveLocalQuestions = async (grade: GradeLevel, questions: Question[]) => {
  await dbService.saveQuestions(grade, questions);
};

export const getCertConfig = async (): Promise<CertificateConfig> => {
  const config = await dbService.getCertConfig();
  return config || DEFAULT_CERT_CONFIG;
};

export const saveCertConfig = async (config: CertificateConfig) => {
  await dbService.saveCertConfig(config);
};

export const saveAttempt = async (studentName: string, grade: GradeLevel, score: number, total: number) => {
  await dbService.saveAttempt({
    id: `attempt-${Date.now()}`,
    studentName,
    grade,
    score,
    total,
    timestamp: Date.now()
  });
};
