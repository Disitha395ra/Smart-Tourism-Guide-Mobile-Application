import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, Alert, TextInput, Modal, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const COLORS = {
  primary: '#0077B6', secondary: '#023E8A', accent: '#00B4D8',
  gold: '#FFD60A', bg: '#F0F8FF', white: '#FFFFFF', text: '#03045E', gray: '#6C757D', green: '#2D9E2D',
};

export default function GuideDetailScreen({ route, navigation }) {
  const { guide } = route.params;
  const { user } = useAuth();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const [duration, setDuration] = useState('4');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const guideName = guide.userId?.name || 'Guide';
  const totalPrice = (guide.hourlyRate || 0) * (parseInt(duration) || 0);

  const handleBook = async () => {
    if (!bookingDate || !duration) {
      return Alert.alert('Missing Info', 'Please enter date and duration.');
    }
    if (user.role !== 'tourist') {
      return Alert.alert('Not Allowed', 'Only tourists can make bookings.');
    }
    setLoading(true);
    try {
      await api.post('/api/bookings', {
        guideId: guide._id,
        date: bookingDate,
        durationHours: parseInt(duration),
        notes,
      });
      setShowBookingModal(false);
      Alert.alert('Booking Sent! ✅', 'Your booking request has been sent to the guide. You will be notified once they confirm.');
    } catch (err) {
      Alert.alert('Error', err.response?.data?.error || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  const statItems = [
    { icon: 'star', value: guide.rating || '4.5', label: 'Rating' },
    { icon: 'people', value: guide.totalReviews || 0, label: 'Reviews' },
    { icon: 'briefcase', value: `${guide.experience || 0}yr`, label: 'Experience' },
    { icon: 'checkmark-circle', value: guide.completedTours || 0, label: 'Tours' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Hero */}
        <View style={styles.hero}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color={COLORS.white} />
          </TouchableOpacity>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{guideName.charAt(0)}</Text>
            </View>
            {guide.isVerified && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={20} color={COLORS.green} />
              </View>
            )}
          </View>
          <Text style={styles.guideName}>{guideName}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location" size={14} color="rgba(255,255,255,0.8)" />
            <Text style={styles.guideLocation}>{guide.location?.city || 'Sri Lanka'}</Text>
          </View>
          {guide.isVerified && (
            <View style={styles.verifiedPill}>
              <Text style={styles.verifiedPillText}>✓ Verified Guide</Text>
            </View>
          )}
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {statItems.map((s, i) => (
            <View key={i} style={styles.statBox}>
              <Ionicons name={s.icon} size={20} color={COLORS.primary} />
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.content}>
          {/* About */}
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.bio}>{guide.bio || 'Experienced local tour guide passionate about showing you the best of Sri Lanka.'}</Text>

          {/* Languages */}
          <Text style={styles.sectionTitle}>Languages</Text>
          <View style={styles.tagsRow}>
            {(guide.languages || ['English', 'Sinhala']).map((l, i) => (
              <View key={i} style={styles.tag}>
                <Ionicons name="language-outline" size={12} color={COLORS.primary} />
                <Text style={styles.tagText}>{l}</Text>
              </View>
            ))}
          </View>

          {/* Specializations */}
          {guide.specializations?.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Specializations</Text>
              <View style={styles.tagsRow}>
                {guide.specializations.map((s, i) => (
                  <View key={i} style={[styles.tag, { backgroundColor: '#E8F5E9', borderColor: '#2D9E2D' }]}>
                    <Text style={[styles.tagText, { color: '#2D9E2D' }]}>{s}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {/* Trust Score */}
          <Text style={styles.sectionTitle}>Trust Score</Text>
          <View style={styles.trustContainer}>
            <View style={styles.trustBar}>
              <View style={[styles.trustFill, { width: `${guide.trustScore || 50}%` }]} />
            </View>
            <Text style={styles.trustScore}>{guide.trustScore || 50}/100</Text>
          </View>
          <Text style={styles.trustNote}>
            {guide.trustScore >= 80 ? '🌟 Highly trusted guide' : guide.trustScore >= 60 ? '✅ Trusted guide' : '🔍 Building trust score'}
          </Text>
        </View>
      </ScrollView>

      {/* Booking Footer */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.rateLabel}>Hourly Rate</Text>
          <Text style={styles.rate}>LKR {guide.hourlyRate || 0}/hr</Text>
        </View>
        <View style={styles.footerBtns}>
          <TouchableOpacity
            style={styles.chatBtn}
            onPress={() => navigation.navigate('Chat', { receiverId: guide.userId?._id || guide.userId, receiverName: guideName })}
          >
            <Ionicons name="chatbubble-ellipses" size={20} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bookBtn}
            onPress={() => {
              if (!user || user.role !== 'tourist') {
                Alert.alert('Tourists Only', 'Only tourists can book guides. Please log in as a tourist.');
              } else {
                setShowBookingModal(true);
              }
            }}
          >
            <Text style={styles.bookBtnText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Booking Modal */}
      <Modal visible={showBookingModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Book {guideName}</Text>
            <Text style={styles.modalSub}>Fill in the details for your tour</Text>

            <Text style={styles.label}>Tour Date (YYYY-MM-DD)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 2025-12-25"
              value={bookingDate}
              onChangeText={setBookingDate}
              placeholderTextColor={COLORS.gray}
            />

            <Text style={styles.label}>Duration (hours)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 4"
              value={duration}
              onChangeText={setDuration}
              keyboardType="numeric"
              placeholderTextColor={COLORS.gray}
            />

            <Text style={styles.label}>Notes (optional)</Text>
            <TextInput
              style={[styles.input, { height: 70 }]}
              placeholder="Special requests, pickup location..."
              value={notes}
              onChangeText={setNotes}
              multiline
              placeholderTextColor={COLORS.gray}
            />

            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Total Price:</Text>
              <Text style={styles.priceValue}>LKR {totalPrice.toLocaleString()}</Text>
            </View>

            <TouchableOpacity style={styles.confirmBtn} onPress={handleBook} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.confirmBtnText}>Confirm Booking</Text>}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowBookingModal(false)} style={styles.cancelBtn}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  hero: { backgroundColor: COLORS.primary, paddingTop: 50, paddingBottom: 30, alignItems: 'center' },
  backBtn: { position: 'absolute', top: 16, left: 16, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, padding: 8 },
  avatarContainer: { position: 'relative', marginBottom: 12 },
  avatar: { width: 90, height: 90, borderRadius: 45, backgroundColor: COLORS.accent, justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: COLORS.white },
  avatarText: { fontSize: 36, fontWeight: '900', color: COLORS.white },
  verifiedBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: COLORS.white, borderRadius: 12, padding: 2 },
  guideName: { fontSize: 24, fontWeight: '900', color: COLORS.white },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  guideLocation: { color: 'rgba(255,255,255,0.8)', fontSize: 13 },
  verifiedPill: { marginTop: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 4 },
  verifiedPillText: { color: COLORS.white, fontSize: 12, fontWeight: '700' },
  statsRow: { flexDirection: 'row', backgroundColor: COLORS.white, marginHorizontal: 16, marginTop: -20, borderRadius: 18, padding: 16, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  statBox: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 16, fontWeight: '800', color: COLORS.text, marginTop: 4 },
  statLabel: { fontSize: 10, color: COLORS.gray, marginTop: 2 },
  content: { padding: 16 },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: COLORS.text, marginTop: 16, marginBottom: 8 },
  bio: { fontSize: 14, color: COLORS.gray, lineHeight: 22 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EFF7FF', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5, gap: 4, borderWidth: 1, borderColor: '#DDEEFF' },
  tagText: { fontSize: 12, color: COLORS.primary, fontWeight: '600' },
  trustContainer: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  trustBar: { flex: 1, height: 8, backgroundColor: '#E0E0E0', borderRadius: 4, overflow: 'hidden' },
  trustFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 4 },
  trustScore: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  trustNote: { fontSize: 12, color: COLORS.gray, marginTop: 6 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.white, padding: 16, borderTopWidth: 1, borderTopColor: '#EEE' },
  rateLabel: { fontSize: 11, color: COLORS.gray },
  rate: { fontSize: 20, fontWeight: '900', color: COLORS.text },
  footerBtns: { flexDirection: 'row', gap: 10 },
  chatBtn: { width: 46, height: 46, backgroundColor: '#EFF7FF', borderRadius: 14, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.primary },
  bookBtn: { backgroundColor: COLORS.primary, borderRadius: 14, paddingHorizontal: 24, paddingVertical: 13 },
  bookBtnText: { color: COLORS.white, fontSize: 15, fontWeight: '800' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modal: { backgroundColor: COLORS.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  modalTitle: { fontSize: 22, fontWeight: '900', color: COLORS.text, marginBottom: 4 },
  modalSub: { fontSize: 13, color: COLORS.gray, marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: COLORS.bg, borderRadius: 12, padding: 14, fontSize: 15, color: COLORS.text, borderWidth: 1, borderColor: '#DDE8F0' },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, backgroundColor: '#EFF7FF', borderRadius: 12, padding: 14 },
  priceLabel: { fontSize: 14, color: COLORS.gray, fontWeight: '600' },
  priceValue: { fontSize: 20, fontWeight: '900', color: COLORS.primary },
  confirmBtn: { backgroundColor: COLORS.primary, borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 16 },
  confirmBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '800' },
  cancelBtn: { alignItems: 'center', marginTop: 12, padding: 10 },
  cancelBtnText: { color: COLORS.gray, fontSize: 14 },
});
