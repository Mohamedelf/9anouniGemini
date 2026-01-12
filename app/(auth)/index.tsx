import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, Calendar } from 'lucide-react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSpring,
    FadeIn,
    FadeOut,
    Layout
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
// Calculate segmented control width based on screen width minus padding
const SEGMENT_WIDTH = (width - 48 - 8) / 2; // px-6 = 24*2 = 48 total padding, 8 internal padding

export default function AuthScreen() {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    // Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dob, setDob] = useState('');

    // Animation values
    const indicatorPosition = useSharedValue(0);

    useEffect(() => {
        // Animate the toggle position
        indicatorPosition.value = withSpring(isLogin ? 0 : SEGMENT_WIDTH, {
            mass: 0.8,
            damping: 15,
            stiffness: 150
        });
    }, [isLogin]);

    const animatedIndicatorStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: indicatorPosition.value }]
        };
    });

    const handleSubmit = () => {
        const formData = isLogin
            ? { email, password }
            : { firstName, lastName, dob, email, password };

        console.log(`Submitting ${isLogin ? 'Login' : 'Signup'} with:`, formData);
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <StatusBar style="dark" />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingBottom: 40 }}
                    className="px-6"
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header Section */}
                    <View className="items-center mb-8 pt-4">
                        {/* Logo */}
                        <View className="w-20 h-20 bg-blue-600 rounded-2xl items-center justifyContent-center mb-6 shadow-lg rotate-3">
                            <Text className="text-white text-4xl font-bold">9</Text>
                        </View>

                        {/* Animated Segmented Control */}
                        <View className="bg-gray-200 rounded-full p-1 h-14 flex-row relative w-full items-center">
                            <Animated.View
                                style={[
                                    {
                                        width: SEGMENT_WIDTH,
                                        height: '100%',
                                        position: 'absolute',
                                        left: 4,
                                        top: 4, // Center vertically with padding
                                        backgroundColor: 'white',
                                        borderRadius: 9999,
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.1,
                                        shadowRadius: 4,
                                        elevation: 3
                                    },
                                    animatedIndicatorStyle
                                ]}
                            />

                            <TouchableOpacity
                                className="flex-1 items-center justify-center h-full z-10"
                                onPress={() => setIsLogin(true)}
                                activeOpacity={0.7}
                            >
                                <Text className={`font-bold text-base ${isLogin ? 'text-gray-900' : 'text-gray-500'}`}>
                                    Login
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                className="flex-1 items-center justify-center h-full z-10"
                                onPress={() => setIsLogin(false)}
                                activeOpacity={0.7}
                            >
                                <Text className={`font-bold text-base ${!isLogin ? 'text-gray-900' : 'text-gray-500'}`}>
                                    Sign Up
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Animated Form Section */}
                    <Animated.View
                        layout={Layout.springify()}
                        className="w-full"
                    >
                        <View className="items-center mb-8">
                            <Text className="text-2xl font-bold text-gray-900 mb-1">
                                {isLogin ? 'Welcome Back!' : 'Start Your Journey'}
                            </Text>
                            <Text className="text-gray-500 text-center">
                                {isLogin
                                    ? 'Please sign in to continue.'
                                    : 'Create your account to get started.'}
                            </Text>
                        </View>

                        {/* Form Fields Container */}
                        <View className="space-y-5">
                            {!isLogin && (
                                <Animated.View entering={FadeIn} exiting={FadeOut} className="space-y-5">
                                    {/* First Name Input */}
                                    <View className="space-y-2">
                                        <Text className="text-gray-700 font-medium ml-1">Prénom</Text>
                                        <View className="flex-row items-center bg-white border border-gray-200 rounded-xl px-4 h-14 focus:border-blue-500 transition-all shadow-sm">
                                            <User size={20} color="#9CA3AF" />
                                            <TextInput
                                                className="flex-1 ml-3 text-gray-900 text-base"
                                                placeholder="Votre prénom"
                                                placeholderTextColor="#9CA3AF"
                                                value={firstName}
                                                onChangeText={setFirstName}
                                            />
                                        </View>
                                    </View>

                                    {/* Last Name Input */}
                                    <View className="space-y-2">
                                        <Text className="text-gray-700 font-medium ml-1">Nom</Text>
                                        <View className="flex-row items-center bg-white border border-gray-200 rounded-xl px-4 h-14 focus:border-blue-500 transition-all shadow-sm">
                                            <User size={20} color="#9CA3AF" />
                                            <TextInput
                                                className="flex-1 ml-3 text-gray-900 text-base"
                                                placeholder="Votre nom"
                                                placeholderTextColor="#9CA3AF"
                                                value={lastName}
                                                onChangeText={setLastName}
                                            />
                                        </View>
                                    </View>

                                    {/* Date of Birth Input */}
                                    <View className="space-y-2">
                                        <Text className="text-gray-700 font-medium ml-1">Date de naissance</Text>
                                        <View className="flex-row items-center bg-white border border-gray-200 rounded-xl px-4 h-14 focus:border-blue-500 transition-all shadow-sm">
                                            <Calendar size={20} color="#9CA3AF" />
                                            <TextInput
                                                className="flex-1 ml-3 text-gray-900 text-base"
                                                placeholder="JJ/MM/AAAA"
                                                placeholderTextColor="#9CA3AF"
                                                value={dob}
                                                onChangeText={setDob}
                                                keyboardType="numbers-and-punctuation"
                                            />
                                        </View>
                                    </View>
                                </Animated.View>
                            )}

                            {/* Email Input */}
                            <Animated.View layout={Layout.springify()} className="space-y-2">
                                <Text className="text-gray-700 font-medium ml-1">Email Address</Text>
                                <View className="flex-row items-center bg-white border border-gray-200 rounded-xl px-4 h-14 focus:border-blue-500 transition-all shadow-sm">
                                    <Mail size={20} color="#9CA3AF" />
                                    <TextInput
                                        className="flex-1 ml-3 text-gray-900 text-base"
                                        placeholder="name@example.com"
                                        placeholderTextColor="#9CA3AF"
                                        value={email}
                                        onChangeText={setEmail}
                                        autoCapitalize="none"
                                        keyboardType="email-address"
                                    />
                                </View>
                            </Animated.View>

                            {/* Password Input */}
                            <Animated.View layout={Layout.springify()} className="space-y-2">
                                <Text className="text-gray-700 font-medium ml-1">Password</Text>
                                <View className="flex-row items-center bg-white border border-gray-200 rounded-xl px-4 h-14 focus:border-blue-500 transition-all shadow-sm">
                                    <Lock size={20} color="#9CA3AF" />
                                    <TextInput
                                        className="flex-1 ml-3 text-gray-900 text-base"
                                        placeholder="Enter your password"
                                        placeholderTextColor="#9CA3AF"
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry={!showPassword}
                                    />
                                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                        {showPassword ? (
                                            <EyeOff size={20} color="#9CA3AF" />
                                        ) : (
                                            <Eye size={20} color="#9CA3AF" />
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </Animated.View>
                        </View>

                        {/* Forgot Password Link (Login only) */}
                        {isLogin && (
                            <Animated.View entering={FadeIn} exiting={FadeOut}>
                                <TouchableOpacity className="self-end mt-2">
                                    <Text className="text-blue-600 font-medium">Forgot Password?</Text>
                                </TouchableOpacity>
                            </Animated.View>
                        )}

                        {/* Action Button */}
                        <TouchableOpacity
                            className="bg-blue-600 h-14 rounded-xl items-center justify-center flex-row mt-10 shadow-blue-500/30 shadow-lg active:bg-blue-700"
                            onPress={handleSubmit}
                        >
                            <Text className="text-white font-bold text-lg mr-2">
                                {isLogin ? 'Log In' : 'Sign Up'}
                            </Text>
                            <ArrowRight size={20} color="white" strokeWidth={2.5} />
                        </TouchableOpacity>
                    </Animated.View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
