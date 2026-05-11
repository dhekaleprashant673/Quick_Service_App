import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';
import { chatService } from '../services/chatService';

const ChatScreen = ({ navigation }) => {
  const { user } = useSelector((state) => state.auth);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = chatService.subscribeToUserChats(user.uid, (userChats) => {
      setChats(userChats);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const renderChatItem = ({ item }) => {
    // Get the other participant's name
    const otherParticipantId = item.participants.find(id => id !== user.uid);
    const recipientName = item.participantNames ? item.participantNames[otherParticipantId] || 'Service Provider' : 'Service Provider';

    return (
      <TouchableOpacity 
        style={styles.chatItem}
        onPress={() => navigation.navigate('ChatDetail', { 
          chatId: item.id,
          recipientName: recipientName
        })}
      >
        <View style={styles.avatar}>
           <Image 
             source={{ uri: `https://i.pravatar.cc/150?u=${otherParticipantId}` }} 
             style={styles.avatarImage} 
           />
        </View>
        <View style={styles.chatContent}>
          <View style={styles.chatHeader}>
            <Text style={styles.name}>{recipientName}</Text>
            <Text style={styles.time}>
              {item.updatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
          <View style={styles.chatFooter}>
            <Text style={styles.lastMessage} numberOfLines={1}>
              {item.lastMessage || 'Start a conversation'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <TouchableOpacity>
          <Ionicons name="search-outline" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={chats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubbles-outline" size={80} color={COLORS.gray[300]} />
            <Text style={styles.emptyText}>No messages yet</Text>
            <Text style={styles.emptySubtext}>Book a service to start chatting with providers.</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
  },
  title: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  list: {
    paddingHorizontal: SIZES.padding,
  },
  chatItem: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
  },
  chatContent: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: SIZES.body1,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  time: {
    fontSize: SIZES.caption,
    color: COLORS.textSecondary,
  },
  chatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: SIZES.body2,
    color: COLORS.textSecondary,
    flex: 1,
    marginRight: 10,
  },
  emptyContainer: {
    marginTop: 100,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: SIZES.h3,
    color: COLORS.text,
    marginTop: 16,
    fontWeight: 'bold',
  },
  emptySubtext: {
    fontSize: SIZES.body2,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  }
});

export default ChatScreen;
