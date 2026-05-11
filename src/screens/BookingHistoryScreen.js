import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';
import { firestoreService } from '../services/firestoreService';

const BookingHistoryScreen = ({ navigation }) => {
  const { user } = useSelector((state) => state.auth);
  const { isDarkMode } = useSelector((state) => state.theme);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      if (user) {
        const data = await firestoreService.getUserBookings(user.uid);
        setBookings(data);
      }
    } catch (error) {
      console.error('Fetch bookings error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return COLORS.success;
      case 'pending': return COLORS.warning;
      case 'cancelled': return COLORS.error;
      default: return COLORS.primary;
    }
  };

  const renderBookingItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.card, isDarkMode && { backgroundColor: '#1E1E1E', shadowColor: '#000' }]}
      onPress={() => navigation.navigate('BookingDetail', { booking: item })}
    >
      <View style={[styles.cardHeader, isDarkMode && { borderBottomColor: '#333' }]}>
        <Image 
          source={{ uri: item.serviceImage || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=200' }} 
          style={styles.serviceImage} 
        />
        <View style={styles.headerInfo}>
          <Text style={[styles.serviceTitle, isDarkMode && { color: '#FFF' }]} numberOfLines={1}>{item.serviceTitle || 'Service Name'}</Text>
          <Text style={[styles.dateText, isDarkMode && { color: '#888' }]}>{new Date(item.createdAt).toLocaleDateString()}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20', alignSelf: 'flex-start', marginTop: 8 }]}>
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {item.status?.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.cardFooter}>
        <Text style={styles.priceText}>₹{item.price || '0.00'}</Text>
        <TouchableOpacity 
          style={[styles.detailsBtn, isDarkMode && { backgroundColor: '#333' }]}
          onPress={() => navigation.navigate('BookingDetail', { booking: item })}
        >
          <Text style={[styles.detailsBtnText, isDarkMode && { color: '#FFF' }]}>View Details</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.loadingContainer, isDarkMode && { backgroundColor: '#121212' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, isDarkMode && { backgroundColor: '#121212' }]}>
      <View style={[styles.header, isDarkMode && { backgroundColor: '#1E1E1E' }]}>
        <Text style={[styles.title, isDarkMode && { color: '#FFF' }]}>My Bookings</Text>
      </View>
      <FlatList
        data={bookings}
        renderItem={renderBookingItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={80} color={isDarkMode ? "#333" : COLORS.gray[300]} />
            <Text style={[styles.emptyText, isDarkMode && { color: '#666' }]}>No bookings found</Text>
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
    paddingHorizontal: SIZES.padding,
    paddingVertical: 12, // Reduced from SIZES.padding to move content up
    backgroundColor: COLORS.surface,
  },
  title: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  list: {
    padding: SIZES.padding,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
    paddingBottom: 12,
  },
  serviceImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: SIZES.body1,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  dateText: {
    fontSize: SIZES.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  priceText: {
    fontSize: SIZES.body1,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  detailsBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: COLORS.gray[100],
  },
  detailsBtnText: {
    fontSize: SIZES.caption,
    fontWeight: '600',
    color: COLORS.text,
  },
  emptyContainer: {
    marginTop: 100,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: SIZES.body1,
    color: COLORS.textSecondary,
    marginTop: 16,
  }
});

export default BookingHistoryScreen;
