import React from 'react';
import { View, Text, SafeAreaView, FlatList, TouchableOpacity } from "react-native";
import { useChatStore } from '../../store/chatStore';
import { useRouter } from 'expo-router';
import { MessageSquare, Plus, Trash2 } from 'lucide-react-native';
import clsx from 'clsx';

export default function HistoryScreen() {
  const { conversations, setCurrentConversation, createConversation, deleteConversation, currentConversationId } = useChatStore();
  const router = useRouter();

  const handleSelectConversation = (id: string) => {
    setCurrentConversation(id);
    router.push('/(drawer)'); // Navigate to the main chat screen which is index of (drawer)
  };

  const handleNewChat = () => {
    createConversation();
    router.push('/(drawer)');
  };

  const handleDeleteConversation = (id: string) => {
    deleteConversation(id);
  };

  // Sort conversations by updatedAt descending (newest first)
  const sortedConversations = [...conversations].sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <View className="flex-1 px-4 pt-4">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">Historique</Text>
          <TouchableOpacity
            onPress={handleNewChat}
            className="flex-row items-center bg-primary px-3 py-2 rounded-lg"
          >
            <Plus size={20} color="white" />
            <Text className="text-white font-medium ml-2">Nouveau Chat</Text>
          </TouchableOpacity>
        </View>

        {sortedConversations.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <MessageSquare size={64} color="#D1D5DB" />
            <Text className="text-gray-500 mt-4 text-center">Aucune conversation pour le moment.</Text>
            <TouchableOpacity onPress={handleNewChat} className="mt-4">
              <Text className="text-primary font-medium">Démarrer une conversation</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={sortedConversations}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const isActive = item.id === currentConversationId;
              // Get last message snippet
              const lastMsg = item.messages[item.messages.length - 1];
              const snippet = lastMsg ? lastMsg.content.substring(0, 50).replace(/\n/g, ' ') + (lastMsg.content.length > 50 ? '...' : '') : 'Nouvelle conversation';

              return (
                <TouchableOpacity
                  onPress={() => handleSelectConversation(item.id)}
                  className={clsx(
                    "flex-row items-center justify-between p-4 mb-2 rounded-xl border",
                    isActive ? "bg-primary/10 border-primary" : "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700"
                  )}
                >
                  <View className="flex-1 mr-4">
                    <Text className={clsx("font-semibold mb-1", isActive ? "text-primary" : "text-gray-900 dark:text-gray-100")} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text className="text-gray-500 dark:text-gray-400 text-sm" numberOfLines={1}>
                      {snippet}
                    </Text>
                    <Text className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                      {new Date(item.updatedAt).toLocaleDateString()} {new Date(item.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation();
                      handleDeleteConversation(item.id);
                    }}
                    className="p-2"
                  >
                    <Trash2 size={18} color="#EF4444" />
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
