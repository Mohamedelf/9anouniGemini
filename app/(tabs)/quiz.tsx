import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
  Alert
} from 'react-native';
import {
  X,
  Info,
  ChevronRight,
  Car,
  CheckCircle,
  AlertCircle,
  Play,
  RotateCcw,
  Check,
  Lock
} from 'lucide-react-native';
import clsx from 'clsx';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// --- Mock Data ---

type Option = {
  id: string;
  text: string;
};

type Question = {
  id: string;
  question: string;
  options: Option[];
  correctAnswer: string;
  explanation: string;
};

type QuizModule = {
  id: string;
  title: string;
  description: string;
  questionCount: number;
  questions: Question[];
  locked: boolean;
};

const SAMPLE_QUESTIONS: Question[] = [
  {
    id: '1',
    question: "Quelle est la vitesse maximale autorisée en agglomération ?",
    options: [
      { id: 'a', text: "40 km/h" },
      { id: 'b', text: "50 km/h" },
      { id: 'c', text: "60 km/h" },
      { id: 'd', text: "70 km/h" },
    ],
    correctAnswer: 'b',
    explanation: "En agglomération, la vitesse est généralement limitée à 50 km/h, sauf indication contraire, pour assurer la sécurité des piétons et des riverains.",
  },
  {
    id: '2',
    question: "Vous arrivez à un stop. Que devez-vous faire ?",
    options: [
      { id: 'a', text: "Ralentir et passer si personne n'arrive" },
      { id: 'b', text: "Marquer un temps d'arrêt absolu" },
      { id: 'c', text: "Klaxonner et passer" },
    ],
    correctAnswer: 'b',
    explanation: "Le panneau STOP impose un arrêt absolu à la limite de la chaussée abordée. Vous devez céder le passage à tous les autres véhicules.",
  },
  {
    id: '3',
    question: "Quel taux d'alcoolémie est autorisé pour un jeune conducteur ?",
    options: [
      { id: 'a', text: "0,5 g/l de sang" },
      { id: 'b', text: "0,2 g/l de sang" },
      { id: 'c', text: "0,0 g/l de sang" },
    ],
    correctAnswer: 'b',
    explanation: "Pour les jeunes conducteurs (permis probatoire), le taux limite est de 0,2 g/l de sang, ce qui équivaut pratiquement à zéro verre d'alcool.",
  },
  {
    id: '4',
    question: "Par temps de pluie, de combien devez-vous réduire votre vitesse sur autoroute ?",
    options: [
      { id: 'a', text: "10 km/h" },
      { id: 'b', text: "20 km/h" },
      { id: 'c', text: "30 km/h" },
    ],
    correctAnswer: 'a',
    explanation: "Sur autoroute, la vitesse maximale passe de 130 km/h à 110 km/h par temps de pluie, et sur route de 110 à 100 km/h.",
  },
  {
    id: '5',
    question: "Le port de la ceinture de sécurité est-il obligatoire à l'arrière ?",
    options: [
      { id: 'a', text: "Non, seulement à l'avant" },
      { id: 'b', text: "Oui, pour tous les passagers" },
      { id: 'c', text: "Uniquement pour les enfants" },
    ],
    correctAnswer: 'b',
    explanation: "La ceinture de sécurité est obligatoire pour tous les passagers du véhicule, à l'avant comme à l'arrière, pour éviter l'éjection en cas de choc.",
  },
];

const QUIZ_MODULES: QuizModule[] = [
  {
    id: 'm1',
    title: "Quiz #1 : Les bases",
    description: "Signalisation et priorités",
    questionCount: 5,
    questions: SAMPLE_QUESTIONS,
    locked: false,
  },
  {
    id: 'm2',
    title: "Quiz #2 : Avancé",
    description: "Situations complexes",
    questionCount: 10,
    questions: [],
    locked: true,
  },
  {
    id: 'm3',
    title: "Quiz #3 : Examen Blanc",
    description: "Simulation conditions réelles",
    questionCount: 40,
    questions: [],
    locked: true,
  },
];

// --- Components ---

