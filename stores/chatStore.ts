import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChatMessage, Conversation, ProviderId } from '@/types/chat';

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  selectedProviderId: ProviderId;
  selectedModelId: string;
  isGenerating: boolean;
  streamingContent: string;

  // Actions
  createConversation: () => string;
  setActiveConversation: (id: string | null) => void;
  addMessage: (
    conversationId: string,
    message: Omit<ChatMessage, 'id' | 'timestamp'>
  ) => void;
  updateLastAssistantMessage: (conversationId: string, content: string) => void;
  deleteConversation: (id: string) => void;
  setSelectedProvider: (providerId: ProviderId) => void;
  setSelectedModel: (modelId: string) => void;
  setIsGenerating: (val: boolean) => void;
  setStreamingContent: (val: string) => void;
  getActiveConversation: () => Conversation | undefined;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      activeConversationId: null,
      selectedProviderId: 'openai',
      selectedModelId: 'gpt-4o',
      isGenerating: false,
      streamingContent: '',

      createConversation: () => {
        const id = Date.now().toString();
        const { selectedProviderId, selectedModelId } = get();
        const now = Date.now();

        const conversation: Conversation = {
          id,
          title: 'New Chat',
          messages: [],
          providerId: selectedProviderId,
          modelId: selectedModelId,
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          conversations: [conversation, ...state.conversations],
          activeConversationId: id,
        }));

        return id;
      },

      setActiveConversation: (id) =>
        set({ activeConversationId: id }),

      addMessage: (conversationId, message) =>
        set((state) => {
          const msg: ChatMessage = {
            ...message,
            id: Date.now().toString(),
            timestamp: Date.now(),
          };

          const conversations = state.conversations.map((conv) => {
            if (conv.id !== conversationId) return conv;

            // Auto-title from first user message
            const isFirstUserMsg =
              message.role === 'user' && conv.messages.length === 0;
            const title = isFirstUserMsg
              ? message.content.slice(0, 50) + (message.content.length > 50 ? '...' : '')
              : conv.title;

            return {
              ...conv,
              messages: [...conv.messages, msg],
              title,
              updatedAt: Date.now(),
            };
          });

          return { conversations };
        }),

      updateLastAssistantMessage: (conversationId, content) =>
        set((state) => {
          const conversations = state.conversations.map((conv) => {
            if (conv.id !== conversationId) return conv;

            const messages = [...conv.messages];
            // Find the last assistant message
            for (let i = messages.length - 1; i >= 0; i--) {
              if (messages[i].role === 'assistant') {
                messages[i] = { ...messages[i], content };
                break;
              }
            }

            return { ...conv, messages, updatedAt: Date.now() };
          });

          return { conversations };
        }),

      deleteConversation: (id) =>
        set((state) => ({
          conversations: state.conversations.filter((c) => c.id !== id),
          activeConversationId:
            state.activeConversationId === id
              ? null
              : state.activeConversationId,
        })),

      setSelectedProvider: (providerId) =>
        set({ selectedProviderId: providerId }),

      setSelectedModel: (modelId) =>
        set({ selectedModelId: modelId }),

      setIsGenerating: (val) =>
        set({ isGenerating: val }),

      setStreamingContent: (val) =>
        set({ streamingContent: val }),

      getActiveConversation: () => {
        const { conversations, activeConversationId } = get();
        if (!activeConversationId) return undefined;
        return conversations.find((c) => c.id === activeConversationId);
      },
    }),
    {
      name: 'chat-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        conversations: state.conversations,
        activeConversationId: state.activeConversationId,
        selectedProviderId: state.selectedProviderId,
        selectedModelId: state.selectedModelId,
      }),
    }
  )
);
