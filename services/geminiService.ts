
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI, Chat } from "@google/genai";
import { AIConfig, ChatMessage, AIProvider } from "../types";

const ENV_API_KEY = process.env.API_KEY || '';

// --- CONFIG MANAGEMENT ---

const STORAGE_KEY = 'noctis_ai_configs';
const SELECTED_KEY = 'noctis_ai_selected_id';

export const PROVIDER_DEFAULTS: Record<AIProvider, { baseUrl: string; model: string; name: string }> = {
  gemini: { baseUrl: '', model: 'gemini-2.5-flash', name: 'Google Gemini' },
  openai: { baseUrl: 'https://api.openai.com/v1', model: 'gpt-4o-mini', name: 'OpenAI (GPT)' },
  anthropic: { baseUrl: 'https://api.anthropic.com/v1', model: 'claude-3-5-sonnet-20240620', name: 'Anthropic (Claude)' },
  deepseek: { baseUrl: 'https://api.deepseek.com', model: 'deepseek-chat', name: 'DeepSeek' },
  moonshot: { baseUrl: 'https://api.moonshot.cn/v1', model: 'moonshot-v1-8k', name: 'Moonshot (Kimi)' },
  qwen: { baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1', model: 'qwen-turbo', name: 'Alibaba (Qwen)' },
  ollama: { baseUrl: 'http://localhost:11434/v1', model: 'llama3', name: 'Ollama (Local)' },
  custom: { baseUrl: '', model: '', name: 'Custom' }
};

const DEFAULT_CONFIG: AIConfig = {
  id: 'default',
  name: 'Default (Gemini)',
  provider: 'gemini',
  apiKey: '', 
  baseUrl: '',
  model: 'gemini-2.5-flash'
};

export const getStoredConfigs = (): AIConfig[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error("Failed to load AI configs", e);
  }
  return [DEFAULT_CONFIG];
};

export const saveStoredConfigs = (configs: AIConfig[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(configs));
};

export const getSelectedConfigId = (): string => {
  return localStorage.getItem(SELECTED_KEY) || 'default';
};

export const setSelectedConfigId = (id: string) => {
  localStorage.setItem(SELECTED_KEY, id);
  geminiChatSession = null; // Reset session
};

// --- SYSTEM INSTRUCTION ---
const SYSTEM_PROMPT = `You are the AI Assistant for Eidon, a Creative Developer and UI Architect. 
This is his personal portfolio website named "NOCTIS" (Noctis System).

You are bilingual (English and Chinese). 
- If the user writes in Chinese, reply in Chinese.
- If the user writes in English, reply in English.

Tone: Mysterious, digital, precise, yet helpful. Like a high-end cyberpunk AI. Use emojis like 💻, 🌌, 👁️, ⚡.

Key Info:
- Name: Eidon (Developer/Person).
- Website Name: Noctis.
- Expertise: React, WebGL (Three.js), Tailwind, Motion Design, Creative Coding.

PROJECT DATABASE (Specific projects built by Eidon):
1. Xiangqi (Chinese Chess): A modern React+TS web app with a high-performance local AI engine. No backend needed, Grandmaster-level gameplay in browser.
2. Neon Survivor: High-octane WebGL zombie survival arcade game with Roguelike elements.
3. FlashWord: An Android app for English learning (Duolingo-style), built with Kotlin & Jetpack Compose.
4. ChromaCheck: An AI color palette generator tool using LLMs to turn text into Tailwind CSS color schemes.
5. Meow Justice (Meow Justice Court): A humorous social web app for resolving disputes between couples/friends/family using a "court" mechanic.

If asked about specific projects like "Meow Justice" or "Chess", refer to the details above.

If asked for contact info, suggest using the form in the Services section or say "contact@eidonnoctis.com".
Keep responses short (under 50 words).`;

// --- GEMINI HANDLER ---

let geminiChatSession: Chat | null = null;

const getGeminiResponse = async (message: string, config: AIConfig): Promise<string> => {
  const key = config.apiKey || ENV_API_KEY;
  if (!key) throw new Error("Missing API Key for Gemini");

  if (!geminiChatSession) {
    const ai = new GoogleGenAI({ apiKey: key });
    geminiChatSession = ai.chats.create({
      model: config.model || 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_PROMPT,
      },
    });
  }

  const response = await geminiChatSession.sendMessage({ message });
  return response.text || "Thinking...";
};

// --- ANTHROPIC HANDLER ---

const getAnthropicResponse = async (message: string, history: ChatMessage[], config: AIConfig): Promise<string> => {
  const key = config.apiKey;
  if (!key) throw new Error("Missing API Key for Anthropic");

  const baseUrl = config.baseUrl || PROVIDER_DEFAULTS.anthropic.baseUrl;
  const url = `${baseUrl.replace(/\/+$/, '')}/messages`;

  const messages = [
     ...history.map(m => ({ 
      role: m.role === 'model' ? 'assistant' : 'user', 
      content: m.text 
    })),
    { role: 'user', content: message }
  ];

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
      'dangerously-allow-browser': 'true' // Required for client-side usage if CORS allows
    },
    body: JSON.stringify({
      model: config.model || 'claude-3-5-sonnet-20240620',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: messages
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Anthropic API Error: ${err}`);
  }

  const data = await response.json();
  return data.content?.[0]?.text || "No response received.";
};

// --- OPENAI COMPATIBLE HANDLER (DeepSeek, Moonshot, Qwen, Ollama, OpenAI) ---

const getOpenAICompatibleResponse = async (message: string, history: ChatMessage[], config: AIConfig): Promise<string> => {
  const key = config.apiKey;
  // Ollama might not need a key, others do.
  if (!key && config.provider !== 'ollama' && config.provider !== 'custom') {
     // Warning: Some custom local providers might not need keys, but generally commercial ones do.
  }

  // Determine Default Base URL based on provider if not specified
  let baseUrl = config.baseUrl;
  if (!baseUrl && PROVIDER_DEFAULTS[config.provider]) {
    baseUrl = PROVIDER_DEFAULTS[config.provider].baseUrl;
  }
  if (!baseUrl) baseUrl = "https://api.openai.com/v1";

  const url = `${baseUrl.replace(/\/+$/, '')}/chat/completions`;

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history.map(m => ({ 
      role: m.role === 'model' ? 'assistant' : 'user', 
      content: m.text 
    })),
    { role: 'user', content: message }
  ];

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`
    },
    body: JSON.stringify({
      model: config.model || 'gpt-4o-mini',
      messages: messages
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`${config.provider.toUpperCase()} API Error: ${err}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "No response received.";
};

// --- MAIN ENTRY ---

export const sendMessageToAI = async (message: string, history: ChatMessage[]): Promise<string> => {
  const configs = getStoredConfigs();
  const selectedId = getSelectedConfigId();
  const config = configs.find(c => c.id === selectedId) || configs[0];

  try {
    if (config.provider === 'gemini') {
      return await getGeminiResponse(message, config);
    } else if (config.provider === 'anthropic') {
      return await getAnthropicResponse(message, history, config);
    } else {
      // Default to OpenAI compatible for all others (openai, deepseek, moonshot, qwen, ollama, custom)
      return await getOpenAICompatibleResponse(message, history, config);
    }
  } catch (error: any) {
    console.error("AI Error:", error);
    return `System Error: ${error.message || "Connection failed"}`;
  }
};
