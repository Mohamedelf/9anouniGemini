import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { storage } from '../lib/storage';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: number;
}

export interface Conversation {
  id: string;
  title: string; // "Nouveau chat" ou le premier message user
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

interface ChatState {
  conversations: Conversation[];
  currentConversationId: string | null;
  isLoading: boolean;

  // Actions
  createConversation: () => void;
  setCurrentConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  addMessage: (message: Omit<Message, 'id' | 'createdAt'>) => void;
  setLoading: (loading: boolean) => void;
  generateAiResponse: () => Promise<void>;

  // Helpers
  getCurrentConversation: () => Conversation | undefined;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      currentConversationId: null,
      isLoading: false,

      createConversation: () => {
        const newConversation: Conversation = {
          id: Math.random().toString(36).substring(7),
          title: 'Nouvelle conversation',
          messages: [
            {
              id: 'welcome',
              role: 'assistant',
              content: 'Bonjour ! Je suis 9anouni, votre assistant juridique. Comment puis-je vous aider aujourd\'hui ?',
              createdAt: Date.now(),
            },
          ],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        set((state) => ({
          conversations: [newConversation, ...state.conversations],
          currentConversationId: newConversation.id,
        }));
      },

      setCurrentConversation: (id) => {
        set({ currentConversationId: id });
      },

      deleteConversation: (id) => {
        set((state) => {
          const newConversations = state.conversations.filter((c) => c.id !== id);
          // Si on supprime la conversation courante, on reset ou on passe à la première disponible
          let nextId = state.currentConversationId;
          if (state.currentConversationId === id) {
            nextId = newConversations.length > 0 ? newConversations[0].id : null;
          }
          return {
            conversations: newConversations,
            currentConversationId: nextId,
          };
        });
      },

      addMessage: (message) => {
        set((state) => {
          const currentId = state.currentConversationId;
          if (!currentId) return state;

          const updatedConversations = state.conversations.map((conv) => {
            if (conv.id === currentId) {
              // Mise à jour du titre si c'est le premier message utilisateur
              let newTitle = conv.title;
              if (conv.messages.length === 1 && message.role === 'user') {
                // Le premier message est le welcome message, donc length 1 signifie qu'on ajoute le 1er message user
                newTitle = message.content.substring(0, 30) + (message.content.length > 30 ? '...' : '');
              } else if (conv.title === 'Nouvelle conversation' && message.role === 'user') {
                newTitle = message.content.substring(0, 30) + (message.content.length > 30 ? '...' : '');
              }

              return {
                ...conv,
                title: newTitle,
                updatedAt: Date.now(),
                messages: [
                  ...conv.messages,
                  {
                    ...message,
                    id: Math.random().toString(36).substring(7),
                    createdAt: Date.now(),
                  },
                ],
              };
            }
            return conv;
          });

          // Re-sort conversations by updatedAt desc? Optional but good for history list
          // updatedConversations.sort((a, b) => b.updatedAt - a.updatedAt); 

          return { conversations: updatedConversations };
        });
      },

      setLoading: (loading) => set({ isLoading: loading }),

      generateAiResponse: async () => {
        const { addMessage, setLoading, getCurrentConversation } = get();
        const currentConv = getCurrentConversation();

        if (!currentConv) return;

        const lastUserMessage = currentConv.messages[currentConv.messages.length - 1];

        if (!lastUserMessage || lastUserMessage.role !== 'user') return;

        setLoading(true);

        // Simulation d'appel API (Placeholder pour n8n)
        setTimeout(() => {
          addMessage({
            role: 'assistant',
            content: "Ceci est une réponse simulée (Mock). L'application est prête à être connectée à votre workflow n8n. Une fois le backend configuré, les réponses juridiques réelles apparaîtront ici.",
          });
          setLoading(false);
        }, 1500);
      },

      getCurrentConversation: () => {
        const { conversations, currentConversationId } = get();
        return conversations.find((c) => c.id === currentConversationId);
      },
    }),
    {
      name: 'chat-storage-v2', // Changed name to reset storage and avoid conflicts
      storage: createJSONStorage(() => storage),
    }
  )
);
