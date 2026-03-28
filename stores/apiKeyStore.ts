import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProviderId } from '@/types/chat';

interface ApiKeyState {
  keys: Partial<Record<ProviderId, string>>;
  setApiKey: (provider: ProviderId, key: string) => void;
  removeApiKey: (provider: ProviderId) => void;
  hasApiKey: (provider: ProviderId) => boolean;
  getConfiguredProviders: () => ProviderId[];
}

export const useApiKeyStore = create<ApiKeyState>()(
  persist(
    (set, get) => ({
      keys: {},

      setApiKey: (provider, key) =>
        set((state) => ({
          keys: { ...state.keys, [provider]: key },
        })),

      removeApiKey: (provider) =>
        set((state) => {
          const next = { ...state.keys };
          delete next[provider];
          return { keys: next };
        }),

      hasApiKey: (provider) => {
        const key = get().keys[provider];
        return !!key && key.trim().length > 0;
      },

      getConfiguredProviders: () => {
        const { keys } = get();
        return (Object.keys(keys) as ProviderId[]).filter(
          (id) => !!keys[id] && keys[id]!.trim().length > 0
        );
      },
    }),
    {
      name: 'api-keys-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
