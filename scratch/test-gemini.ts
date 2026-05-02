import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY
});

const tools: any[] = [
  {
    functionDeclarations: [
      {
        name: "get_medicines",
        description: "Fetch medicines.",
        parameters: {
          type: "OBJECT",
          properties: {
            searchTerm: { type: "STRING" },
          },
        },
      }
    ],
  },
];

async function test() {
  try {
    const userMessage = "Find medicines for headache";
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: userMessage,
      config: { tools: tools }
    });

    const functionCalls = response.functionCalls;
    if (functionCalls && functionCalls.length > 0) {
      console.log("Model called:", functionCalls[0].name);
      
      const fakeResult = [{ id: 1, name: "Paracetamol" }];

      const finalResponse = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          { role: 'user', parts: [{ text: userMessage }] },
          response.candidates![0].content,
          { 
            role: 'user', 
            parts: [
              { 
                functionResponse: { 
                  id: functionCalls[0].id || "",
                  name: functionCalls[0].name || "", 
                  response: { output: JSON.stringify(fakeResult) } 
                } 
              }
            ]
          }
        ] as any[],
        config: { tools: tools }
      });

      console.log("Success:", finalResponse.text);
    }
  } catch (error: any) {
    console.error("ERROR DETECTED:");
    console.error(error);
  }
}

test();
