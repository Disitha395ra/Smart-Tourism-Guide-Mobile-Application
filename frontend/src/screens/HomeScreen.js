import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, Image, TouchableOpacity,
  SafeAreaView, TextInput, ScrollView, ActivityIndicator, RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const COLORS = {
  primary: '#0077B6', secondary: '#023E8A', accent: '#00B4D8',
  gold: '#FFD60A', bg: '#F0F8FF', white: '#FFFFFF', text: '#03045E', gray: '#6C757D',
};

const CATEGORIES = [
  { id: 'all', label: 'All', icon: '🌍' },
  { id: 'history', label: 'History', icon: '🏛️' },
  { id: 'beach', label: 'Beach', icon: '🏖️' },
  { id: 'wildlife', label: 'Wildlife', icon: '🐘' },
  { id: 'religious', label: 'Temple', icon: '🛕' },
  { id: 'nature', label: 'Nature', icon: '🌿' },
  { id: 'adventure', label: 'Adventure', icon: '🧗' },
];

export default function HomeScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [attractions, setAttractions] = useState([]);
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    try {
      const [attRes, guideRes] = await Promise.all([
        api.get('/api/attractions'),
        api.get('/api/guides'),
      ]);
      setAttractions(attRes.data);
      setGuides(guideRes.data);
    } catch (err) {
      // Use offline fallback data
      setAttractions(FALLBACK_ATTRACTIONS);
      setGuides([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filteredAttractions = attractions.filter(a => {
    const matchCat = selectedCategory === 'all' || a.category === selectedCategory;
    const matchSearch = a.name?.toLowerCase().includes(search.toLowerCase());
    return matchCat && (search === '' || matchSearch);
  });

  const renderAttractionCard = ({ item }) => (
    <TouchableOpacity
      style={styles.attractionCard}
      activeOpacity={0.85}
      onPress={() => navigation.navigate('AttractionDetail', { attraction: item })}
    >
      <Image source={{ uri: item.images?.[0] || item.image }} style={styles.attractionImage} />
      <View style={styles.ratingBadge}>
        <Text style={styles.ratingText}>★ {item.rating}</Text>
      </View>
      <View style={styles.attractionInfo}>
        <Text style={styles.attractionName} numberOfLines={1}>{item.name}</Text>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={12} color={COLORS.gray} />
          <Text style={styles.locationText}>{item.location?.city || item.location}</Text>
        </View>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryBadgeText}>{item.category}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderGuideCard = ({ item }) => (
    <TouchableOpacity
      style={styles.guideCard}
      activeOpacity={0.85}
      onPress={() => navigation.navigate('GuideDetail', { guide: item })}
    >
      <View style={styles.guideAvatar}>
        <Text style={styles.guideAvatarText}>
          {(item.userId?.name || 'G').charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.guideInfo}>
        <Text style={styles.guideName} numberOfLines={1}>{item.userId?.name || 'Guide'}</Text>
        <Text style={styles.guideCity}>{item.location?.city || 'Sri Lanka'}</Text>
        <Text style={styles.guideRate}>LKR {item.hourlyRate}/hr</Text>
      </View>
      <View style={styles.guideRatingBox}>
        <Text style={styles.guideRating}>★ {item.rating || '4.5'}</Text>
        {item.isVerified && <Text style={styles.verifiedBadge}>✓ Verified</Text>}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ color: COLORS.gray, marginTop: 10 }}>Loading attractions...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} colors={[COLORS.primary]} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Ayubowan, {user?.name?.split(' ')[0]}! 👋</Text>
            <Text style={styles.subGreeting}>Where to explore today?</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.profileBtn}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{(user?.name || 'U').charAt(0).toUpperCase()}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color={COLORS.gray} />
          <TextInput
            placeholder="Search attractions, places..."
            style={styles.searchInput}
            placeholderTextColor={COLORS.gray}
            value={search}
            onChangeText={setSearch}
          />
          {search !== '' && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={20} color={COLORS.gray} />
            </TouchableOpacity>
          )}
        </View>

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryRow} contentContainerStyle={{ paddingHorizontal: 16 }}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.catBtn, selectedCategory === cat.id && styles.catBtnActive]}
              onPress={() => setSelectedCategory(cat.id)}
            >
              <Text style={styles.catIcon}>{cat.icon}</Text>
              <Text style={[styles.catLabel, selectedCategory === cat.id && styles.catLabelActive]}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Featured Banner */}
        <View style={styles.bannerContainer}>
          <View style={styles.banner}>
            <Text style={styles.bannerTitle}>🌴 Discover Sri Lanka</Text>
            <Text style={styles.bannerSub}>8 UNESCO sites • 2000+ km of coast</Text>
            <TouchableOpacity style={styles.bannerBtn} onPress={() => navigation.navigate('Explore')}>
              <Text style={styles.bannerBtnText}>Explore All →</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recommended Attractions */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🗺️ Attractions</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Explore')}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={filteredAttractions.slice(0, 6)}
          renderItem={renderAttractionCard}
          keyExtractor={(item, i) => item._id || String(i)}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 8 }}
        />

        {/* Top Guides */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🧭 Top Guides</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Guides')}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.guideList}>
          {guides.slice(0, 4).map((g, i) => (
            <View key={g._id || i}>{renderGuideCard({ item: g })}</View>
          ))}
          {guides.length === 0 && (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>No guides registered yet. Be the first! 🧭</Text>
            </View>
          )}
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const FALLBACK_ATTRACTIONS = [
  { name: 'Sigiriya Rock Fortress', location: { city: 'Dambulla' }, images: ['https://images.unsplash.com/photo-1588598198321-179be400a400?w=800'], rating: 4.9, category: 'history' },
  { name: 'Temple of the Tooth', location: { city: 'Kandy' }, images: ['https://images.unsplash.com/photo-1625739958742-1e967a57eb0f?w=800'], rating: 4.8, category: 'religious' },
  { name: 'Yala National Park', location: { city: 'Tissamaharama' }, images: ['https://images.unsplash.com/photo-1612025890978-c3c7d54e6e78?w=800'], rating: 4.7, category: 'wildlife' },
  { name: 'Galle Fort', location: { city: 'Galle' }, images: ['https://images.unsplash.com/photo-1565967511849-76a60a516170?w=800'], rating: 4.6, category: 'history' },
  { name: 'Nine Arch Bridge', location: { city: 'Ella' }, images: ['https://images.unsplash.com/photo-1568454537842-d933259bb258?w=800'], rating: 4.8, category: 'nature' },
  { name: 'Mirissa Beach', location: { city: 'Mirissa' }, images: ['https://images.unsplash.com/photo-1590377503702-4f5c89be8955?w=800'], rating: 4.5, category: 'beach' },
];

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  greeting: { fontSize: 22, fontWeight: '800', color: COLORS.text },
  subGreeting: { fontSize: 14, color: COLORS.gray, marginTop: 2 },
  profileBtn: { padding: 4 },
  avatarCircle: { width: 42, height: 42, borderRadius: 21, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: COLORS.white, fontSize: 18, fontWeight: '800' },
  searchContainer: { flexDirection: 'row', backgroundColor: COLORS.white, marginHorizontal: 16, marginVertical: 12, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 3, gap: 8 },
  searchInput: { flex: 1, fontSize: 15, color: COLORS.text },
  categoryRow: { marginBottom: 12 },
  catBtn: { alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8, marginRight: 8, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1, minWidth: 70 },
  catBtnActive: { backgroundColor: COLORS.primary },
  catIcon: { fontSize: 18, marginBottom: 2 },
  catLabel: { fontSize: 11, color: COLORS.gray, fontWeight: '600' },
  catLabelActive: { color: COLORS.white },
  bannerContainer: { paddingHorizontal: 16, marginBottom: 16 },
  banner: { backgroundColor: COLORS.secondary, borderRadius: 18, padding: 20 },
  bannerTitle: { color: COLORS.white, fontSize: 20, fontWeight: '800' },
  bannerSub: { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 4, marginBottom: 14 },
  bannerBtn: { backgroundColor: COLORS.gold, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 8, alignSelf: 'flex-start' },
  bannerBtnText: { color: COLORS.secondary, fontWeight: '800', fontSize: 13 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: COLORS.text },
  seeAll: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },
  attractionCard: { width: 200, marginRight: 12, backgroundColor: COLORS.white, borderRadius: 16, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  attractionImage: { width: '100%', height: 130 },
  ratingBadge: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2 },
  ratingText: { color: COLORS.gold, fontSize: 11, fontWeight: '700' },
  attractionInfo: { padding: 10 },
  attractionName: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 6 },
  locationText: { fontSize: 11, color: COLORS.gray },
  categoryBadge: { backgroundColor: '#EFF7FF', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2, alignSelf: 'flex-start' },
  categoryBadgeText: { fontSize: 10, color: COLORS.primary, fontWeight: '600', textTransform: 'capitalize' },
  guideList: { paddingHorizontal: 16, gap: 10 },
  guideCard: { flexDirection: 'row', backgroundColor: COLORS.white, borderRadius: 16, padding: 14, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  guideAvatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: COLORS.accent, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  guideAvatarText: { fontSize: 20, fontWeight: '800', color: COLORS.white },
  guideInfo: { flex: 1 },
  guideName: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  guideCity: { fontSize: 12, color: COLORS.gray, marginTop: 2 },
  guideRate: { fontSize: 13, color: COLORS.primary, fontWeight: '600', marginTop: 4 },
  guideRatingBox: { alignItems: 'flex-end' },
  guideRating: { fontSize: 14, fontWeight: '800', color: '#F57F17' },
  verifiedBadge: { fontSize: 10, color: '#2D9E2D', marginTop: 4, fontWeight: '600' },
  emptyBox: { padding: 20, alignItems: 'center' },
  emptyText: { color: COLORS.gray, fontSize: 14 },
});
