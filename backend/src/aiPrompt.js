import { GoogleGenAI } from "@google/genai";

export const createEmail = async (id, day, reason, affectedClasses) => {
    const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});
    const prompt = `Please write a formal leave request email for student ID: ${id}, requesting leave on ${day} due to "${reason}". The following classes will be affected: ${affectedClasses.join(", ")}.`;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        
        return response.text;
    } catch (error) {
        console.error("Error generating email:", error);
        throw new Error("Failed to generate email.");
    }
};