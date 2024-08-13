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

export function parseJsonString(jsonString) {
  try {
    // Fix common issues:
    // 1. Replace single quotes with double quotes
    let fixedString = jsonString.replace(/'/g, '"');

    // 2. Remove trailing commas
    fixedString = fixedString.replace(/,\s*}/g, "}");
    fixedString = fixedString.replace(/,\s*]/g, "]");

    // 3. Ensure keys are wrapped in double quotes
    fixedString = fixedString.replace(
      /([{,]\s*)([a-zA-Z0-9_]+)\s*:/g,
      '$1"$2":'
    );

    // Attempt to parse the cleaned-up string
    return JSON.parse(fixedString);
  } catch (error) {
    console.error("Failed to parse JSON string:", error.message);
    return null;
  }
}
