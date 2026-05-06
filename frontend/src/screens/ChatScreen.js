import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity,
  SafeAreaView, KeyboardAvoidingView, Platform, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import io from 'socket.io-client';
import { BASE_URL } from '../utils/api';

const COLORS = {
  primary: '#0077B6', secondary: '#023E8A', accent: '#00B4D8',
  bg: '#F0F8FF', white: '#FFFFFF', text: '#03045E', gray: '#6C757D',
};

export default function ChatScreen({ route, navigation }) {
  const { receiverId, receiverName } = route.params;
  const { user, token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    loadMessages();
    setupSocket();
    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  const setupSocket = () => {
    socketRef.current = io(BASE_URL, { transports: ['websocket'] });
    socketRef.current.emit('join', user.id);
    socketRef.current.on('receive_message', (data) => {
      if (data.senderId === receiverId) {
        setMessages(prev => [...prev, {
          _id: Date.now().toString(),
          senderId: receiverId,
          content: data.content,
          createdAt: data.timestamp || new Date()
        }]);
      }
    });
  };

  const loadMessages = async () => {
    try {
      const { data } = await api.get(`/api/chat/${receiverId}`);
      setMessages(data);
    } catch {
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMsg.trim()) return;
    const content = newMsg.trim();
    setNewMsg('');

    // Optimistic update
    const tempMsg = {
      _id: Date.now().toString(),
      senderId: user.id,
      content,
      createdAt: new Date()
    };
    setMessages(prev => [...prev, tempMsg]);

    // Socket emit for real-time
    socketRef.current?.emit('send_message', {
      senderId: user.id,
      receiverId,
      content
    });

    // Save to DB
    try {
      await api.post('/api/chat/send', { receiverId, content });
    } catch (err) {
      console.log('Message save error:', err.message);
    }
  };

  const isMyMessage = (msg) => msg.senderId === user.id || msg.senderId?._id === user.id;

  const renderMessage = ({ item }) => {
    const mine = isMyMessage(item);
    return (
      <View style={[styles.msgRow, mine ? styles.msgRowRight : styles.msgRowLeft]}>
        <View style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleTheirs]}>
          <Text style={[styles.bubbleText, mine ? styles.bubbleTextMine : styles.bubbleTextTheirs]}>
            {item.content}
          </Text>
          <Text style={[styles.timestamp, mine ? { color: 'rgba(255,255,255,0.7)' } : { color: COLORS.gray }]}>
            {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <View style={styles.headerAvatar}>
            <Text style={styles.headerAvatarText}>{(receiverName || 'U').charAt(0)}</Text>
          </View>
          <View>
            <Text style={styles.headerName}>{receiverName}</Text>
            <Text style={styles.headerStatus}>Online</Text>
          </View>
        </View>
        <Ionicons name="ellipsis-vertical" size={20} color={COLORS.gray} />
      </View>

      {loading ? (
        <ActivityIndicator style={{ flex: 1 }} size="large" color={COLORS.primary} />
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item, i) => item._id || String(i)}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyChat}>
              <Text style={styles.emptyChatIcon}>💬</Text>
              <Text style={styles.emptyChatText}>Start a conversation with {receiverName}!</Text>
            </View>
          }
        />
      )}

      {/* Input */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.textInput}
            placeholder="Type a message..."
            value={newMsg}
            onChangeText={setNewMsg}
            placeholderTextColor={COLORS.gray}
            multiline
            maxLength={500}
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity
            style={[styles.sendBtn, !newMsg.trim() && styles.sendBtnDisabled]}
            onPress={sendMessage}
            disabled={!newMsg.trim()}
          >
            <Ionicons name="send" size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, paddingHorizontal: 16, paddingVertical: 12, gap: 12, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, elevation: 3 },
  headerCenter: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.accent, justifyContent: 'center', alignItems: 'center' },
  headerAvatarText: { fontSize: 16, fontWeight: '800', color: COLORS.white },
  headerName: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  headerStatus: { fontSize: 11, color: '#2D9E2D' },
  messageList: { padding: 16, paddingBottom: 8 },
  msgRow: { marginBottom: 12, flexDirection: 'row' },
  msgRowRight: { justifyContent: 'flex-end' },
  msgRowLeft: { justifyContent: 'flex-start' },
  bubble: { maxWidth: '78%', borderRadius: 18, padding: 12, paddingHorizontal: 16 },
  bubbleMine: { backgroundColor: COLORS.primary, borderBottomRightRadius: 4 },
  bubbleTheirs: { backgroundColor: COLORS.white, borderBottomLeftRadius: 4, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 1 },
  bubbleText: { fontSize: 15, lineHeight: 20 },
  bubbleTextMine: { color: COLORS.white },
  bubbleTextTheirs: { color: COLORS.text },
  timestamp: { fontSize: 10, marginTop: 4, textAlign: 'right' },
  emptyChat: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 80 },
  emptyChatIcon: { fontSize: 50, marginBottom: 12 },
  emptyChatText: { color: COLORS.gray, fontSize: 14, textAlign: 'center' },
  inputRow: { flexDirection: 'row', backgroundColor: COLORS.white, padding: 12, paddingHorizontal: 16, alignItems: 'flex-end', gap: 10, borderTopWidth: 1, borderTopColor: '#EEE' },
  textInput: { flex: 1, backgroundColor: COLORS.bg, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, fontSize: 15, color: COLORS.text, maxHeight: 100, borderWidth: 1, borderColor: '#DDE8F0' },
  sendBtn: { width: 44, height: 44, backgroundColor: COLORS.primary, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  sendBtnDisabled: { backgroundColor: '#B0C4DE' },
});
