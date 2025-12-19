
import { GoogleGenAI, Type } from "@google/genai";
import { Question, GradeLevel } from "./types";

export const fetchQuestions = async (grade: GradeLevel): Promise<Question[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Generate exactly 25 multiple-choice questions for students in ${grade}. 
  The questions should cover various subjects like Math, Science, English, and General Knowledge appropriate for this level.
  Each question must have exactly 4 options. 
  Provide the output strictly in JSON format as an array of objects.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.INTEGER },
              question: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              correctAnswerIndex: { type: Type.INTEGER },
            },
            required: ["id", "question", "options", "correctAnswerIndex"],
            propertyOrdering: ["id", "question", "options", "correctAnswerIndex"],
          },
        },
      },
    });

    const questions: Question[] = JSON.parse(response.text);
    // Ensure we have IDs if not provided properly by AI
    return questions.map((q, idx) => ({ ...q, id: idx + 1 }));
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw new Error("Failed to generate quiz questions. Please try again.");
  }
};
