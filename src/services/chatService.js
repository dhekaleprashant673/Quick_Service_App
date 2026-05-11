import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  updateDoc,
  doc,
  getDocs,
  setDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';

export const chatService = {
  // Get or create a chat room between two users
  getOrCreateChat: async (user1Id, user1Name, user2Id, user2Name) => {
    try {
      const chatId = [user1Id, user2Id].sort().join('_');
      const chatRef = doc(db, 'chats', chatId);
      
      // We use setDoc with merge to ensure the chat document exists
      await setDoc(chatRef, {
        participants: [user1Id, user2Id],
        participantNames: {
          [user1Id]: user1Name,
          [user2Id]: user2Name
        },
        updatedAt: serverTimestamp(),
      }, { merge: true });
      
      return chatId;
    } catch (error) {
      console.error('Error getting/creating chat:', error);
      throw error;
    }
  },

  // Send a message
  sendMessage: async (chatId, senderId, text) => {
    try {
      const messagesRef = collection(db, 'chats', chatId, 'messages');
      await addDoc(messagesRef, {
        text,
        senderId,
        createdAt: serverTimestamp(),
      });

      // Update the chat document with last message
      const chatRef = doc(db, 'chats', chatId);
      await updateDoc(chatRef, {
        lastMessage: text,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // Listen for messages in a chat
  subscribeToMessages: (chatId, callback) => {
    const q = query(
      collection(db, 'chats', chatId, 'messages')
    );

    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      }));
      // Sort in memory to avoid needing a Firestore index
      messages.sort((a, b) => a.createdAt - b.createdAt);
      callback(messages);
    });
  },

  // Listen for all chats for a user
  subscribeToUserChats: (userId, callback) => {
    const q = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', userId)
    );

    return onSnapshot(q, (snapshot) => {
      const chats = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      }));
      // Sort in memory to avoid needing a Firestore index
      chats.sort((a, b) => b.updatedAt - a.updatedAt);
      callback(chats);
    });
  }
};
