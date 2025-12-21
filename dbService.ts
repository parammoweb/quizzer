
import { Question, GradeLevel, CertificateConfig } from './types';

// These would ideally be in your environment variables
const MONGODB_CONFIG = {
  apiKey: (process.env as any).MONGODB_API_KEY || '',
  appId: (process.env as any).MONGODB_APP_ID || '', // Atlas App Services ID
  dataSource: (process.env as any).MONGODB_DATA_SOURCE || 'Cluster0',
  database: (process.env as any).MONGODB_DATABASE || 'SmartQuizPro',
};

const isConfigured = () => !!MONGODB_CONFIG.apiKey && !!MONGODB_CONFIG.appId;

export interface QuizAttempt {
  id: string;
  studentName: string;
  grade: GradeLevel;
  score: number;
  total: number;
  timestamp: number;
}

// REST API Helper
async function atlasFetch(action: string, collection: string, body: any) {
  if (!isConfigured()) throw new Error("MongoDB Not Configured");

  const url = `https://data.mongodb-api.com/app/${MONGODB_CONFIG.appId}/endpoint/data/v1/action/${action}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Request-Headers': '*',
      'api-key': MONGODB_CONFIG.apiKey,
    },
    body: JSON.stringify({
      dataSource: MONGODB_CONFIG.dataSource,
      database: MONGODB_CONFIG.database,
      collection: collection,
      ...body
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Database operation failed");
  }

  return response.json();
}

// Fallback to IndexedDB if Mongo is not ready
const LOCAL_DB_NAME = 'SmartQuizPro_Fallback';
const openLocalDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(LOCAL_DB_NAME, 1);
    request.onupgradeneeded = (e) => {
      const db = (e.target as any).result;
      if (!db.objectStoreNames.contains('questions')) db.createObjectStore('questions', { keyPath: 'grade' });
      if (!db.objectStoreNames.contains('config')) db.createObjectStore('config', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('attempts')) db.createObjectStore('attempts', { keyPath: 'id' });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const dbService = {
  isCloudEnabled: () => isConfigured(),

  async saveQuestions(grade: GradeLevel, questions: Question[]): Promise<void> {
    if (isConfigured()) {
      try {
        await atlasFetch('updateOne', 'questions', {
          filter: { grade: grade },
          update: { $set: { grade, questions } },
          upsert: true
        });
        return;
      } catch (e) { console.warn("Mongo Save Failed, using local", e); }
    }
    const db = await openLocalDB();
    const tx = db.transaction('questions', 'readwrite');
    await tx.objectStore('questions').put({ grade, questions });
  },

  async getQuestions(grade: GradeLevel): Promise<Question[]> {
    if (isConfigured()) {
      try {
        const res = await atlasFetch('findOne', 'questions', { filter: { grade } });
        if (res.document) return res.document.questions;
      } catch (e) { console.warn("Mongo Load Failed", e); }
    }
    const db = await openLocalDB();
    const result = await new Promise<any>((r) => {
      const req = db.transaction('questions', 'readonly').objectStore('questions').get(grade);
      req.onsuccess = () => r(req.result);
    });
    return result ? result.questions : [];
  },

  async saveCertConfig(config: CertificateConfig): Promise<void> {
    if (isConfigured()) {
      try {
        await atlasFetch('updateOne', 'configs', {
          filter: { id: 'main' },
          update: { $set: { id: 'main', ...config } },
          upsert: true
        });
        return;
      } catch (e) { console.error(e); }
    }
    const db = await openLocalDB();
    await db.transaction('config', 'readwrite').objectStore('config').put({ id: 'main', ...config });
  },

  async getCertConfig(): Promise<CertificateConfig | null> {
    if (isConfigured()) {
      try {
        const res = await atlasFetch('findOne', 'configs', { filter: { id: 'main' } });
        if (res.document) return res.document;
      } catch (e) { console.error(e); }
    }
    const db = await openLocalDB();
    const result = await new Promise<any>((r) => {
      const req = db.transaction('config', 'readonly').objectStore('config').get('main');
      req.onsuccess = () => r(req.result);
    });
    return result || null;
  },

  async saveAttempt(attempt: QuizAttempt): Promise<void> {
    if (isConfigured()) {
      try {
        await atlasFetch('insertOne', 'attempts', { document: attempt });
        return;
      } catch (e) { console.error(e); }
    }
    const db = await openLocalDB();
    await db.transaction('attempts', 'readwrite').objectStore('attempts').add(attempt);
  },

  async getAttempts(): Promise<QuizAttempt[]> {
    if (isConfigured()) {
      try {
        const res = await atlasFetch('find', 'attempts', { limit: 100, sort: { timestamp: -1 } });
        return res.documents || [];
      } catch (e) { console.error(e); }
    }
    const db = await openLocalDB();
    return new Promise((r) => {
      const req = db.transaction('attempts', 'readonly').objectStore('attempts').getAll();
      req.onsuccess = () => r(req.result);
    });
  }
};
