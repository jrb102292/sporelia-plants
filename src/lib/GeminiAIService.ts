import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiAIService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  async analyzePlantHealth(plantData: any): Promise<string> {
    try {
      const prompt = `Analyze this plant's health based on the following data and provide recommendations:
        Name: ${plantData.name}
        Type: ${plantData.plantType}
        Status: ${plantData.status}
        Last Watered: ${plantData.lastWatered}
        Last Fertilized: ${plantData.lastFertilized}
        Notes: ${plantData.notes || 'No notes'}
        Care Instructions: ${plantData.careInstructions || 'No care instructions'}`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error analyzing plant health:', error);
      throw error;
    }
  }

  async generateCareInstructions(plantType: string): Promise<string> {
    try {
      const prompt = `Generate detailed care instructions for a ${plantType} plant, including:
        - Watering schedule
        - Light requirements
        - Temperature preferences
        - Humidity needs
        - Fertilization schedule
        - Common issues and solutions
        - Propagation tips`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating care instructions:', error);
      throw error;
    }
  }

  async diagnosePlantIssues(plantData: any, symptoms: string): Promise<string> {
    try {
      const prompt = `Diagnose potential issues for this plant based on the following information:
        Plant: ${plantData.name} (${plantData.plantType})
        Current Status: ${plantData.status}
        Symptoms: ${symptoms}
        Last Watered: ${plantData.lastWatered}
        Last Fertilized: ${plantData.lastFertilized}
        Notes: ${plantData.notes || 'No notes'}`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error diagnosing plant issues:', error);
      throw error;
    }
  }
}

export const geminiAIService = new GeminiAIService(); 