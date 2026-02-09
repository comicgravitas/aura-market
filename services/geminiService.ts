
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("Missing system environment variable: API_KEY");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "A professional product title."
    },
    description: {
      type: Type.STRING,
      description: "A brief one-sentence factual description."
    }
  },
  required: ["title", "description"]
};

export const generateItemDetails = async (base64ImageData: string, mimeType: string): Promise<{ title: string; description: string }> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            text: "Analyze this product image and extract its title and a short factual description for a marketplace inventory system.",
          },
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("AI returned no content.");
    
    return JSON.parse(jsonText);

  } catch (error: any) {
    console.error("AI Analysis Error:", error);
    throw new Error(`AI Verification Failed: ${error.message || "Unknown Error"}`);
  }
};
