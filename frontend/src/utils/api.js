import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─────────────────────────────────────────────────────────────────
// HOW TO SET THE CORRECT URL:
//
// Option A – Physical phone via Expo Go:
//   Use your computer's local Wi-Fi IP address.
//   Your current IP is: 192.168.1.67
//   Make sure your phone and PC are on the SAME Wi-Fi network.
//
// Option B – Android Emulator (on same PC):
//   Use: http://10.0.2.2:5000
//
// Option C – iOS Simulator (on same Mac):
//   Use: http://localhost:5000
// ─────────────────────────────────────────────────────────────────

export const BASE_URL = 'http://192.168.1.88:5000'; // ← Physical phone (Expo Go)
// export const BASE_URL = 'http://10.0.2.2:5000';  // ← Android Emulator
// export const BASE_URL = 'http://localhost:5000';  // ← iOS Simulator / Web

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Automatically attach JWT token to every request
api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore
  }
  return config;
});

export default api;
