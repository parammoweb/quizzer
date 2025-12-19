
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
              // Use STRING type for id to align with the Question interface
              id: { type: Type.STRING },
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

    const text = response.text;
    if (!text) {
      throw new Error("No response text received from Gemini API");
    }

    // Parse the JSON output
    const rawQuestions = JSON.parse(text);
    
    // Map the results to ensure they strictly follow the Question interface
    return rawQuestions.map((q: any, idx: number): Question => ({
      ...q,
      // Ensure id is always a string to satisfy Question interface requirement
      id: q.id ? q.id.toString() : (idx + 1).toString(),
      // Ensure correctAnswerIndex is a number
      correctAnswerIndex: typeof q.correctAnswerIndex === 'number' ? q.correctAnswerIndex : parseInt(q.correctAnswerIndex, 10) || 0
    }));
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw new Error("Failed to generate quiz questions. Please try again.");
  }
};
