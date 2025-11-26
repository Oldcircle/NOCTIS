
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export type Language = 'en' | 'zh';

export interface LocalizedString {
  en: string;
  zh: string;
}

export interface Project {
  id: string;
  title: LocalizedString;
  category: LocalizedString;
  image: string;
  year: string;
  description: LocalizedString;
  githubUrl?: string;
  projectUrl?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export enum Section {
  HERO = 'hero',
  WORK = 'work',
  ABOUT = 'about',
  SERVICES = 'services',
}

export type AIProvider = 'gemini' | 'openai' | 'anthropic' | 'deepseek' | 'moonshot' | 'qwen' | 'ollama' | 'custom';

export interface AIConfig {
  id: string;
  name: string;
  provider: AIProvider;
  apiKey: string;
  baseUrl: string; // Optional, defaults will be used if empty
  model: string;
}
