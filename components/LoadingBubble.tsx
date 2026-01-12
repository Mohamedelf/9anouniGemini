import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withSequence,
    Easing
} from 'react-native-reanimated';
import clsx from 'clsx';
import { Sparkles } from 'lucide-react-native';

export const LoadingBubble: React.FC = () => {
    const opacity = useSharedValue(0.5);

    useEffect(() => {
        opacity.value = withRepeat(
            withSequence(
                withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
                withTiming(0.5, { duration: 800, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return (
        <View
            className={clsx(
                "max-w-[80%] rounded-2xl px-4 py-3 mb-3",
                "bg-gray-200 dark:bg-gray-700 self-start rounded-tl-sm"
            )}
        >
            <View className="flex-row items-center gap-2">
                <Sparkles size={16} className="text-gray-500" color="#6B7280" />
                <Animated.Text
                    style={animatedStyle}
                    className="text-base leading-6 text-gray-700 dark:text-gray-300 font-medium"
                >
                    L'IA réfléchit...
                </Animated.Text>
            </View>
        </View>
    );
};
