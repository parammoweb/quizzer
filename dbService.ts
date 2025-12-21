
import { Question, GradeLevel, CertificateConfig } from './types';

const DB_NAME = 'SmartQuizProDB';
const DB_VERSION = 1;

export interface QuizAttempt {
  id: string;
  studentName: string;
  grade: GradeLevel;
  score: number;
  total: number;
  timestamp: number;
}

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('questions')) {
        db.createObjectStore('questions', { keyPath: 'grade' });
      }
      if (!db.objectStoreNames.contains('config')) {
        db.createObjectStore('config', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('attempts')) {
        db.createObjectStore('attempts', { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const dbService = {
  async saveQuestions(grade: GradeLevel, questions: Question[]): Promise<void> {
    const db = await openDB();
    const tx = db.transaction('questions', 'readwrite');
    const store = tx.objectStore('questions');
    await store.put({ grade, questions });
  },

  async getQuestions(grade: GradeLevel): Promise<Question[]> {
    const db = await openDB();
    const tx = db.transaction('questions', 'readonly');
    const store = tx.objectStore('questions');
    const result = await new Promise<any>((resolve) => {
      const req = store.get(grade);
      req.onsuccess = () => resolve(req.result);
    });
    return result ? result.questions : [];
  },

  async saveCertConfig(config: CertificateConfig): Promise<void> {
    const db = await openDB();
    const tx = db.transaction('config', 'readwrite');
    const store = tx.objectStore('config');
    await store.put({ id: 'main', ...config });
  },

  async getCertConfig(): Promise<CertificateConfig | null> {
    const db = await openDB();
    const tx = db.transaction('config', 'readonly');
    const store = tx.objectStore('config');
    const result = await new Promise<any>((resolve) => {
      const req = store.get('main');
      req.onsuccess = () => resolve(req.result);
    });
    return result || null;
  },

  async saveAttempt(attempt: QuizAttempt): Promise<void> {
    const db = await openDB();
    const tx = db.transaction('attempts', 'readwrite');
    const store = tx.objectStore('attempts');
    await store.add(attempt);
  },

  async getAttempts(): Promise<QuizAttempt[]> {
    const db = await openDB();
    const tx = db.transaction('attempts', 'readonly');
    const store = tx.objectStore('attempts');
    return new Promise((resolve) => {
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result);
    });
  }
};
