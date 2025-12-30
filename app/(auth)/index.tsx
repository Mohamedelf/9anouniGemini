import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
    return (
        <SafeAreaView className="flex-1 bg-white justify-center items-center">
            <Text className="text-xl font-bold">Ecran de Connexion</Text>
            <Text className="text-gray-500 mt-2">Authentification à venir...</Text>
        </SafeAreaView>
    );
}
