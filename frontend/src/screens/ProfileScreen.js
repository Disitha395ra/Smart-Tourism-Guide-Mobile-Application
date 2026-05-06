import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, Alert, ActivityIndicator, Switch
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

const COLORS = {
  primary: '#0077B6', secondary: '#023E8A', accent: '#00B4D8',
  gold: '#FFD60A', bg: '#F0F8FF', white: '#FFFFFF', text: '#03045E', gray: '#6C757D',
  danger: '#E63946',
};

const PREFERENCES = [
  { id: 'history', label: 'History & Heritage', icon: '🏛️' },
  { id: 'beach', label: 'Beach & Coastal', icon: '🏖️' },
  { id: 'wildlife', label: 'Wildlife & Nature', icon: '🐘' },
  { id: 'religious', label: 'Religious Sites', icon: '🛕' },
  { id: 'adventure', label: 'Adventure & Sports', icon: '🧗' },
  { id: 'culture', label: 'Culture & Arts', icon: '🎭' },
  { id: 'food', label: 'Food & Cuisine', icon: '🍛' },
];

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState(user?.preferences || []);
  const [notifications, setNotifications] = useState(true);

  const togglePref = (id) => {
    setPreferences(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout }
      ]
    );
  };

  const menuItems = [
    { icon: 'calendar-outline', label: 'My Bookings', onPress: () => navigation.navigate('Bookings') },
    { icon: 'chatbubbles-outline', label: 'Messages', onPress: () => navigation.navigate('Conversations') },
    { icon: 'star-outline', label: 'My Reviews', onPress: () => Alert.alert('Coming Soon', 'Reviews section coming soon!') },
    { icon: 'shield-checkmark-outline', label: 'Privacy & Security', onPress: () => Alert.alert('Coming Soon', 'Privacy settings coming soon!') },
    { icon: 'help-circle-outline', label: 'Help & Support', onPress: () => Alert.alert('Support', 'Email: support@smarttour.lk') },
    { icon: 'information-circle-outline', label: 'About App', onPress: () => Alert.alert('SmartTour v1.0', 'Smart Tourism Guide for Sri Lanka\nBuilt with React Native & Node.js') },
  ];

  const roleColor = user?.role === 'guide' ? COLORS.accent : user?.role === 'admin' ? COLORS.gold : COLORS.primary;
  const roleLabel = user?.role === 'guide' ? '🧭 Tour Guide' : user?.role === 'admin' ? '⚙️ Admin' : '🎒 Tourist';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={[styles.bigAvatar, { backgroundColor: roleColor }]}>
            <Text style={styles.bigAvatarText}>{(user?.name || 'U').charAt(0)}</Text>
          </View>
          <Text style={styles.profileName}>{user?.name || 'User'}</Text>
          <Text style={styles.profileEmail}>{user?.email}</Text>
          <View style={[styles.roleBadge, { backgroundColor: roleColor + '22', borderColor: roleColor }]}>
            <Text style={[styles.roleText, { color: roleColor }]}>{roleLabel}</Text>
          </View>
          {user?.phone && (
            <View style={styles.phoneRow}>
              <Ionicons name="call-outline" size={13} color={COLORS.gray} />
              <Text style={styles.phoneText}>{user.phone}</Text>
            </View>
          )}
        </View>

        {/* Stats Row (for guides) */}
        {user?.role === 'guide' && (
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Tours Done</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>4.5</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Reviews</Text>
            </View>
          </View>
        )}

        {/* Preferences (for tourists) */}
        {user?.role === 'tourist' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎯 Travel Preferences</Text>
            <Text style={styles.sectionSub}>Used for personalized recommendations</Text>
            <View style={styles.prefsGrid}>
              {PREFERENCES.map(p => (
                <TouchableOpacity
                  key={p.id}
                  style={[styles.prefChip, preferences.includes(p.id) && styles.prefChipActive]}
                  onPress={() => togglePref(p.id)}
                >
                  <Text style={styles.prefIcon}>{p.icon}</Text>
                  <Text style={[styles.prefLabel, preferences.includes(p.id) && styles.prefLabelActive]}>{p.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚙️ Settings</Text>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="notifications-outline" size={20} color={COLORS.primary} />
              <Text style={styles.settingLabel}>Push Notifications</Text>
            </View>
            <Switch value={notifications} onValueChange={setNotifications} trackColor={{ true: COLORS.primary }} />
          </View>
        </View>

        {/* Menu */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Menu</Text>
          {menuItems.map((item, i) => (
            <TouchableOpacity key={i} style={styles.menuRow} onPress={item.onPress}>
              <View style={styles.menuLeft}>
                <View style={styles.menuIconBox}>
                  <Ionicons name={item.icon} size={18} color={COLORS.primary} />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={COLORS.gray} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={COLORS.danger} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  profileHeader: { alignItems: 'center', paddingTop: 20, paddingBottom: 24, backgroundColor: COLORS.white, marginBottom: 8 },
  bigAvatar: { width: 90, height: 90, borderRadius: 45, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  bigAvatarText: { fontSize: 36, fontWeight: '900', color: COLORS.white },
  profileName: { fontSize: 22, fontWeight: '900', color: COLORS.text },
  profileEmail: { fontSize: 14, color: COLORS.gray, marginTop: 4 },
  roleBadge: { marginTop: 8, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 5, borderWidth: 1 },
  roleText: { fontSize: 13, fontWeight: '700' },
  phoneRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 },
  phoneText: { fontSize: 13, color: COLORS.gray },
  statsRow: { flexDirection: 'row', backgroundColor: COLORS.white, marginHorizontal: 16, marginVertical: 8, borderRadius: 18, padding: 16, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  statBox: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '900', color: COLORS.text },
  statLabel: { fontSize: 11, color: COLORS.gray, marginTop: 2 },
  section: { backgroundColor: COLORS.white, marginHorizontal: 16, marginVertical: 8, borderRadius: 18, padding: 16, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: COLORS.text, marginBottom: 4 },
  sectionSub: { fontSize: 12, color: COLORS.gray, marginBottom: 14 },
  prefsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  prefChip: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7, backgroundColor: COLORS.bg, borderWidth: 1.5, borderColor: '#DDE8F0' },
  prefChipActive: { backgroundColor: '#EFF7FF', borderColor: COLORS.primary },
  prefIcon: { fontSize: 14 },
  prefLabel: { fontSize: 12, color: COLORS.gray, fontWeight: '600' },
  prefLabelActive: { color: COLORS.primary },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  settingLabel: { fontSize: 15, color: COLORS.text },
  menuRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuIconBox: { width: 36, height: 36, backgroundColor: '#EFF7FF', borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  menuLabel: { fontSize: 15, color: COLORS.text },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginHorizontal: 16, marginTop: 8, backgroundColor: '#FFF0F0', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#FFD0D0' },
  logoutText: { fontSize: 16, color: COLORS.danger, fontWeight: '700' },
});
