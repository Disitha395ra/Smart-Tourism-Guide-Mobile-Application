import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  SafeAreaView, TextInput, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../utils/api';

const COLORS = {
  primary: '#0077B6', secondary: '#023E8A', accent: '#00B4D8',
  gold: '#FFD60A', bg: '#F0F8FF', white: '#FFFFFF', text: '#03045E', gray: '#6C757D',
};

const LANGUAGES = ['All', 'English', 'Sinhala', 'Tamil', 'French', 'German', 'Chinese'];

export default function GuidesScreen({ navigation }) {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedLang, setSelectedLang] = useState('All');

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    try {
      const { data } = await api.get('/api/guides');
      setGuides(data);
    } catch {
      setGuides([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = guides.filter(g => {
    const name = g.userId?.name || '';
    const matchSearch = name.toLowerCase().includes(search.toLowerCase()) ||
      (g.location?.city || '').toLowerCase().includes(search.toLowerCase());
    const matchLang = selectedLang === 'All' || (g.languages || []).includes(selectedLang);
    return (search === '' || matchSearch) && matchLang;
  });

  const renderGuide = ({ item }) => (
    <TouchableOpacity
      style={styles.guideCard}
      onPress={() => navigation.navigate('GuideDetail', { guide: item })}
      activeOpacity={0.88}
    >
      <View style={styles.cardTop}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{(item.userId?.name || 'G').charAt(0)}</Text>
        </View>
        <View style={styles.guideInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.guideName}>{item.userId?.name || 'Guide'}</Text>
            {item.isVerified && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={14} color="#2D9E2D" />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            )}
          </View>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={12} color={COLORS.gray} />
            <Text style={styles.guideCity}>{item.location?.city || 'Sri Lanka'}</Text>
          </View>
          <View style={styles.statsRow}>
            <Text style={styles.rating}>★ {item.rating || '4.5'}</Text>
            <Text style={styles.reviews}>({item.totalReviews || 0} reviews)</Text>
            <Text style={styles.experience}>• {item.experience || 0} yrs exp</Text>
          </View>
        </View>
      </View>

      {/* Bio snippet */}
      {item.bio ? (
        <Text style={styles.bio} numberOfLines={2}>{item.bio}</Text>
      ) : null}

      {/* Languages */}
      <View style={styles.langRow}>
        <Ionicons name="language-outline" size={14} color={COLORS.gray} />
        <Text style={styles.langText}>{(item.languages || ['English']).join(' • ')}</Text>
      </View>

      {/* Specializations */}
      {item.specializations?.length > 0 && (
        <View style={styles.specRow}>
          {item.specializations.slice(0, 3).map((s, i) => (
            <View key={i} style={styles.specTag}>
              <Text style={styles.specTagText}>{s}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.cardBottom}>
        <View>
          <Text style={styles.rateLabel}>Hourly Rate</Text>
          <Text style={styles.rate}>LKR {item.hourlyRate || 0}</Text>
        </View>
        <TouchableOpacity
          style={styles.bookBtn}
          onPress={() => navigation.navigate('GuideDetail', { guide: item })}
        >
          <Text style={styles.bookBtnText}>View Profile</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.pageTitle}>Tour Guides 🧭</Text>
        <Text style={styles.pageSubtitle}>Find your perfect guide</Text>
      </View>

      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color={COLORS.gray} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or city..."
          placeholderTextColor={COLORS.gray}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Language filter */}
      <FlatList
        data={LANGUAGES}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item}
        style={styles.langFilter}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.langBtn, selectedLang === item && styles.langBtnActive]}
            onPress={() => setSelectedLang(item)}
          >
            <Text style={[styles.langBtnText, selectedLang === item && styles.langBtnTextActive]}>{item}</Text>
          </TouchableOpacity>
        )}
      />

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} size="large" color={COLORS.primary} />
      ) : filtered.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🧭</Text>
          <Text style={styles.emptyTitle}>No guides found</Text>
          <Text style={styles.emptyText}>
            {search ? `No results for "${search}"` : 'No guides have registered yet.'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          renderItem={renderGuide}
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
  pageSubtitle: { fontSize: 13, color: COLORS.gray, marginTop: 2 },
  searchBox: { flexDirection: 'row', backgroundColor: COLORS.white, marginHorizontal: 16, marginBottom: 12, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 3, gap: 8 },
  searchInput: { flex: 1, fontSize: 15, color: COLORS.text },
  langFilter: { marginBottom: 12 },
  langBtn: { backgroundColor: COLORS.white, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, marginRight: 8, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  langBtnActive: { backgroundColor: COLORS.primary },
  langBtnText: { fontSize: 12, color: COLORS.gray, fontWeight: '600' },
  langBtnTextActive: { color: COLORS.white },
  guideCard: { backgroundColor: COLORS.white, borderRadius: 18, padding: 16, marginBottom: 14, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, elevation: 3 },
  cardTop: { flexDirection: 'row', gap: 14, marginBottom: 10 },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.accent, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 22, fontWeight: '900', color: COLORS.white },
  guideInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 3 },
  guideName: { fontSize: 16, fontWeight: '800', color: COLORS.text },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: '#E8F5E9', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2 },
  verifiedText: { fontSize: 10, color: '#2D9E2D', fontWeight: '600' },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 4 },
  guideCity: { fontSize: 12, color: COLORS.gray },
  statsRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  rating: { fontSize: 13, color: '#F57F17', fontWeight: '700' },
  reviews: { fontSize: 11, color: COLORS.gray },
  experience: { fontSize: 11, color: COLORS.gray },
  bio: { fontSize: 13, color: COLORS.gray, lineHeight: 18, marginBottom: 8 },
  langRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  langText: { fontSize: 12, color: COLORS.gray },
  specRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  specTag: { backgroundColor: '#EFF7FF', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 3 },
  specTagText: { fontSize: 11, color: COLORS.primary, fontWeight: '600', textTransform: 'capitalize' },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F0F0F0', paddingTop: 12 },
  rateLabel: { fontSize: 11, color: COLORS.gray },
  rate: { fontSize: 16, fontWeight: '800', color: COLORS.text },
  bookBtn: { backgroundColor: COLORS.primary, borderRadius: 12, paddingHorizontal: 18, paddingVertical: 10 },
  bookBtnText: { color: COLORS.white, fontSize: 13, fontWeight: '700' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyIcon: { fontSize: 60, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: COLORS.text, marginBottom: 8 },
  emptyText: { fontSize: 14, color: COLORS.gray, textAlign: 'center' },
});
