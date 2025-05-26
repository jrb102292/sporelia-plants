import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_MODEL_NAME } from '../constants';
import { ServiceResponse, GeminiCareTipsResponse } from "../types";

const API_KEY = process.env.API_KEY;

let ai: GoogleGenerativeAI | null = null;
if (API_KEY) {
  try {
    ai = new GoogleGenerativeAI(API_KEY);
  } catch (e) {
    console.error("Failed to initialize GoogleGenerativeAI:", e);
    // This error will be caught by individual function calls if ai remains null
  }
} else {
  console.warn("API_KEY for Gemini is not set. Plant care tips feature will be disabled.");
}

export const getPlantCareTips = async (plantName: string, plantSpecies: string): Promise<ServiceResponse<GeminiCareTipsResponse>> => {
  if (!ai) {
    return { 
      data: null, 
      error: "Gemini API client not initialized. API_KEY might be missing or invalid." 
    };
  }

  const prompt = `Provide detailed plant care instructions for a ${plantName} (${plantSpecies}). Include advice on watering, sunlight requirements, soil type, fertilization, common pests/diseases, and any specific tips for this plant. Use Google Search for the most up-to-date information.`;

  try {
    const model = ai.getGenerativeModel({ model: GEMINI_MODEL_NAME });
    const response = await model.generateContent(prompt);
    const text = response.response.text();
    
    return { data: { text, sources: undefined }, error: null };

  } catch (error) {
    console.error("Error fetching plant care tips from Gemini API:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred while fetching care tips.";
    return { data: null, error: `Error fetching care tips: ${errorMessage}` };
  }
};
