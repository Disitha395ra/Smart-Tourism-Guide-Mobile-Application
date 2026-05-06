import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const COLORS = {
  primary: '#0077B6', bg: '#F0F8FF', white: '#FFFFFF', text: '#03045E', gray: '#6C757D',
};

export default function ConversationsScreen({ navigation }) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const { data } = await api.get('/api/chat/conversations');
      setConversations(data);
    } catch {
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.convoItem}
      onPress={() => navigation.navigate('Chat', {
        receiverId: item.user._id,
        receiverName: item.user.name
      })}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.user.name?.charAt(0) || 'U'}</Text>
      </View>
      <View style={styles.convoInfo}>
        <Text style={styles.convoName}>{item.user.name}</Text>
        <Text style={styles.lastMsg} numberOfLines={1}>{item.lastMessage}</Text>
      </View>
      <Text style={styles.lastTime}>
        {new Date(item.lastTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Messages 💬</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} size="large" color={COLORS.primary} />
      ) : conversations.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>💬</Text>
          <Text style={styles.emptyTitle}>No messages yet</Text>
          <Text style={styles.emptyText}>Chat with a guide to get started!</Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
          renderItem={renderItem}
          keyExtractor={(item, i) => item.user._id || String(i)}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: COLORS.white },
  pageTitle: { fontSize: 18, fontWeight: '800', color: COLORS.text },
  convoItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', gap: 12 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#00B4D8', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 20, fontWeight: '800', color: COLORS.white },
  convoInfo: { flex: 1 },
  convoName: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  lastMsg: { fontSize: 13, color: COLORS.gray, marginTop: 2 },
  lastTime: { fontSize: 11, color: COLORS.gray },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyIcon: { fontSize: 60, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: COLORS.text, marginBottom: 8 },
  emptyText: { fontSize: 14, color: COLORS.gray },
});
