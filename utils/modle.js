import { GoogleGenerativeAI } from "@google/generative-ai";

const api_key = "AIzaSyCKLs6nN4UYYz2Tj11zOT6wkiNhQbK3h8Y";

const genAI = new GoogleGenerativeAI(api_key);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

import { samplePrompt } from "./smapleprompt";

export const get_prompt_response = async (prompt) => {
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = await response.text();
  console.log("prompt_response", text);
  return text;
};

export const Capitalize = (text) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};
