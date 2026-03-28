import { Provider, ProviderId } from '@/types/chat';

export const PROVIDERS: Record<ProviderId, Provider> = {
  openai: {
    id: 'openai',
    name: 'OpenAI',
    icon: 'chatbubble',
    color: '#10A37F',
    placeholder: 'sk-...',
    models: [
      { id: 'gpt-4o', name: 'GPT-4o', providerId: 'openai' },
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini', providerId: 'openai' },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', providerId: 'openai' },
      { id: 'o1', name: 'o1', providerId: 'openai' },
      { id: 'o1-mini', name: 'o1 Mini', providerId: 'openai' },
      { id: 'o3-mini', name: 'o3 Mini', providerId: 'openai' },
    ],
  },
  anthropic: {
    id: 'anthropic',
    name: 'Anthropic',
    icon: 'flash',
    color: '#D97757',
    placeholder: 'sk-ant-...',
    models: [
      { id: 'claude-sonnet-4-20250514', name: 'Claude Sonnet 4', providerId: 'anthropic' },
      { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku', providerId: 'anthropic' },
      { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', providerId: 'anthropic' },
    ],
  },
  mistral: {
    id: 'mistral',
    name: 'Mistral',
    icon: 'sparkles',
    color: '#FF7000',
    placeholder: 'your-mistral-api-key',
    models: [
      { id: 'mistral-large-latest', name: 'Mistral Large', providerId: 'mistral' },
      { id: 'mistral-medium-latest', name: 'Mistral Medium', providerId: 'mistral' },
      { id: 'mistral-small-latest', name: 'Mistral Small', providerId: 'mistral' },
      { id: 'open-mistral-nemo', name: 'Mistral Nemo', providerId: 'mistral' },
    ],
  },
  gemini: {
    id: 'gemini',
    name: 'Gemini',
    icon: 'globe',
    color: '#4285F4',
    placeholder: 'AIza...',
    models: [
      { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', providerId: 'gemini' },
      { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', providerId: 'gemini' },
      { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', providerId: 'gemini' },
    ],
  },
  perplexity: {
    id: 'perplexity',
    name: 'Perplexity',
    icon: 'rocket',
    color: '#20B2AA',
    placeholder: 'pplx-...',
    models: [
      { id: 'sonar-pro', name: 'Sonar Pro', providerId: 'perplexity' },
      { id: 'sonar', name: 'Sonar', providerId: 'perplexity' },
      { id: 'sonar-reasoning-pro', name: 'Sonar Reasoning Pro', providerId: 'perplexity' },
    ],
  },
  openrouter: {
    id: 'openrouter',
    name: 'OpenRouter',
    icon: 'planet',
    color: '#6366F1',
    placeholder: 'sk-or-...',
    models: [
      { id: 'google/gemini-2.5-pro-preview', name: 'Gemini 2.5 Pro', providerId: 'openrouter' },
      { id: 'anthropic/claude-sonnet-4', name: 'Claude Sonnet 4', providerId: 'openrouter' },
      { id: 'openai/gpt-4o', name: 'GPT-4o', providerId: 'openrouter' },
      { id: 'meta-llama/llama-4-maverick', name: 'Llama 4 Maverick', providerId: 'openrouter' },
    ],
  },
  grok: {
    id: 'grok',
    name: 'Grok',
    icon: 'star',
    color: '#FFFFFF',
    placeholder: 'xai-...',
    models: [
      { id: 'grok-3', name: 'Grok 3', providerId: 'grok' },
      { id: 'grok-3-mini', name: 'Grok 3 Mini', providerId: 'grok' },
      { id: 'grok-2', name: 'Grok 2', providerId: 'grok' },
    ],
  },
  deepseek: {
    id: 'deepseek',
    name: 'DeepSeek',
    icon: 'code-slash',
    color: '#4D6BFE',
    placeholder: 'sk-...',
    models: [
      { id: 'deepseek-chat', name: 'DeepSeek Chat', providerId: 'deepseek' },
      { id: 'deepseek-reasoner', name: 'DeepSeek Reasoner', providerId: 'deepseek' },
    ],
  },
};

/** Ordered list of all provider IDs */
export const PROVIDER_IDS: ProviderId[] = [
  'openai',
  'anthropic',
  'mistral',
  'gemini',
  'perplexity',
  'openrouter',
  'grok',
  'deepseek',
];

/** Get a flat list of all providers */
export const getProviderList = (): Provider[] =>
  PROVIDER_IDS.map((id) => PROVIDERS[id]);

/** Get default model ID for a provider */
export const getDefaultModelId = (providerId: ProviderId): string =>
  PROVIDERS[providerId].models[0].id;
