import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import clsx from 'clsx';
import * as Clipboard from 'expo-clipboard';
import { Copy, Check } from 'lucide-react-native';
import { Message } from '../store/chatStore';

interface ChatBubbleProps {
  message: Message;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <View
      className={clsx(
        "max-w-[80%] rounded-2xl px-4 py-3 mb-3 relative group",
        isUser
          ? "bg-primary self-end rounded-tr-sm"
          : "bg-gray-200 dark:bg-gray-700 self-start rounded-tl-sm"
      )}
    >
      <Text
        className={clsx(
          "text-base leading-6",
          isUser ? "text-white" : "text-gray-900 dark:text-gray-100"
        )}
      >
        {message.content}
      </Text>

      {!isUser && (
        <View className="flex-row justify-end mt-2 pt-2 border-t border-gray-300 dark:border-gray-600">
          <TouchableOpacity
            onPress={copyToClipboard}
            className="flex-row items-center gap-1 opacity-60 active:opacity-100"
          >
            {copied ? (
              <>
                <Check size={14} color="#374151" />
                <Text className="text-xs text-gray-700 dark:text-gray-300">Copié</Text>
              </>
            ) : (
              <>
                <Copy size={14} color="#374151" />
                <Text className="text-xs text-gray-700 dark:text-gray-300">Copier</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};