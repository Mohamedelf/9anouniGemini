import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Mail, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react-native';
import Animated, { FadeIn, Layout } from 'react-native-reanimated';

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleResetPassword = async () => {
        // Validation
        setError('');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            setError('Email is required');
            return;
        } else if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setLoading(true);
        // Simulate network request
        setTimeout(() => {
            setLoading(false);
            setIsSubmitted(true);
        }, 1500);
    };

    if (isSubmitted) {
        return (
            <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900 justify-center items-center px-6">
                <StatusBar style="auto" />
                <Animated.View entering={FadeIn} className="items-center w-full">
                    <CheckCircle size={80} color="#10B981" />
                    <Text className="text-3xl font-bold text-gray-900 dark:text-white mt-6 text-center">
                        Email Sent!
                    </Text>
                    <Text className="text-gray-500 dark:text-gray-400 text-center mt-2 mb-8 px-4">
                        We have sent a password reset link to <Text className="font-bold text-gray-900 dark:text-white">{email}</Text>. Please check your inbox.
                    </Text>

                    <TouchableOpacity
                        className="bg-blue-600 h-14 rounded-xl items-center justify-center w-full shadow-lg active:bg-blue-700"
                        onPress={() => router.back()}
                    >
                        <Text className="text-white font-bold text-lg">Back to Login</Text>
                    </TouchableOpacity>
                </Animated.View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
            <StatusBar style="auto" />

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
                    <View className="items-center mb-8">
                        <View className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full items-center justify-center mb-6">
                            <Mail size={32} color="#2563EB" />
                        </View>
                        <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                            Reset Password
                        </Text>
                        <Text className="text-gray-500 dark:text-gray-400 text-center px-4">
                            Enter your email address to receive a secure link to reset your password.
                        </Text>
                    </View>

                    {/* Form Section */}
                    <Animated.View layout={Layout.springify()} className="w-full space-y-6">

                        {/* Email Input */}
                        <View className="space-y-2 mb-2">
                            <Text className="text-gray-700 dark:text-gray-300 font-medium ml-1">Email Address</Text>
                            <View className={`flex-row items-center bg-white dark:bg-gray-800 border ${error ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-700'} rounded-xl px-4 h-14 focus:border-blue-500 transition-all shadow-sm`}>
                                <Mail size={20} color={error ? "#EF4444" : "#9CA3AF"} />
                                <TextInput
                                    className="flex-1 ml-3 text-gray-900 dark:text-white text-base"
                                    placeholder="name@example.com"
                                    placeholderTextColor="#9CA3AF"
                                    value={email}
                                    onChangeText={(text) => {
                                        setEmail(text);
                                        if (error) setError('');
                                    }}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                />
                            </View>
                            {error ? (
                                <Animated.Text entering={FadeIn} className="text-red-500 text-xs ml-1">
                                    {error}
                                </Animated.Text>
                            ) : null}
                        </View>

                        {/* Submit Button */}
                        <TouchableOpacity
                            className="bg-blue-600 h-14 rounded-xl items-center justify-center flex-row shadow-blue-500/30 shadow-lg active:bg-blue-700"
                            onPress={handleResetPassword}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <>
                                    <Text className="text-white font-bold text-lg mr-2">
                                        Send Reset Link
                                    </Text>
                                    <ArrowRight size={20} color="white" strokeWidth={2.5} />
                                </>
                            )}
                        </TouchableOpacity>

                        {/* Back to Login */}
                        <TouchableOpacity
                            className="flex-row items-center justify-center py-2"
                            onPress={() => router.back()}
                        >
                            <ArrowLeft size={16} color="#6B7280" />
                            <Text className="text-gray-500 dark:text-gray-400 font-medium ml-2">
                                Back to Login
                            </Text>
                        </TouchableOpacity>

                    </Animated.View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
