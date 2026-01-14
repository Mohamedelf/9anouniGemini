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
        "mb-3 relative group",
        isUser
          ? "max-w-[80%] bg-primary self-end rounded-2xl rounded-tr-sm px-4 py-3"
          : "w-full self-start py-2"
      )}
    >
      <Text
        selectable={true}
        selectionColor="rgba(0, 255, 255, 0.5)"
        className={clsx(
          "text-base leading-6",
          isUser ? "text-white" : "text-gray-100 dark:text-gray-100"
        )}
      >
        {message.content}
      </Text>

      {!isUser && (
        <View className="flex-row justify-start mt-3 pt-2 border-t border-gray-700/30 dark:border-gray-700/30">
          <TouchableOpacity
            onPress={copyToClipboard}
            className="flex-row items-center gap-1 opacity-60 active:opacity-100"
          >
            {copied ? (
              <>
                <Check size={14} color="#9CA3AF" />
                <Text className="text-xs text-gray-400 dark:text-gray-400">Copié</Text>
              </>
            ) : (
              <>
                <Copy size={14} color="#9CA3AF" />
                <Text className="text-xs text-gray-400 dark:text-gray-400">Copier</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};