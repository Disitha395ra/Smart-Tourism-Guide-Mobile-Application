import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  SafeAreaView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, ScrollView
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const COLORS = {
  primary: '#0077B6',
  secondary: '#023E8A',
  accent: '#00B4D8',
  gold: '#FFD60A',
  bg: '#F0F8FF',
  white: '#FFFFFF',
  text: '#03045E',
  gray: '#6C757D',
  danger: '#E63946',
};

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'tourist', phone: ''
  });

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      return Alert.alert('Error', 'Email and password are required');
    }
    if (!isLogin && !form.name) {
      return Alert.alert('Error', 'Name is required');
    }

    setLoading(true);
    try {
      if (isLogin) {
        // ── LOGIN ──
        const { data } = await api.post('/api/auth/login', {
          email: form.email,
          password: form.password,
        });
        await login(data.user, data.token);
      } else {
        // ── REGISTER ──
        await api.post('/api/auth/register', {
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
          phone: form.phone,
        });

        // Show success, reset form, and go to login
        Alert.alert(
          '🎉 Account Created!',
          'Your account has been created successfully. Please sign in to continue.',
          [
            {
              text: 'Sign In Now',
              onPress: () => {
                setForm({ name: '', email: form.email, password: '', role: 'tourist', phone: '' });
                setIsLogin(true);
              },
            },
          ]
        );
      }
    } catch (err) {
      const msg = err.response?.data?.error || 'Connection failed. Is the server running?';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.flagEmoji}>🇱🇰</Text>
            <Text style={styles.appName}>SmartTour</Text>
            <Text style={styles.tagline}>Discover Sri Lanka</Text>
          </View>

          {/* Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{isLogin ? 'Welcome Back!' : 'Create Account'}</Text>
            <Text style={styles.cardSub}>{isLogin ? 'Sign in to continue' : 'Join as a Tourist or Guide'}</Text>

            {!isLogin && (
              <>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your name"
                  value={form.name}
                  onChangeText={(v) => setForm({ ...form, name: v })}
                  placeholderTextColor={COLORS.gray}
                />
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="+94 xx xxx xxxx"
                  value={form.phone}
                  onChangeText={(v) => setForm({ ...form, phone: v })}
                  keyboardType="phone-pad"
                  placeholderTextColor={COLORS.gray}
                />
                <Text style={styles.label}>Register as</Text>
                <View style={styles.roleRow}>
                  {['tourist', 'guide'].map((r) => (
                    <TouchableOpacity
                      key={r}
                      style={[styles.roleBtn, form.role === r && styles.roleBtnActive]}
                      onPress={() => setForm({ ...form, role: r })}
                    >
                      <Text style={[styles.roleBtnText, form.role === r && styles.roleBtnTextActive]}>
                        {r === 'tourist' ? '🎒 Tourist' : '🧭 Tour Guide'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="your@email.com"
              value={form.email}
              onChangeText={(v) => setForm({ ...form, email: v })}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={COLORS.gray}
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              value={form.password}
              onChangeText={(v) => setForm({ ...form, password: v })}
              secureTextEntry
              placeholderTextColor={COLORS.gray}
            />

            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitBtnText}>
                  {isLogin ? '🔓 Sign In' : '🚀 Create Account'}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={styles.switchRow}>
              <Text style={styles.switchText}>
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                <Text style={styles.switchLink}>{isLogin ? 'Register' : 'Login'}</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primary },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  header: { alignItems: 'center', marginBottom: 30 },
  flagEmoji: { fontSize: 60, marginBottom: 8 },
  appName: { fontSize: 36, fontWeight: '900', color: COLORS.white, letterSpacing: 2 },
  tagline: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  card: { backgroundColor: COLORS.white, borderRadius: 24, padding: 24, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 20, elevation: 10 },
  cardTitle: { fontSize: 24, fontWeight: '800', color: COLORS.text, marginBottom: 4 },
  cardSub: { fontSize: 14, color: COLORS.gray, marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: COLORS.bg, borderRadius: 12, padding: 14, fontSize: 15, color: COLORS.text, borderWidth: 1, borderColor: '#DDE8F0' },
  roleRow: { flexDirection: 'row', gap: 10 },
  roleBtn: { flex: 1, borderRadius: 12, padding: 12, borderWidth: 2, borderColor: '#DDE8F0', alignItems: 'center' },
  roleBtnActive: { borderColor: COLORS.primary, backgroundColor: '#EFF7FF' },
  roleBtnText: { fontSize: 14, color: COLORS.gray, fontWeight: '600' },
  roleBtnTextActive: { color: COLORS.primary },
  submitBtn: { backgroundColor: COLORS.primary, borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 24 },
  submitBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '800' },
  switchRow: { alignItems: 'center', marginTop: 16 },
  switchText: { fontSize: 14, color: COLORS.gray },
  switchLink: { color: COLORS.primary, fontWeight: '700' },
});
