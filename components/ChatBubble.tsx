import React from 'react';
import { View, Text } from 'react-native';
import clsx from 'clsx';
import { Message } from '../store/chatStore';

interface ChatBubbleProps {
  message: Message;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <View
      className={clsx(
        "max-w-[80%] rounded-2xl px-4 py-3 mb-3",
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
    </View>
  );
};