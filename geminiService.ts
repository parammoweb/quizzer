
import { GoogleGenAI, Type } from "@google/genai";
import { Question, GradeLevel } from "./types";

export const fetchQuestions = async (grade: GradeLevel): Promise<Question[]> => {
  // Initialize GoogleGenAI directly using process.env.API_KEY as per coding guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Generate exactly 25 multiple-choice questions for students in ${grade}. 
  The questions should cover various subjects like Math, Science, English, and General Knowledge appropriate for this level.
  Each question must have exactly 4 options. 
  Ensure questions are challenging but fair for this age group.
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

    // Access text directly from response property as per current SDK version
    const text = response.text;
    if (!text) {
      throw new Error("Empty response from AI model.");
    }

    const rawQuestions = JSON.parse(text);
    
    return rawQuestions.map((q: any, idx: number): Question => ({
      ...q,
      id: q.id ? q.id.toString() : `ai-${Date.now()}-${idx}`,
      correctAnswerIndex: typeof q.correctAnswerIndex === 'number' ? q.correctAnswerIndex : 0
    }));
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    if (error.message?.includes("403") || error.message?.includes("API key")) {
      throw new Error("Invalid API Key. Please check your credentials.");
    }
    throw new Error(`AI Generation failed: ${error.message || 'Unknown error'}`);
  }
};
