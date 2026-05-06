import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  SafeAreaView, ActivityIndicator, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const COLORS = {
  primary: '#0077B6', secondary: '#023E8A', accent: '#00B4D8',
  gold: '#FFD60A', bg: '#F0F8FF', white: '#FFFFFF', text: '#03045E', gray: '#6C757D',
};

const STATUS_STYLES = {
  pending: { bg: '#FFF8E1', text: '#F57F17', icon: 'time-outline' },
  confirmed: { bg: '#E8F5E9', text: '#2D9E2D', icon: 'checkmark-circle-outline' },
  completed: { bg: '#E3F2FD', text: '#0077B6', icon: 'star-outline' },
  cancelled: { bg: '#FFEBEE', text: '#C62828', icon: 'close-circle-outline' },
};

export default function BookingsScreen({ navigation }) {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const endpoint = user.role === 'guide' ? '/api/bookings/guide' : '/api/bookings/my';
      const { data } = await api.get(endpoint);
      setBookings(data);
    } catch (err) {
      Alert.alert('Error', 'Could not load bookings. Make sure the server is running.');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await api.put(`/api/bookings/${bookingId}/status`, { status: newStatus });
      setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status: newStatus } : b));
      Alert.alert('Updated ✅', `Booking ${newStatus}`);
    } catch {
      Alert.alert('Error', 'Failed to update status');
    }
  };

  const filteredBookings = bookings.filter(b => {
    if (activeTab === 'upcoming') return ['pending', 'confirmed'].includes(b.status);
    if (activeTab === 'past') return ['completed', 'cancelled'].includes(b.status);
    return true;
  });

  const renderBooking = ({ item }) => {
    const statusStyle = STATUS_STYLES[item.status] || STATUS_STYLES.pending;
    const guideName = item.guideId?.userId?.name || 'Guide';
    const touristName = item.touristId?.name || 'Tourist';
    const displayName = user.role === 'guide' ? touristName : guideName;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.avatarSmall}>
            <Text style={styles.avatarSmallText}>{displayName.charAt(0)}</Text>
          </View>
          <View style={styles.cardHeaderInfo}>
            <Text style={styles.bookingName}>{displayName}</Text>
            <Text style={styles.bookingDate}>
              {new Date(item.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
            <Ionicons name={statusStyle.icon} size={12} color={statusStyle.text} />
            <Text style={[styles.statusText, { color: statusStyle.text }]}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={14} color={COLORS.gray} />
            <Text style={styles.detailText}>{item.durationHours} hours</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="cash-outline" size={14} color={COLORS.gray} />
            <Text style={styles.detailText}>LKR {item.totalPrice?.toLocaleString()}</Text>
          </View>
        </View>

        {item.notes ? (
          <Text style={styles.notes}>{item.notes}</Text>
        ) : null}

        {/* Guide actions: confirm or cancel */}
        {user.role === 'guide' && item.status === 'pending' && (
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: '#E8F5E9' }]}
              onPress={() => handleStatusUpdate(item._id, 'confirmed')}
            >
              <Ionicons name="checkmark" size={16} color="#2D9E2D" />
              <Text style={[styles.actionBtnText, { color: '#2D9E2D' }]}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: '#FFEBEE' }]}
              onPress={() => handleStatusUpdate(item._id, 'cancelled')}
            >
              <Ionicons name="close" size={16} color="#C62828" />
              <Text style={[styles.actionBtnText, { color: '#C62828' }]}>Decline</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Tourist: mark as completed */}
        {user.role === 'tourist' && item.status === 'confirmed' && (
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: '#E3F2FD', alignSelf: 'flex-end' }]}
            onPress={() => handleStatusUpdate(item._id, 'completed')}
          >
            <Ionicons name="star-outline" size={16} color={COLORS.primary} />
            <Text style={[styles.actionBtnText, { color: COLORS.primary }]}>Mark Completed</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.pageTitle}>{user.role === 'guide' ? 'Booking Requests' : 'My Bookings'} 📅</Text>
      </View>

      <View style={styles.tabBar}>
        {['upcoming', 'past', 'all'].map(tab => (
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
        <ActivityIndicator style={{ marginTop: 40 }} size="large" color={COLORS.primary} />
      ) : filteredBookings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📅</Text>
          <Text style={styles.emptyTitle}>No bookings here</Text>
          <Text style={styles.emptyText}>
            {user.role === 'tourist'
              ? 'Browse our guides and make your first booking!'
              : 'Booking requests will appear here once tourists book you.'}
          </Text>
          {user.role === 'tourist' && (
            <TouchableOpacity
              style={styles.browseBtn}
              onPress={() => navigation.navigate('Guides')}
            >
              <Text style={styles.browseBtnText}>Browse Guides →</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredBookings}
          renderItem={renderBooking}
          keyExtractor={(item, i) => item._id || String(i)}
          contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  topBar: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8 },
  pageTitle: { fontSize: 22, fontWeight: '800', color: COLORS.text },
  tabBar: { flexDirection: 'row', backgroundColor: COLORS.white, marginHorizontal: 16, borderRadius: 14, padding: 4, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, elevation: 2, marginBottom: 12 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  tabActive: { backgroundColor: COLORS.primary },
  tabText: { fontSize: 13, color: COLORS.gray, fontWeight: '600' },
  tabTextActive: { color: COLORS.white, fontWeight: '700' },
  card: { backgroundColor: COLORS.white, borderRadius: 18, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 8, elevation: 3 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatarSmall: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.accent, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarSmallText: { fontSize: 18, fontWeight: '800', color: COLORS.white },
  cardHeaderInfo: { flex: 1 },
  bookingName: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  bookingDate: { fontSize: 12, color: COLORS.gray, marginTop: 2 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4 },
  statusText: { fontSize: 11, fontWeight: '700', textTransform: 'capitalize' },
  detailsRow: { flexDirection: 'row', gap: 20, marginBottom: 10 },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  detailText: { fontSize: 13, color: COLORS.gray },
  notes: { fontSize: 12, color: COLORS.gray, backgroundColor: COLORS.bg, borderRadius: 8, padding: 8, marginBottom: 10, fontStyle: 'italic' },
  actionsRow: { flexDirection: 'row', gap: 10 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: 12, paddingVertical: 10 },
  actionBtnText: { fontSize: 13, fontWeight: '700' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyIcon: { fontSize: 60, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: COLORS.text, marginBottom: 8 },
  emptyText: { fontSize: 14, color: COLORS.gray, textAlign: 'center', lineHeight: 22 },
  browseBtn: { marginTop: 20, backgroundColor: COLORS.primary, borderRadius: 14, paddingHorizontal: 24, paddingVertical: 14 },
  browseBtnText: { color: COLORS.white, fontSize: 15, fontWeight: '800' },
});
