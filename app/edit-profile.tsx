import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Pressable, Platform, Alert, ActivityIndicator } from "react-native";
import { User, Calendar, ArrowLeft } from 'lucide-react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import clsx from 'clsx';

export default function EditProfileScreen() {
    const router = useRouter();
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';

    // Form State
    const [firstName, setFirstName] = useState('Mohamed');
    const [lastName, setLastName] = useState('El Fene');
    const [dob, setDob] = useState('01 / 01 / 1990');
    const [date, setDate] = useState(new Date(1990, 0, 1));
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const onDateChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(Platform.OS === 'ios');
        setDate(currentDate);

        if (selectedDate) {
            const day = currentDate.getDate().toString().padStart(2, '0');
            const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
            const year = currentDate.getFullYear();
            setDob(`${day} / ${month} / ${year} `);
        }
    };

    const handleSave = () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            router.back();
            // In a real app, you'd verify the data was updated or pass it back.
            // For now, we just go back.
        }, 1000);
    };

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
            <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>

                {/* Helper Header for Back Navigation (Optional if Drawer header is present, but good for UX) */}
                {/* Since this is a drawer screen, it might show the drawer header. 
            However, user requested a "Back" button. We can rely on the stack header if configured, 
            or add a custom one. Given the instructions imply a custom UI or standard header behavior, 
            and it's a drawer screen usually...
            But wait, if it's a drawer screen, it has a hamburger by default unless strictly configured as stack-like.
            Let's add a custom simple header for clarity as requested "Add a 'Back' icon or button at the top".
        */}
                <View className="px-6 py-4 flex-row items-center border-b border-gray-100 dark:border-gray-800">
                    <TouchableOpacity onPress={() => router.back()} className="mr-4">
                        <ArrowLeft size={24} color={isDark ? "white" : "black"} />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold text-gray-900 dark:text-white">Modifier le profil</Text>
                </View>

                <View className="p-6">
                    {/* Avatar Placeholder */}
                    <View className="items-center mb-8">
                        <View className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-600">
                            <User size={48} color={isDark ? "#9CA3AF" : "#9CA3AF"} />
                        </View>
                        <TouchableOpacity className="mt-3">
                            <Text className="text-primary dark:text-blue-400 font-medium">Changer la photo</Text>
                        </TouchableOpacity>
                    </View>

                    {/* First Name Input */}
                    <View className="space-y-2 mb-5">
                        <Text className="text-gray-700 dark:text-gray-300 font-medium ml-1">Prénom</Text>
                        <View className="flex-row items-center bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 h-14 focus:border-blue-500 transition-all shadow-sm">
                            <MaterialCommunityIcons name="account-outline" size={24} color="#9CA3AF" />
                            <TextInput
                                className="flex-1 ml-3 text-gray-900 dark:text-white text-base"
                                placeholder="Votre prénom"
                                placeholderTextColor="#9CA3AF"
                                value={firstName}
                                onChangeText={setFirstName}
                            />
                        </View>
                    </View>

                    {/* Last Name Input */}
                    <View className="space-y-2 mb-5">
                        <Text className="text-gray-700 dark:text-gray-300 font-medium ml-1">Nom</Text>
                        <View className="flex-row items-center bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 h-14 focus:border-blue-500 transition-all shadow-sm">
                            <MaterialCommunityIcons name="account-outline" size={24} color="#9CA3AF" />
                            <TextInput
                                className="flex-1 ml-3 text-gray-900 dark:text-white text-base"
                                placeholder="Votre nom"
                                placeholderTextColor="#9CA3AF"
                                value={lastName}
                                onChangeText={setLastName}
                            />
                        </View>
                    </View>

                    {/* Date of Birth Input */}
                    <View className="space-y-2 mb-5">
                        <Text className="text-gray-700 dark:text-gray-300 font-medium ml-1">Date de naissance</Text>
                        <Pressable
                            onPress={() => setShowDatePicker(true)}
                            className="flex-row items-center bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 h-14 active:bg-gray-100 dark:active:bg-gray-700 transition-all shadow-sm"
                        >
                            <Text className={`flex-1 text-base ${dob ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                                {dob || 'JJ / MM / AAAA'}
                            </Text>
                            <MaterialCommunityIcons name="calendar-range" size={24} color="#9CA3AF" />
                        </Pressable>

                        {showDatePicker && (
                            <DateTimePicker
                                value={date}
                                mode="date"
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                onChange={onDateChange}
                                maximumDate={new Date()}
                            />
                        )}
                    </View>

                    {/* Save Button */}
                    <TouchableOpacity
                        onPress={handleSave}
                        disabled={isLoading}
                        className="w-full bg-primary dark:bg-blue-600 h-14 rounded-xl items-center justify-center mt-4 shadow-lg active:bg-blue-700"
                    >
                        {isLoading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-white font-bold text-lg">Enregistrer les modifications</Text>
                        )}
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}
