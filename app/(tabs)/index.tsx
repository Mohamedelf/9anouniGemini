import React, { useState, useRef, useEffect, useMemo } from 'react';
import { View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, SafeAreaView, Text } from 'react-native';
import { FlashList } from "@shopify/flash-list";
import { Send, Sparkles } from 'lucide-react-native';
import { useChatStore } from '../../store/chatStore';
import { ChatBubble } from '../../components/ChatBubble';
import { LoadingBubble } from '../../components/LoadingBubble';

export default function ChatScreen() {
  const {
    addMessage,
    isLoading,
    generateAiResponse,
    getCurrentConversation,
    createConversation,
    currentConversationId
  } = useChatStore();

  const [inputText, setInputText] = useState('');
  const listRef = useRef<FlashList<any>>(null);

  // Ensure conversation exists on mount
  useEffect(() => {
    if (!currentConversationId) {
      createConversation();
    }
  }, [currentConversationId, createConversation]);

  const conversation = getCurrentConversation();
  const messages = conversation ? conversation.messages : [];

  // Inverted FlashList means index 0 is at the bottom.
  // We want the Newest message to be at index 0.
  // The store keeps messages in chronological order [Old -> New].
  // So we simply reverse them here for display [New -> Old].
  const reversedMessages = useMemo(() => [...messages].reverse(), [messages]);

  useEffect(() => {
    // Scroll to bottom (offset 0 in inverted list) when new message arrives
    if (reversedMessages.length > 0) {
      listRef.current?.scrollToOffset({ offset: 0, animated: true });
    }
  }, [reversedMessages.length, isLoading]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    setInputText('');

    // Add user message
    addMessage({ role: 'user', content: userText });

    // Trigger AI response
    await generateAiResponse();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100 bg-white">
          <View className="flex-row items-center gap-2">
            <View className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center">
              <Sparkles size={18} color="#007AFF" />
            </View>
            <View>
              <Text className="text-lg font-bold text-gray-900">9anouni</Text>
            </View>
          </View>
        </View>

        {/* Chat List */}
        <FlashList
          ref={listRef}
          data={reversedMessages}
          renderItem={({ item }) => <ChatBubble message={item} />}
          // @ts-ignore
          estimatedItemSize={100}
          inverted
          ListHeaderComponent={isLoading ? <LoadingBubble /> : null}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
        />

        {/* Input Area */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <View className="p-4 bg-white border-t border-gray-100">
            <View className="flex-row items-end gap-2 bg-gray-50 p-2 rounded-2xl border border-gray-200">
              <TextInput
                className="flex-1 text-base text-gray-900 max-h-32 px-2 py-2"
                placeholder="Posez votre question juridique..."
                placeholderTextColor="#9CA3AF"
                multiline
                value={inputText}
                onChangeText={setInputText}
              />
              <TouchableOpacity
                onPress={handleSend}
                disabled={!inputText.trim() || isLoading}
                className={`w-10 h-10 rounded-full items-center justify-center mb-1 ${inputText.trim() ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
              >
                <Send size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}