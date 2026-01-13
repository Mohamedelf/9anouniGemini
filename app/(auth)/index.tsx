
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Dimensions, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, Calendar, CheckCircle, AlertCircle } from 'lucide-react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
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

    // Date Picker State
    const [dob, setDob] = useState('');
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    // Validation State
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);

    // Animation values
    const indicatorPosition = useSharedValue(0);

    useEffect(() => {
        // Animate the toggle position
        indicatorPosition.value = withSpring(isLogin ? 0 : SEGMENT_WIDTH, {
            mass: 0.8,
            damping: 15,
            stiffness: 150
        });
        // Clear errors when switching modes
        setErrors({});
    }, [isLogin]);

    const animatedIndicatorStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: indicatorPosition.value }]
        };
    });

    const onDateChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(Platform.OS === 'ios');
        setDate(currentDate);

        if (selectedDate) {
            // Format Date: DD / MM / YYYY
            const day = currentDate.getDate().toString().padStart(2, '0');
            const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
            const year = currentDate.getFullYear();
            setDob(`${day} / ${month} / ${year} `);

            // Clear specific error if exists
            if (errors.dob) {
                setErrors(prev => ({ ...prev, dob: '' }));
            }
        }
    };

    const validate = () => {
        let newErrors: { [key: string]: string } = {};
        let isValid = true;

        // Email Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!emailRegex.test(email)) {
            newErrors.email = 'Please enter a valid email address';
            isValid = false;
        }

        // Password Validation
        if (!password) {
            newErrors.password = 'Password is required';
            isValid = false;
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
            isValid = false;
        }

        if (!isLogin) {
            // Sign Up Validation
            if (!firstName) {
                newErrors.firstName = 'First name is required';
                isValid = false;
            }
            if (!lastName) {
                newErrors.lastName = 'Last name is required';
                isValid = false;
            }
            if (!dob) {
                newErrors.dob = 'Date of birth is required';
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = () => {
        if (validate()) {
            const formData = isLogin
                ? { email, password }
                : { firstName, lastName, dob, email, password };

            console.log(`Submitting ${isLogin ? 'Login' : 'Signup'} with: `, formData);
            // Simulate successful API call
            setTimeout(() => {
                setIsSubmitted(true);
            }, 500);
        }
    };

    const resetForm = () => {
        setIsSubmitted(false);
        setIsLogin(true);
        setEmail('');
        setPassword('');
        setFirstName('');
        setLastName('');
        setDob('');
        setDate(new Date());
        setErrors({});
    };

    if (isSubmitted) {
        return (
            <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900 justify-center items-center px-6">
                <StatusBar style="auto" />
                <Animated.View entering={FadeIn} className="items-center w-full">
                    <CheckCircle size={80} color="#10B981" />
                    <Text className="text-3xl font-bold text-gray-900 dark:text-white mt-6 text-center">
                        Success!
                    </Text>
                    <Text className="text-gray-500 dark:text-gray-400 text-center mt-2 mb-8">
                        {isLogin
                            ? "You have successfully logged in."
                            : "Your account has been created successfully. Please check your email to verify your account."}
                    </Text>

                    <TouchableOpacity
                        className="bg-blue-600 h-14 rounded-xl items-center justify-center w-full shadow-lg active:bg-blue-700"
                        onPress={resetForm}
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
                    <View className="items-center mb-8 pt-4">
                        {/* Logo */}
                        <View className="w-20 h-20 bg-blue-600 rounded-2xl items-center justifyContent-center mb-6 shadow-lg rotate-3">
                            <Text className="text-white text-4xl font-bold">9</Text>
                        </View>

                        {/* Animated Segmented Control */}
                        <View className="bg-gray-200 dark:bg-gray-800 rounded-full p-1 h-14 flex-row relative w-full items-center">
                            <Animated.View
                                style={[
                                    {
                                        width: SEGMENT_WIDTH,
                                        height: '100%',
                                        position: 'absolute',
                                        left: 4,
                                        top: 4,
                                        backgroundColor: 'white', // You might want this dark in dark mode, but 'white' is standard for sliding pill
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
                                <Text className={`font-bold text-base ${isLogin ? 'text-gray-900' : 'text-gray-500 dark:text-gray-400'}`}>
                                    Login
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                className="flex-1 items-center justify-center h-full z-10"
                                onPress={() => setIsLogin(false)}
                                activeOpacity={0.7}
                            >
                                <Text className={`font-bold text-base ${!isLogin ? 'text-gray-900' : 'text-gray-500 dark:text-gray-400'}`}>
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
                            <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                {isLogin ? 'Welcome Back!' : 'Start Your Journey'}
                            </Text>
                            <Text className="text-gray-500 dark:text-gray-400 text-center">
                                {isLogin
                                    ? 'Please sign in to continue.'
                                    : 'Create your account to get started.'}
                            </Text>
                        </View>

                        {/* Form Fields Container */}
                        <View className="space-y-5">
                            {!isLogin && (
                                <Animated.View entering={FadeIn} exiting={FadeOut}>
                                    {/* First Name Input */}
                                    <Animated.View layout={Layout.springify()} className="space-y-2 mb-5">
                                        <Text className="text-gray-700 dark:text-gray-300 font-medium ml-1">Prénom</Text>
                                        <View className={`flex-row items-center bg-white dark:bg-gray-800 border ${errors.firstName ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-700'} rounded-xl px-4 h-14 focus:border-blue-500 transition-all shadow-sm`}>
                                            <User size={20} color={errors.firstName ? "#EF4444" : "#9CA3AF"} />
                                            <TextInput
                                                className="flex-1 ml-3 text-gray-900 dark:text-white text-base"
                                                placeholder="Votre prénom"
                                                placeholderTextColor="#9CA3AF"
                                                value={firstName}
                                                onChangeText={setFirstName}
                                            />
                                        </View>
                                        {errors.firstName && (
                                            <Animated.Text entering={FadeIn} className="text-red-500 text-xs ml-1">{errors.firstName}</Animated.Text>
                                        )}
                                    </Animated.View>

                                    {/* Last Name Input */}
                                    <Animated.View layout={Layout.springify()} className="space-y-2 mb-5">
                                        <Text className="text-gray-700 dark:text-gray-300 font-medium ml-1">Nom</Text>
                                        <View className={`flex-row items-center bg-white dark:bg-gray-800 border ${errors.lastName ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-700'} rounded-xl px-4 h-14 focus:border-blue-500 transition-all shadow-sm`}>
                                            <User size={20} color={errors.lastName ? "#EF4444" : "#9CA3AF"} />
                                            <TextInput
                                                className="flex-1 ml-3 text-gray-900 dark:text-white text-base"
                                                placeholder="Votre nom"
                                                placeholderTextColor="#9CA3AF"
                                                value={lastName}
                                                onChangeText={setLastName}
                                            />
                                        </View>
                                        {errors.lastName && (
                                            <Animated.Text entering={FadeIn} className="text-red-500 text-xs ml-1">{errors.lastName}</Animated.Text>
                                        )}
                                    </Animated.View>

                                    {/* Date of Birth Input (Native Date Picker) */}
                                    <Animated.View layout={Layout.springify()} className="space-y-2 mb-5">
                                        <Text className="text-gray-700 dark:text-gray-300 font-medium ml-1">Date de naissance</Text>
                                        <Pressable
                                            onPress={() => setShowDatePicker(true)}
                                            className={`flex-row items-center bg-white dark:bg-gray-800 border ${errors.dob ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-700'} rounded-xl px-4 h-14 active:bg-gray-50 dark:active:bg-gray-700 transition-all shadow-sm`}
                                        >
                                            <Text className={`flex-1 text-base ${dob ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                                                {dob || 'JJ / MM / AAAA'}
                                            </Text>
                                            <Calendar size={20} color={errors.dob ? "#EF4444" : "#9CA3AF"} />
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

                                        {errors.dob && (
                                            <Animated.Text entering={FadeIn} className="text-red-500 text-xs ml-1">{errors.dob}</Animated.Text>
                                        )}
                                    </Animated.View>
                                </Animated.View>
                            )}

                            {/* Email Input */}
                            <Animated.View layout={Layout.springify()} className="space-y-2 mb-5">
                                <Text className="text-gray-700 dark:text-gray-300 font-medium ml-1">Email Address</Text>
                                <View className={`flex-row items-center bg-white dark:bg-gray-800 border ${errors.email ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-700'} rounded-xl px-4 h-14 focus:border-blue-500 transition-all shadow-sm`}>
                                    <Mail size={20} color={errors.email ? "#EF4444" : "#9CA3AF"} />
                                    <TextInput
                                        className="flex-1 ml-3 text-gray-900 dark:text-white text-base"
                                        placeholder="name@example.com"
                                        placeholderTextColor="#9CA3AF"
                                        value={email}
                                        onChangeText={setEmail}
                                        autoCapitalize="none"
                                        keyboardType="email-address"
                                    />
                                </View>
                                {errors.email && (
                                    <Animated.Text entering={FadeIn} className="text-red-500 text-xs ml-1">{errors.email}</Animated.Text>
                                )}
                            </Animated.View>

                            {/* Password Input */}
                            <Animated.View layout={Layout.springify()} className="space-y-2">
                                <Text className="text-gray-700 dark:text-gray-300 font-medium ml-1">Password</Text>
                                <View className={`flex-row items-center bg-white dark:bg-gray-800 border ${errors.password ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-700'} rounded-xl px-4 h-14 focus:border-blue-500 transition-all shadow-sm`}>
                                    <Lock size={20} color={errors.password ? "#EF4444" : "#9CA3AF"} />
                                    <TextInput
                                        className="flex-1 ml-3 text-gray-900 dark:text-white text-base"
                                        placeholder="Enter your password"
                                        placeholderTextColor="#9CA3AF"
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry={!showPassword}
                                    />
                                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                        {showPassword ? (
                                            <EyeOff size={20} color={errors.password ? "#EF4444" : "#9CA3AF"} />
                                        ) : (
                                            <Eye size={20} color={errors.password ? "#EF4444" : "#9CA3AF"} />
                                        )}
                                    </TouchableOpacity>
                                </View>
                                {errors.password && (
                                    <Animated.Text entering={FadeIn} className="text-red-500 text-xs ml-1">{errors.password}</Animated.Text>
                                )}
                            </Animated.View>
                        </View>

                        {/* Forgot Password Link (Login only) */}
                        {isLogin && (
                            <Animated.View entering={FadeIn} exiting={FadeOut}>
                                <TouchableOpacity
                                    className="self-end mt-2"
                                    onPress={() => router.push('/(auth)/forgot-password')}
                                >
                                    <Text className="text-blue-600 font-medium">Forgot Password?</Text>
                                </TouchableOpacity>
                            </Animated.View>
                        )}

                        {/* Terms Checkbox (Sign Up only) */}
                        {!isLogin && (
                            <View className="flex-row items-center mb-4 px-1 mt-6">
                                <Pressable
                                    onPress={() => setHasAcceptedTerms(!hasAcceptedTerms)}
                                    className="mr-3"
                                >
                                    <MaterialCommunityIcons
                                        name={hasAcceptedTerms ? "checkbox-marked" : "checkbox-blank-outline"}
                                        size={24}
                                        color={hasAcceptedTerms ? "#2563EB" : "#9CA3AF"} // blue-600 : gray-400
                                    />
                                </Pressable>
                                <Text className="flex-1 text-xs text-gray-500 dark:text-gray-400">
                                    J'accepte les{' '}
                                    <Text
                                        className="text-blue-600 dark:text-blue-500 underline"
                                        onPress={() => Alert.alert('Lien cliqué', 'Conditions Générales')}
                                    >
                                        Conditions Générales
                                    </Text>
                                    {' '}et la{' '}
                                    <Text
                                        className="text-blue-600 dark:text-blue-500 underline"
                                        onPress={() => Alert.alert('Lien cliqué', 'Politique de Confidentialité')}
                                    >
                                        Politique de Confidentialité
                                    </Text>.
                                </Text>
                            </View>
                        )}

                        {/* Action Button */}
                        <TouchableOpacity
                            className={`bg-blue-600 h-14 rounded-xl items-center justify-center flex-row mt-10 shadow-blue-500/30 shadow-lg active:bg-blue-700 ${(!isLogin && !hasAcceptedTerms) ? 'opacity-50' : 'opacity-100'}`}
                            onPress={handleSubmit}
                            disabled={!isLogin && !hasAcceptedTerms}
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
