import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, Switch, Alert } from "react-native";
import { User, Moon, Bell, Globe, LogOut, Trash2, CreditCard, ChevronRight } from 'lucide-react-native';
import clsx from 'clsx';
import { useColorScheme } from 'nativewind';

export default function ProfileScreen() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [language, setLanguage] = useState('fr'); // 'fr' or 'ar'
  const isDark = colorScheme === 'dark';

  const toggleNotifications = () => setNotificationsEnabled(previousState => !previousState);

  const handleLogout = () => {
    Alert.alert("Déconnexion", "Êtes-vous sûr de vouloir vous déconnecter ?", [
      { text: "Annuler", style: "cancel" },
      { text: "Se déconnecter", style: "destructive", onPress: () => console.log("Logout pressed") }
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert("Supprimer le compte", "Cette action est irréversible. Êtes-vous sûr ?", [
      { text: "Annuler", style: "cancel" },
      { text: "Supprimer", style: "destructive", onPress: () => console.log("Delete account pressed") }
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header Section */}
        <View className="bg-white dark:bg-gray-800 p-6 items-center border-b border-gray-100 dark:border-gray-700 mb-6">
          <View className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full items-center justify-center mb-4 overflow-hidden border border-gray-200 dark:border-gray-600">
            {/* Placeholder Avatar - could use Image if available */}
            <User size={48} color={isDark ? "#9CA3AF" : "#9CA3AF"} />
          </View>
          <Text className="text-xl font-bold text-gray-900 dark:text-white">John Doe</Text>
          <Text className="text-gray-500 dark:text-gray-400">john.doe@example.com</Text>
          <TouchableOpacity className="mt-4 px-4 py-2 bg-primary/10 dark:bg-blue-500/20 rounded-full">
            <Text className="text-primary dark:text-blue-400 font-medium">Modifier le profil</Text>
          </TouchableOpacity>
        </View>

        {/* Subscription Section */}
        <View className="bg-white dark:bg-gray-800 px-4 py-2 border-y border-gray-100 dark:border-gray-700 mb-6">
          <Text className="text-gray-500 dark:text-gray-400 font-semibold mb-2 mt-4 px-2 uppercase text-xs">Abonnement</Text>
          <TouchableOpacity className="flex-row items-center justify-between p-3">
            <View className="flex-row items-center gap-3">
              <View className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900/30 items-center justify-center">
                <CreditCard size={18} color="#EAB308" />
              </View>
              <View>
                <Text className="text-gray-900 dark:text-white font-medium">Plan Actuel</Text>
                <Text className="text-primary dark:text-blue-400 font-bold">Gratuit</Text>
              </View>
            </View>
            <View className="bg-primary dark:bg-blue-600 px-3 py-1 rounded-lg">
              <Text className="text-white text-xs font-bold">Passer Premium</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center justify-between p-3 border-t border-gray-50 dark:border-gray-700">
            <Text className="text-gray-700 dark:text-gray-300 ml-11">Historique de paiement</Text>
            <ChevronRight size={20} color={isDark ? "#6B7280" : "#D1D5DB"} />
          </TouchableOpacity>
        </View>

        {/* Settings Section */}
        <View className="bg-white dark:bg-gray-800 border-y border-gray-100 dark:border-gray-700 mb-6">
          <Text className="text-gray-500 dark:text-gray-400 font-semibold mb-2 mt-4 px-6 uppercase text-xs">Préférences</Text>

          {/* Language */}
          <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-50 dark:border-gray-700">
            <View className="flex-row items-center gap-3">
              <Globe size={20} color={isDark ? "#9CA3AF" : "#4B5563"} />
              <Text className="text-gray-900 dark:text-white font-medium">Langue</Text>
            </View>
            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => setLanguage('fr')}
                className={clsx("px-3 py-1 rounded-md", language === 'fr' ? "bg-primary/10 dark:bg-blue-500/20" : "bg-gray-100 dark:bg-gray-700")}
              >
                <Text className={clsx("text-xs font-bold", language === 'fr' ? "text-primary dark:text-blue-400" : "text-gray-500 dark:text-gray-400")}>FR</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setLanguage('ar')}
                className={clsx("px-3 py-1 rounded-md", language === 'ar' ? "bg-primary/10 dark:bg-blue-500/20" : "bg-gray-100 dark:bg-gray-700")}
              >
                <Text className={clsx("text-xs font-bold", language === 'ar' ? "text-primary dark:text-blue-400" : "text-gray-500 dark:text-gray-400")}>AR</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Dark Mode */}
          <View className="flex-row items-center justify-between px-6 py-3 border-b border-gray-50 dark:border-gray-700">
            <View className="flex-row items-center gap-3">
              <Moon size={20} color={isDark ? "#9CA3AF" : "#4B5563"} />
              <Text className="text-gray-900 dark:text-white font-medium">Mode Sombre</Text>
            </View>
            <Switch
              trackColor={{ false: "#E5E7EB", true: "#bfdbfe" }}
              thumbColor={isDark ? "#007AFF" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleColorScheme}
              value={isDark}
            />
          </View>

          {/* Notifications */}
          <View className="flex-row items-center justify-between px-6 py-3">
            <View className="flex-row items-center gap-3">
              <Bell size={20} color={isDark ? "#9CA3AF" : "#4B5563"} />
              <Text className="text-gray-900 dark:text-white font-medium">Notifications de rappel</Text>
            </View>
            <Switch
              trackColor={{ false: "#E5E7EB", true: "#bfdbfe" }}
              thumbColor={notificationsEnabled ? "#007AFF" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleNotifications}
              value={notificationsEnabled}
            />
          </View>
        </View>

        {/* Account Actions */}
        <View className="bg-white dark:bg-gray-800 border-y border-gray-100 dark:border-gray-700 mb-6">
          <Text className="text-gray-500 dark:text-gray-400 font-semibold mb-2 mt-4 px-6 uppercase text-xs">Compte</Text>

          <TouchableOpacity onPress={handleLogout} className="flex-row items-center px-6 py-4 border-b border-gray-50 dark:border-gray-700 active:bg-gray-50 dark:active:bg-gray-700">
            <LogOut size={20} color="#4B5563" />
            <Text className="text-gray-900 dark:text-white font-medium ml-3">Déconnexion</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleDeleteAccount} className="flex-row items-center px-6 py-4 active:bg-red-50 dark:active:bg-red-900/20">
            <Trash2 size={20} color="#EF4444" />
            <Text className="text-red-500 font-medium ml-3">Supprimer mon compte</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-center text-gray-400 text-xs mb-8">Version 1.0.0</Text>

      </ScrollView>
    </SafeAreaView>
  );
}