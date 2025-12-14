import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export const storage = {
  getString: async (key: string) => {
    if (Platform.OS === 'web') {
      if (typeof localStorage === 'undefined') return null;
      return localStorage.getItem(key);
    }
    try {
      return await AsyncStorage.getItem(key);
    } catch (e) {
      console.error('Error getting item:', e);
      return null;
    }
  },
  set: async (key: string, value: string | boolean | number) => {
    const stringValue = String(value);
    if (Platform.OS === 'web') {
      if (typeof localStorage === 'undefined') return;
      localStorage.setItem(key, stringValue);
      return;
    }
    try {
      await AsyncStorage.setItem(key, stringValue);
    } catch (e) {
      console.error('Error setting item:', e);
    }
  },
  delete: async (key: string) => {
    if (Platform.OS === 'web') {
      if (typeof localStorage === 'undefined') return;
      localStorage.removeItem(key);
      return;
    }
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.error('Error removing item:', e);
    }
  }
};