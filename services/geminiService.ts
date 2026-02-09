
import { GoogleGenAI, Type } from "@google/genai";

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
  // Use the API key directly from the environment inside the function
  // to avoid top-level module execution errors during the build process.
  if (!process.env.API_KEY) {
    throw new Error("Missing API_KEY. Please ensure it is set in your environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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
