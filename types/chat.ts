export type ProviderId =
  | 'openai'
  | 'anthropic'
  | 'mistral'
  | 'gemini'
  | 'perplexity'
  | 'openrouter'
  | 'grok'
  | 'deepseek';

export interface Provider {
  id: ProviderId;
  name: string;
  icon: string; // Ionicons icon name
  color: string;
  models: ModelInfo[];
  placeholder: string; // API key placeholder hint
}

export interface ModelInfo {
  id: string;
  name: string;
  providerId: ProviderId;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  providerId?: ProviderId;
  modelId?: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  providerId: ProviderId;
  modelId: string;
  createdAt: number;
  updatedAt: number;
}
