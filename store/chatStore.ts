import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { storage } from '../lib/storage';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: number;
}

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  addMessage: (message: Omit<Message, 'id' | 'createdAt'>) => void;
  setLoading: (loading: boolean) => void;
  clearChat: () => void;
  generateAiResponse: () => Promise<void>;
}

const zustandStorage = {
  setItem: (name: string, value: string) => {
    return storage.set(name, value);
  },
  getItem: (name: string) => {
    return storage.getString(name);
  },
  removeItem: (name: string) => {
    return storage.delete(name);
  },
};

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      messages: [
        {
          id: 'welcome',
          role: 'assistant',
          content: 'Bonjour ! Je suis 9anouni, votre assistant juridique. Comment puis-je vous aider aujourd\'hui ?',
          createdAt: Date.now(),
        },
      ],
      isLoading: false,
      addMessage: (message) =>
        set((state) => ({
          messages: [
            {
              ...message,
              id: Math.random().toString(36).substring(7),
              createdAt: Date.now(),
            },
            ...state.messages, // Prepend for FlashList inverted
          ],
        })),
      setLoading: (loading) => set({ isLoading: loading }),
      clearChat: () => set({ messages: [] }),
      generateAiResponse: async () => {
        const { messages, addMessage, setLoading } = get();
        const lastUserMessage = messages[0];

        if (!lastUserMessage || lastUserMessage.role !== 'user') return;

        setLoading(true);

        // Simulation d'appel API (Placeholder pour n8n)
        // TODO: Remplacer ce setTimeout par un fetch vers votre webhook n8n
        setTimeout(() => {
          addMessage({
            role: 'assistant',
            content: "Ceci est une réponse simulée (Mock). L'application est prête à être connectée à votre workflow n8n. Une fois le backend configuré, les réponses juridiques réelles apparaîtront ici.",
          });
          setLoading(false);
        }, 1500); // Délai artificiel de 1.5s pour simuler le réseau
      },
    }),
    {
      name: 'chat-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);