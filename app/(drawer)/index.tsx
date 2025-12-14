import React, { useState, useRef } from 'react';
import { View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { FlashList } from "@shopify/flash-list";
import { Send } from 'lucide-react-native';
import { useChatStore } from '../../store/chatStore';
import { ChatBubble } from '../../components/ChatBubble';

export default function ChatScreen() {
  const { messages, addMessage, isLoading, generateAiResponse } = useChatStore();
  const [inputText, setInputText] = useState('');
  const listRef = useRef<FlashList<any>>(null);

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
        {/* Chat List */}
        <FlashList
          ref={listRef}
          data={messages}
          renderItem={({ item }) => <ChatBubble message={item} />}
          estimatedItemSize={100}
          inverted
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
        />

        {/* Input Area */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
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
                className={`w-10 h-10 rounded-full items-center justify-center mb-1 ${
                  inputText.trim() ? 'bg-blue-600' : 'bg-gray-300'
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