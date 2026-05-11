import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  doc, 
  updateDoc, 
  orderBy, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../config/firebase';

export const firestoreService = {
  // SERVICES
  getServices: async (category = null) => {
    try {
      let q = collection(db, 'services');
      if (category) {
        q = query(q, where('category', '==', category));
      }
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      throw error;
    }
  },

  // BOOKINGS
  createBooking: async (bookingData) => {
    try {
      const docRef = await addDoc(collection(db, 'bookings'), {
        ...bookingData,
        status: 'pending',
        paymentStatus: 'unpaid',
        createdAt: new Date().toISOString(),
      });
      return docRef.id;
    } catch (error) {
      throw error;
    }
  },

  getUserBookings: async (userId) => {
    try {
      const q = query(
        collection(db, 'bookings'), 
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      const bookings = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort in memory to avoid needing a Firestore index
      return bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (error) {
      throw error;
    }
  },

  updateBookingStatus: async (bookingId, status) => {
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      await updateDoc(bookingRef, { status });
    } catch (error) {
      throw error;
    }
  },

  // Real-time listener for a single booking
  subscribeToBooking: (bookingId, callback) => {
    const bookingRef = doc(db, 'bookings', bookingId);
    return onSnapshot(bookingRef, (doc) => {
      if (doc.exists()) {
        callback({ id: doc.id, ...doc.data() });
      }
    });
  },

  cancelBooking: async (bookingId) => {
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      await updateDoc(bookingRef, { status: 'cancelled' });
    } catch (error) {
      throw error;
    }
  },

  // REVIEWS
  addReview: async (reviewData) => {
    try {
      await addDoc(collection(db, 'reviews'), {
        ...reviewData,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      throw error;
    }
  }
};
