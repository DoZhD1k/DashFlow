import { GoogleGenerativeAI } from "@google/generative-ai";
import { marked } from "marked";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
if (!apiKey) {
  throw new Error("API-ключ отсутствует. Укажите его в .env файле.");
}
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

export const generateText = async (text: string): Promise<string> => {
  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [{ text }],
        },
      ],
    });

    const result = await chatSession.sendMessage(text);
    const markdownText = result.response.text();

    if (!markdownText || markdownText.trim().length === 0) {
      throw new Error("Пустой ответ от AI");
    }

    // Преобразуем Markdown в HTML
    const htmlContent = marked(markdownText);

    return htmlContent;
  } catch (error) {
    console.error("Ошибка при запросе к Gemini API:", error);
    throw new Error("Ошибка генерации текста.");
  }
};
