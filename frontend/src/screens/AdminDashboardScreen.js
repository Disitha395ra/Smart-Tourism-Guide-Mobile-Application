import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, ActivityIndicator, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const COLORS = {
  primary: '#0077B6', secondary: '#023E8A', accent: '#00B4D8',
  gold: '#FFD60A', bg: '#F0F8FF', white: '#FFFFFF', text: '#03045E', gray: '#6C757D',
  danger: '#DC3545', success: '#28A745'
};

export default function AdminDashboardScreen({ navigation }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'users') {
        const res = await api.get('/api/auth/users');
        setUsers(res.data);
      } else {
        const res = await api.get('/api/attractions');
        setAttractions(res.data);
      }
    } catch (err) {
      console.log('Error fetching admin data:', err);
      Alert.alert('Error', 'Failed to load data.');
    } finally {
      setLoading(false);
    }
  };

  const handleSeedAttractions = async () => {
    try {
      setLoading(true);
      const res = await api.post('/api/attractions/seed');
      Alert.alert('Success', res.data.message);
      fetchData();
    } catch (err) {
      Alert.alert('Error', 'Failed to seed attractions.');
      setLoading(false);
    }
  };

  const handleDeleteAttraction = async (id) => {
    Alert.alert('Delete Attraction', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/api/attractions/${id}`);
            fetchData();
          } catch (err) {
            Alert.alert('Error', 'Failed to delete.');
          }
        }
      }
    ]);
  };

  if (user?.role !== 'admin') {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ textAlign: 'center', marginTop: 50 }}>Access Denied.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
      </View>

      <View style={styles.tabBar}>
        {['users', 'attractions'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
      ) : (
        <ScrollView style={styles.content}>
          {activeTab === 'users' && (
            <View>
              <Text style={styles.sectionTitle}>Total Users: {users.length}</Text>
              {users.map(u => (
                <View key={u._id} style={styles.card}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>{u.name}</Text>
                    <Text style={styles.cardSub}>{u.email}</Text>
                  </View>
                  <View style={[styles.roleBadge, { backgroundColor: u.role === 'admin' ? COLORS.gold : u.role === 'guide' ? COLORS.accent : '#eee' }]}>
                    <Text style={styles.roleText}>{u.role}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {activeTab === 'attractions' && (
            <View>
              <View style={styles.actionRow}>
                <Text style={styles.sectionTitle}>Total: {attractions.length}</Text>
                <TouchableOpacity style={styles.seedBtn} onPress={handleSeedAttractions}>
                  <Text style={styles.seedBtnText}>Seed DB</Text>
                </TouchableOpacity>
              </View>

              {attractions.map(a => (
                <View key={a._id} style={styles.card}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>{a.name}</Text>
                    <Text style={styles.cardSub}>{a.location?.city}</Text>
                  </View>
                  <TouchableOpacity onPress={() => handleDeleteAttraction(a._id)}>
                    <Ionicons name="trash" size={20} color={COLORS.danger} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: 10 },
  backBtn: { marginRight: 15 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: COLORS.text },
  tabBar: { flexDirection: 'row', backgroundColor: COLORS.white, marginHorizontal: 20, borderRadius: 10, padding: 4 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  tabActive: { backgroundColor: COLORS.primary },
  tabText: { fontSize: 14, color: COLORS.gray, fontWeight: '600' },
  tabTextActive: { color: COLORS.white },
  content: { padding: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 15, color: COLORS.text },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  seedBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8 },
  seedBtnText: { color: COLORS.white, fontWeight: '700', fontSize: 12 },
  card: { flexDirection: 'row', backgroundColor: COLORS.white, padding: 15, borderRadius: 12, marginBottom: 10, alignItems: 'center', elevation: 1 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  cardSub: { fontSize: 13, color: COLORS.gray, marginTop: 4 },
  roleBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  roleText: { fontSize: 11, fontWeight: '700', color: COLORS.text }
});
