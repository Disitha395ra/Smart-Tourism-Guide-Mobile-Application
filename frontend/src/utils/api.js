import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Change this to your computer's local IP address when running on a physical device
// Example: 'http://192.168.1.5:5000'
export const BASE_URL = 'http://10.0.2.2:5000'; // For Android Emulator
// export const BASE_URL = 'http://localhost:5000'; // For iOS Simulator / Web

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Attach JWT token to every request automatically
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
