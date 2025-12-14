import { Platform } from 'react-native';
import { MMKV } from 'react-native-mmkv';

let mmkv: MMKV | null = null;

if (Platform.OS !== 'web') {
  try {
    mmkv = new MMKV();
  } catch (e) {
    console.error("MMKV initialization failed:", e);
  }
}

export const storage = {
  getString: (key: string) => {
    if (Platform.OS === 'web') {
      if (typeof localStorage === 'undefined') return null;
      return localStorage.getItem(key);
    }
    return mmkv?.getString(key) ?? null;
  },
  set: (key: string, value: string | boolean | number) => {
    if (Platform.OS === 'web') {
      if (typeof localStorage === 'undefined') return;
      localStorage.setItem(key, String(value));
      return;
    }
    if (typeof value === 'string') mmkv?.set(key, value);
    else if (typeof value === 'boolean') mmkv?.set(key, value);
    else if (typeof value === 'number') mmkv?.set(key, value);
  },
  delete: (key: string) => {
    if (Platform.OS === 'web') {
      if (typeof localStorage === 'undefined') return;
      localStorage.removeItem(key);
      return;
    }
    mmkv?.delete(key);
  }
};