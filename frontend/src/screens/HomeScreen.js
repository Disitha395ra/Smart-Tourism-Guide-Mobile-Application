import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
// Note: Normally we'd use @expo/vector-icons but we'll mock the icons if not installed
// import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  primary: '#00B4D8',
  secondary: '#03045E',
  background: '#F8F9FA',
  text: '#212529',
  card: '#FFFFFF',
};

export default function HomeScreen() {
  const [recommendations, setRecommendations] = useState([]);

  const dummyPlaces = [
    { id: '1', name: 'Sigiriya Rock Fortress', location: 'Dambulla', image: 'https://images.unsplash.com/photo-1588598198321-179be400a400', rating: 4.9 },
    { id: '2', name: 'Temple of the Tooth', location: 'Kandy', image: 'https://images.unsplash.com/photo-1625739958742-1e967a57eb0f', rating: 4.8 },
  ];

  useEffect(() => {
    setRecommendations(dummyPlaces);
  }, []);

  const renderPlaceCard = ({ item }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.8}>
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardLocation}>{item.location}</Text>
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingText}>★ {item.rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Ayubowan, Traveler! 👋</Text>
          <Text style={styles.subGreeting}>Where to next?</Text>
        </View>
        <TouchableOpacity style={styles.profileBtn}>
          <Text style={{fontSize: 30}}>👤</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput placeholder="Search guides, places..." style={styles.searchInput} placeholderTextColor="#6C757D" />
      </View>

      <Text style={styles.sectionTitle}>Recommended for You</Text>
      <FlatList
        data={recommendations}
        renderItem={renderPlaceCard}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center', marginTop: 40 },
  greeting: { fontSize: 24, fontWeight: 'bold', color: COLORS.secondary },
  subGreeting: { fontSize: 16, color: '#6C757D', marginTop: 4 },
  searchContainer: { flexDirection: 'row', backgroundColor: '#FFF', marginHorizontal: 20, borderRadius: 12, padding: 12, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  searchInput: { flex: 1, fontSize: 16 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: COLORS.secondary, marginLeft: 20, marginTop: 25, marginBottom: 15 },
  listContainer: { paddingLeft: 20 },
  card: { backgroundColor: COLORS.card, borderRadius: 16, marginRight: 15, width: 220, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 },
  cardImage: { width: '100%', height: 140 },
  cardContent: { padding: 12 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: COLORS.text, marginBottom: 4 },
  cardLocation: { fontSize: 12, color: '#6C757D', marginBottom: 8 },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF9C4', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8, alignSelf: 'flex-start' },
  ratingText: { fontSize: 12, fontWeight: 'bold', marginLeft: 4, color: '#F57F17' },
  profileBtn: { justifyContent: 'center', alignItems: 'center'}
});
