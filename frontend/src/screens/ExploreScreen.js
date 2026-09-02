import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, Image, TouchableOpacity,
  SafeAreaView, TextInput, ScrollView, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../utils/api';

const COLORS = {
  primary: '#0077B6', secondary: '#023E8A', accent: '#00B4D8',
  gold: '#FFD60A', bg: '#F0F8FF', white: '#FFFFFF', text: '#03045E', gray: '#6C757D',
};

const CATEGORIES = [
  { id: 'all', label: 'All' }, { id: 'history', label: 'History' },
  { id: 'beach', label: 'Beach' }, { id: 'wildlife', label: 'Wildlife' },
  { id: 'religious', label: 'Temple' }, { id: 'nature', label: 'Nature' },
  { id: 'adventure', label: 'Adventure' }, { id: 'culture', label: 'Culture' },
];



export default function ExploreScreen({ navigation }) {
  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');

  useEffect(() => {
    fetchAttractions();
  }, []);

  const fetchAttractions = async () => {
    try {
      const { data } = await api.get('/api/attractions');
      setAttractions(data);
    } catch (err) {
      console.log('Error fetching explore data:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = attractions.filter(a => {
    const matchCat = selectedCat === 'all' || a.category === selectedCat;
    const matchSearch = a.name?.toLowerCase().includes(search.toLowerCase()) ||
      (a.location?.city || '').toLowerCase().includes(search.toLowerCase());
    return matchCat && (search === '' || matchSearch);
  });

  const renderCard = ({ item, index }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.88}
      onPress={() => navigation.navigate('AttractionDetail', { attraction: item })}
    >
      <Image source={{ uri: item.images?.[0] || item.image }} style={styles.cardImage} />
      <View style={styles.ratingBadge}>
        <Text style={styles.ratingText}>★ {item.rating}</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
        <View style={styles.locationRow}>
          <Ionicons name="location" size={12} color={COLORS.primary} />
          <Text style={styles.locationText}>{item.location?.city}</Text>
          <View style={styles.catTag}>
            <Text style={styles.catTagText}>{item.category}</Text>
          </View>
        </View>
        <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.pageTitle}>Explore Sri Lanka 🌴</Text>
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

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catRow} contentContainerStyle={{ paddingHorizontal: 16 }}>
        {CATEGORIES.map(c => (
          <TouchableOpacity
            key={c.id}
            style={[styles.catBtn, selectedCat === c.id && styles.catBtnActive]}
            onPress={() => setSelectedCat(c.id)}
          >
            <Text style={[styles.catLabel, selectedCat === c.id && styles.catLabelActive]}>{c.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} size="large" color={COLORS.primary} />
      ) : (
        <>
          <Text style={styles.resultCount}>{filtered.length} places found</Text>
          <FlatList
            data={filtered}
            renderItem={renderCard}
            keyExtractor={(item, i) => item._id || String(i)}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}
            showsVerticalScrollIndicator={false}
          />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  topBar: { paddingHorizontal: 16, paddingVertical: 14 },
  pageTitle: { fontSize: 22, fontWeight: '800', color: COLORS.text },
  searchBox: { flexDirection: 'row', backgroundColor: COLORS.white, marginHorizontal: 16, marginBottom: 12, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 3, gap: 8 },
  searchInput: { flex: 1, fontSize: 15, color: COLORS.text },
  catRow: { marginBottom: 10 },
  catBtn: { backgroundColor: COLORS.white, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 7, marginRight: 8, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  catBtnActive: { backgroundColor: COLORS.primary },
  catLabel: { fontSize: 13, color: COLORS.gray, fontWeight: '600' },
  catLabelActive: { color: COLORS.white },
  resultCount: { paddingHorizontal: 16, marginBottom: 10, fontSize: 13, color: COLORS.gray },
  card: { backgroundColor: COLORS.white, borderRadius: 18, marginBottom: 14, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, elevation: 3 },
  cardImage: { width: '100%', height: 180 },
  ratingBadge: { position: 'absolute', top: 12, right: 12, backgroundColor: 'rgba(0,0,0,0.65)', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4 },
  ratingText: { color: COLORS.gold, fontSize: 12, fontWeight: '800' },
  cardContent: { padding: 14 },
  cardName: { fontSize: 17, fontWeight: '800', color: COLORS.text, marginBottom: 6 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 },
  locationText: { fontSize: 13, color: COLORS.gray, flex: 1 },
  catTag: { backgroundColor: '#EFF7FF', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 },
  catTagText: { fontSize: 11, color: COLORS.primary, fontWeight: '600', textTransform: 'capitalize' },
  cardDesc: { fontSize: 13, color: COLORS.gray, lineHeight: 18 },
});
