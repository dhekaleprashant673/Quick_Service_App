import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { COLORS, SIZES } from '../constants/theme';
import { firestoreService } from '../services/firestoreService';

const BookingDetailScreen = ({ route, navigation }) => {
  const { booking: initialBooking } = route.params;
  const [booking, setBooking] = useState(initialBooking);
  const { isDarkMode } = useSelector((state) => state.theme);

  useEffect(() => {
    // 🔔 Subscribe to real-time updates for this booking
    const unsubscribe = firestoreService.subscribeToBooking(initialBooking.id, (updatedBooking) => {
      setBooking(updatedBooking);
    });

    return () => unsubscribe();
  }, [initialBooking.id]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return COLORS.success;
      case 'pending': return COLORS.warning;
      case 'cancelled': return COLORS.error;
      case 'confirmed': return COLORS.primary;
      default: return COLORS.primary;
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this service?',
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Yes, Cancel', 
          style: 'destructive',
          onPress: async () => {
            try {
              await firestoreService.cancelBooking(booking.id);
            } catch (error) {
              Alert.alert('Error', 'Failed to cancel booking.');
            }
          }
        }
      ]
    );
  };

  const StatusTracker = () => {
    const steps = ['pending', 'confirmed', 'completed'];
    const currentIndex = steps.indexOf(booking.status);

    return (
      <View style={styles.trackerContainer}>
        {steps.map((step, index) => (
          <React.Fragment key={step}>
            <View style={styles.stepWrapper}>
              <View style={[
                styles.stepDot, 
                index <= currentIndex && { backgroundColor: getStatusColor(step) },
                booking.status === 'cancelled' && { backgroundColor: COLORS.error }
              ]}>
                {index < currentIndex ? (
                  <Ionicons name="checkmark" size={12} color="#FFF" />
                ) : (
                  <View style={styles.innerDot} />
                )}
              </View>
              <Text style={[
                styles.stepLabel, 
                isDarkMode && { color: '#888' },
                index === currentIndex && { color: getStatusColor(step), fontWeight: 'bold' }
              ]}>
                {step.charAt(0).toUpperCase() + step.slice(1)}
              </Text>
            </View>
            {index < steps.length - 1 && (
              <View style={[styles.stepLine, index < currentIndex && { backgroundColor: COLORS.primary }]} />
            )}
          </React.Fragment>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, isDarkMode && { backgroundColor: '#121212' }]}>
      <View style={[styles.header, isDarkMode && { backgroundColor: '#1E1E1E', borderBottomWidth: 0 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={isDarkMode ? '#FFF' : COLORS.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isDarkMode && { color: '#FFF' }]}>Live Booking Status</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        
        {/* Real-Time Tracker Section */}
        <View style={[styles.trackerCard, isDarkMode && { backgroundColor: '#1E1E1E' }]}>
           <Text style={[styles.sectionTitle, isDarkMode && { color: '#FFF' }]}>Track Service</Text>
           <StatusTracker />
        </View>

        <View style={[styles.card, isDarkMode && { backgroundColor: '#1E1E1E', shadowColor: '#000' }]}>
          <View style={styles.serviceInfo}>
            <Image 
              source={{ uri: booking.serviceImage || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=200' }} 
              style={styles.serviceImage} 
            />
            <View style={styles.serviceText}>
              <Text style={[styles.serviceTitle, isDarkMode && { color: '#FFF' }]}>{booking.serviceTitle}</Text>
              <Text style={[styles.providerName, isDarkMode && { color: '#888' }]}>Provider: {booking.providerName || 'Professional'}</Text>
            </View>
          </View>
        </View>

        <View style={[styles.section, isDarkMode && { backgroundColor: '#1E1E1E' }]}>
          <Text style={[styles.sectionTitle, isDarkMode && { color: '#FFF' }]}>Schedule</Text>
          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={20} color={COLORS.primary} />
            <Text style={[styles.detailText, isDarkMode && { color: '#DDD' }]}>{new Date(booking.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={20} color={COLORS.primary} />
            <Text style={[styles.detailText, isDarkMode && { color: '#DDD' }]}>{booking.time}</Text>
          </View>
        </View>

        <View style={[styles.section, isDarkMode && { backgroundColor: '#1E1E1E' }]}>
          <Text style={[styles.sectionTitle, isDarkMode && { color: '#FFF' }]}>Payment Details</Text>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, isDarkMode && { color: '#888' }]}>Service Charge</Text>
            <Text style={[styles.summaryValue, isDarkMode && { color: '#FFF' }]}>₹{booking.price}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow, isDarkMode && { borderTopColor: '#333' }]}>
            <Text style={[styles.totalLabel, isDarkMode && { color: '#FFF' }]}>Total Amount</Text>
            <Text style={styles.totalValue}>₹{(booking.price * 1.18).toFixed(2)}</Text>
          </View>
          <View style={[styles.paymentMethod, isDarkMode && { backgroundColor: '#333' }]}>
            <Ionicons name="card" size={20} color="#635bff" />
            <Text style={[styles.methodText, isDarkMode && { color: '#AAA' }]}>Securely Paid via Stripe</Text>
          </View>
        </View>

        {booking.status === 'pending' && (
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancel Booking</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity 
          style={[styles.helpBtn, isDarkMode && { borderColor: COLORS.primary }]}
          onPress={() => navigation.navigate('Chat', { screen: 'ChatMain' })}
        >
          <Ionicons name="chatbubble-outline" size={20} color={COLORS.primary} />
          <Text style={styles.helpBtnText}>Message Provider</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  content: {
    padding: SIZES.padding,
  },
  trackerCard: {
    backgroundColor: COLORS.surface,
    padding: 20,
    borderRadius: SIZES.radius,
    marginBottom: 20,
  },
  trackerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    justifyContent: 'space-between',
  },
  stepWrapper: {
    alignItems: 'center',
    zIndex: 1,
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.gray[200],
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFF',
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: COLORS.gray[200],
    marginHorizontal: -10,
    marginTop: -20,
  },
  stepLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 8,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  serviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  serviceText: {
    marginLeft: 15,
    flex: 1,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  providerName: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  section: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    marginLeft: 12,
    fontSize: 14,
    color: COLORS.text,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  summaryValue: {
    color: COLORS.text,
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[100],
    marginTop: 10,
    paddingTop: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    backgroundColor: COLORS.gray[50],
    padding: 12,
    borderRadius: 10,
  },
  methodText: {
    marginLeft: 10,
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  cancelButton: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  cancelButtonText: {
    color: COLORS.error,
    fontWeight: 'bold',
    fontSize: 14,
  },
  helpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 15,
    marginTop: 10,
    marginBottom: 40,
  },
  helpBtnText: {
    marginLeft: 10,
    color: COLORS.primary,
    fontWeight: 'bold',
  }
});

export default BookingDetailScreen;
