import { View, Text, SafeAreaView } from "react-native";

export default function QuizScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-4">
        <Text className="text-2xl font-bold text-gray-900 mb-2">Quiz Code Route</Text>
        <Text className="text-center text-gray-500">
          Le module de quiz sera disponible prochainement.
        </Text>
      </View>
    </SafeAreaView>
  );
}