export default function QuizScreen() {
  const [step, setStep] = useState<'selection' | 'quiz' | 'result'>('selection');
  const [currentModule, setCurrentModule] = useState<QuizModule | null>(null);

  // Quiz State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasValidated, setHasValidated] = useState(false); // New validation state
  const [score, setScore] = useState(0);

  // Animations
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Derived State
  const currentQuestion = currentModule?.questions[currentQuestionIndex];
  const totalQuestions = currentModule?.questions.length || 0;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const startQuiz = (module: QuizModule) => {
    if (module.locked) return;
    setCurrentModule(module);
    setStep('quiz');
    setCurrentQuestionIndex(0);
    setScore(0);
    resetQuestionState();
  };

  const resetQuestionState = () => {
    setSelectedOption(null);
    setHasValidated(false);
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const quitQuiz = () => {
    Alert.alert(
      "Quitter le quiz ?",
      "Votre progression sera perdue.",
      [
        { text: "Annuler", style: "cancel" },
        { text: "Quitter", style: "destructive", onPress: () => setStep('selection') }
      ]
    );
  };

  const handleOptionSelect = (optionId: string) => {
    if (hasValidated) return; // Lock selection after validation
    setSelectedOption(optionId);
  };

  // Main Logic for Button (Confirm -> Next)
  const handleMainAction = () => {
    if (!currentQuestion) return;

    if (!hasValidated) {
      // VALIDATION STEP
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setHasValidated(true);

      if (selectedOption === currentQuestion.correctAnswer) {
        setScore(prev => prev + 1);
      }
    } else {
      // NEXT STEP
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        resetQuestionState();
      } else {
        setStep('result');
      }
    }
  };

  const isCorrect = (optionId: string) => {
    return hasValidated && currentQuestion?.correctAnswer === optionId;
  };

  const isWrongSelection = (optionId: string) => {
    return hasValidated && selectedOption === optionId && selectedOption !== currentQuestion?.correctAnswer;
  };

  // --- Screens ---

  const renderSelectionScreen = () => (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <View className="px-6 py-6 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white">Quiz</Text>
        <Text className="text-gray-500 dark:text-gray-400">Choisissez un module pour commencer</Text>
      </View>

      <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
        <View className="gap-4 pb-10">
          {QUIZ_MODULES.map((module) => (
            <TouchableOpacity
              key={module.id}
              onPress={() => startQuiz(module)}
              activeOpacity={0.7}
              disabled={module.locked}
              className={clsx(
                "p-5 rounded-2xl border flex-row items-center gap-4 bg-white dark:bg-gray-800 shadow-sm",
                module.locked
                  ? "opacity-60 border-gray-100 dark:border-gray-700"
                  : "border-gray-100 dark:border-gray-700"
              )}
            >
              <View className={clsx(
                "w-14 h-14 rounded-xl items-center justify-center",
                module.locked
                  ? "bg-gray-100 dark:bg-gray-700"
                  : "bg-blue-100 dark:bg-blue-900/30"
              )}>
                {module.locked ? (
                  <Lock size={24} className="text-gray-400 dark:text-gray-500" />
                ) : (
                  <Car size={28} className="text-blue-600 dark:text-blue-400" />
                )}
              </View>

              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  {module.title}
                </Text>
                <Text className="text-sm text-gray-500 dark:text-gray-400">
                  {module.description}
                </Text>
                <View className="flex-row items-center gap-2 mt-2">
                  <View className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-md">
                    <Text className="text-xs font-medium text-gray-600 dark:text-gray-300">
                      {module.questionCount} Questions
                    </Text>
                  </View>
                  {module.locked && (
                    <Text className="text-xs text-orange-500 font-medium">Bientôt disponible</Text>
                  )}
                </View>
              </View>

              {!module.locked && (
                <ChevronRight size={20} className="text-gray-300 dark:text-gray-600" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  const renderResultScreen = () => (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900 items-center justify-center p-6">
      <View className="bg-white dark:bg-gray-800 w-full rounded-3xl p-8 shadow-sm items-center border border-gray-100 dark:border-gray-700">
        <View className="mb-6">
          {score > totalQuestions / 2 ? (
            <CheckCircle size={64} className="text-green-500" />
          ) : (
            <AlertCircle size={64} className="text-orange-500" />
          )}
        </View>

        <Text className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {score > totalQuestions / 2 ? "Félicitations !" : "Entraînement terminé"}
        </Text>

        <Text className="text-gray-500 dark:text-gray-400 text-center mb-8 text-lg">
          Vous avez obtenu un score de
        </Text>

        <View className="bg-gray-100 dark:bg-gray-700 px-8 py-4 rounded-2xl mb-8">
          <Text className="text-4xl font-extrabold text-blue-600 dark:text-blue-400">
            {score}/{totalQuestions}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => setStep('selection')}
          className="w-full bg-blue-600 active:bg-blue-700 py-4 rounded-xl flex-row items-center justify-center gap-2"
        >
          <RotateCcw size={20} color="white" />
          <Text className="text-white font-bold text-lg">Retour aux quiz</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (step === 'selection') return <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">{renderSelectionScreen()}</SafeAreaView>;
  if (step === 'result') return <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">{renderResultScreen()}</SafeAreaView>;

  if (!currentQuestion) return null;

  // Quiz Interface
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">

      {/* Zone A: Header & Progress */}
      <View className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 z-10">
        <View className="flex-row items-center justify-between mb-3">
          <View>
            <Text className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Question
            </Text>
            <Text className="text-lg font-bold text-gray-900 dark:text-white">
              {currentQuestionIndex + 1} <Text className="text-gray-400 font-normal text-base">/ {totalQuestions}</Text>
            </Text>
          </View>
          <TouchableOpacity
            onPress={quitQuiz}
            className="w-9 h-9 bg-gray-100 dark:bg-gray-800 rounded-full items-center justify-center"
          >
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </TouchableOpacity>
        </View>

        {/* Progress Bar */}
        <View className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <View
            className="h-full bg-blue-600 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </View>
      </View>

      {/* Zone B: Content */}
      <ScrollView
        className="flex-1 bg-gray-50 dark:bg-gray-950"
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Illustration Placeholder */}
          <View className="w-full h-48 bg-white dark:bg-gray-900 rounded-2xl mb-6 items-center justify-center border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            <Car size={64} className="text-gray-300 dark:text-gray-700" />
          </View>

          {/* Question Text */}
          <Text className="text-xl font-bold text-gray-900 dark:text-white mb-6 leading-8">
            {currentQuestion.question}
          </Text>

          {/* Options */}
          <View className="gap-3">
            {currentQuestion.options.map((option) => {
              const isSelected = selectedOption === option.id;

              // Determine visual state
              let containerStyle = "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800";
              let dotStyle = "border-gray-300 dark:border-gray-600";
              let textStyle = "text-gray-700 dark:text-gray-300";

              if (hasValidated) {
                if (isCorrect(option.id)) {
                  // Green style for correct answer
                  containerStyle = "bg-green-50 dark:bg-green-900/20 border-green-500";
                  dotStyle = "border-green-500 bg-green-500";
                  textStyle = "text-green-700 dark:text-green-300 font-bold";
                } else if (isWrongSelection(option.id)) {
                  // Red style for wrong user selection
                  containerStyle = "bg-red-50 dark:bg-red-900/20 border-red-500";
                  dotStyle = "border-red-500 bg-red-500";
                  textStyle = "text-red-700 dark:text-red-300 font-bold";
                } else {
                  // Dim other options
                  containerStyle = "bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 opacity-50";
                }
              } else if (isSelected) {
                // Blue style for selected (pre-validation)
                containerStyle = "bg-blue-50 dark:bg-blue-900/20 border-blue-500";
                dotStyle = "border-blue-500 bg-blue-500";
                textStyle = "text-blue-700 dark:text-blue-300 font-medium";
              }

              return (
                <TouchableOpacity
                  key={option.id}
                  onPress={() => handleOptionSelect(option.id)}
                  activeOpacity={0.9}
                  disabled={hasValidated}
                  className={clsx(
                    "p-4 rounded-xl border-2 flex-row items-center gap-3 transition-all",
                    containerStyle
                  )}
                >
                  <View className={clsx(
                    "w-6 h-6 rounded-full border-2 items-center justify-center",
                    dotStyle
                  )}>
                    {(isSelected || isCorrect(option.id) || isWrongSelection(option.id)) && (
                      <View className="w-2.5 h-2.5 bg-white rounded-full" />
                    )}
                  </View>
                  <Text className={clsx("flex-1 text-base", textStyle)}>
                    {option.text}
                  </Text>

                  {/* Status Icons */}
                  {hasValidated && isCorrect(option.id) && <Check size={20} className="text-green-600" />}
                  {hasValidated && isWrongSelection(option.id) && <X size={20} className="text-red-600" />}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Explanation Reveal (Only after validation) */}
          {hasValidated && (
            <View className="mt-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800 flex-row gap-3">
              <Info size={20} className="text-blue-600 dark:text-blue-400 mt-0.5" />
              <View className="flex-1">
                <Text className="font-bold text-blue-800 dark:text-blue-400 mb-1">Explication</Text>
                <Text className="text-blue-700 dark:text-blue-300 leading-5">
                  {currentQuestion.explanation}
                </Text>
              </View>
            </View>
          )}

          {/* Spacer for bottom bar */}
          <View className="h-6" />
        </Animated.View>
      </ScrollView>

      {/* Zone C: Bottom Navigation */}
      <View className="absolute bottom-0 left-0 right-0 p-4 bg-white/95 dark:bg-gray-900/95 border-t border-gray-100 dark:border-gray-800 backdrop-blur-sm">
        <View className="flex-row items-center gap-3">

          {/* Main Action Button (Confirm -> Next) */}
          <TouchableOpacity
            onPress={handleMainAction}
            disabled={!selectedOption}
            className={clsx(
              "flex-1 h-14 rounded-xl flex-row items-center justify-center gap-2 shadow-sm",
              selectedOption
                ? (hasValidated ? "bg-blue-600 active:bg-blue-700" : "bg-blue-600 active:bg-blue-700")
                : "bg-gray-200 dark:bg-gray-800 opacity-70"
            )}
          >
            <Text className={clsx(
              "font-bold text-lg",
              selectedOption ? "text-white" : "text-gray-400 dark:text-gray-500"
            )}>
              {hasValidated
                ? (currentQuestionIndex === totalQuestions - 1 ? "Terminer" : "Suivant")
                : "Confirmer"
              }
            </Text>
            {hasValidated && <ChevronRight size={20} color="white" />}
          </TouchableOpacity>
        </View>
      </View>

    </SafeAreaView>
  );
}