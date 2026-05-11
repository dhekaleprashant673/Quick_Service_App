import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';

let bookingUnsubscribe = null;

export const notificationService = {
  // Listen for any changes in the user's bookings and trigger a callback
  startBookingWatcher: (userId, onStatusChange) => {
    if (bookingUnsubscribe) bookingUnsubscribe();

    const q = query(
      collection(db, 'bookings'),
      where('userId', '==', userId)
    );

    bookingUnsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'modified') {
          const booking = change.doc.data();
          const oldBooking = change.doc.data(); // Note: In a real app we'd compare state
          
          // Trigger the notification
          onStatusChange({
            title: 'Booking Update!',
            message: `Your booking for ${booking.serviceTitle} is now ${booking.status.toUpperCase()}.`,
            type: booking.status === 'completed' ? 'success' : 'info'
          });
        }
      });
    });

    return bookingUnsubscribe;
  },

  stopWatcher: () => {
    if (bookingUnsubscribe) {
      bookingUnsubscribe();
      bookingUnsubscribe = null;
    }
  }
};
