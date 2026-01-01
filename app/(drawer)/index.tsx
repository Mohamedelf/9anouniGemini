import React, { useState, useRef, useMemo, useEffect, useLayoutEffect } from 'react';
import { View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, SafeAreaView, FlatList, Text, Animated } from 'react-native';
import { Send, Menu, Plus } from 'lucide-react-native'; // Added Menu icon if needed for drawer toggle, but keeping existing imports mostly
import { useChatStore } from '../../store/chatStore';
import { ChatBubble } from '../../components/ChatBubble';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { useHeaderHeight } from '@react-navigation/elements';

import { useColorScheme } from 'nativewind';

export default function ChatScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const {
    addMessage,
    isLoading,
    generateAiResponse,
    currentConversationId,
    getCurrentConversation,
    createConversation
  } = useChatStore();

  const [inputText, setInputText] = useState('');
  const listRef = useRef<any>(null);
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleNewChat = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      createConversation();
      // Small delay to ensure state update is processed
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }, 50);
    });
  };

  // Add Header buttons
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
          className="ml-4 p-1"
        >
          <Menu size={24} color={isDark ? "#FFFFFF" : "#1F2937"} />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={handleNewChat}
          className="mr-4 p-1"
        >
          <Plus size={24} color={isDark ? "#FFFFFF" : "#1F2937"} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, createConversation, isDark]);

  // Ensure conversation exists on mount
  useEffect(() => {
    if (!currentConversationId) {
      createConversation();
    }
  }, [currentConversationId, createConversation]);

  const conversation = getCurrentConversation();
  const messages = conversation ? conversation.messages : [];

  // LOGIQUE D'AFFICHAGE (Style WhatsApp) :
  // 1. Le store garde l'ordre chronologique : [Message 1, Message 2, Message 3 (Récent)]
  // 2. On inverse pour l'affichage : [Message 3 (Récent), Message 2, Message 1]
  // 3. FlashList 'inverted' affiche le premier élément du tableau (index 0) tout en bas de l'écran.
  const reversedMessages = useMemo(() => [...messages].reverse(), [messages]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    // Safety check: ensure conversation exists (though useEffect should catch this)
    if (!currentConversationId) {
      createConversation();
    }

    const userText = inputText.trim();
    setInputText('');

    // Ajout au store (ajout à la fin de la liste chronologique)
    addMessage({ role: 'user', content: userText });

    // Déclenchement de l'IA
    await generateAiResponse();
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      {/* Custom Header with Drawer Toggle could go here if not using default header */}

      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        {/* Chat List */}
        <FlatList
          ref={listRef}
          data={reversedMessages}
          renderItem={({ item }) => <ChatBubble message={item} />}
          keyExtractor={(item) => item.id}
          inverted
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 16 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-10">
              <Text className="text-gray-400 dark:text-gray-500">Commencez une nouvelle conversation</Text>
            </View>
          }
        />

        {/* Input Area */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          // Offset de 100 pour compenser le Header du Drawer + Status Bar sur iOS
          keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        >
          <View className="p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
            <View className="flex-row items-end gap-2 bg-gray-50 dark:bg-gray-800 p-2 rounded-2xl border border-gray-200 dark:border-gray-700">
              <TextInput
                className="flex-1 text-base text-gray-900 dark:text-white max-h-32 px-2 py-2"
                placeholder="Posez votre question juridique..."
                placeholderTextColor="#9CA3AF"
                multiline
                value={inputText}
                onChangeText={setInputText}
              />
              <TouchableOpacity
                onPress={handleSend}
                disabled={!inputText.trim() || isLoading}
                className={`w-10 h-10 rounded-full items-center justify-center mb-1 ${inputText.trim() ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
              >
                <Send size={20} color="white" />
              </TouchableOpacity>
            </View>
            <Text className="text-[10px] text-center text-gray-400 dark:text-gray-500 mt-2">
              Ceci n'est PAS un conseil juridique. L'IA peut se tromper. Consultez un avocat.
            </Text>
          </View>
        </KeyboardAvoidingView>
      </Animated.View>
    </SafeAreaView>
  );
}
