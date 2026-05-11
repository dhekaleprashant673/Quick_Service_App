import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';
import CustomButton from '../components/CustomButton';
import { firestoreService } from '../services/firestoreService';
import { paymentService } from '../services/paymentService';

const TIME_SLOTS = ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'];

const BookingScreen = ({ route, navigation }) => {
  const { service } = route.params;
  const { user } = useSelector((state) => state.auth);
  const { isDarkMode } = useSelector((state) => state.theme);
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [loading, setLoading] = useState(false);

  const handleBooking = async (paymentId = 'mock_id') => {
    try {
      const bookingData = {
        userId: user.uid,
        userName: user.displayName,
        serviceId: service.id,
        serviceTitle: service.title,
        price: service.price,
        date: selectedDate.toISOString().split('T')[0],
        time: selectedTime,
        status: 'pending',
        paymentStatus: 'paid',
        paymentId: paymentId,
        createdAt: new Date().toISOString(),
        serviceImage: service.image,
        providerName: service.providerName,
      };

      await firestoreService.createBooking(bookingData);
      navigation.navigate('BookingSuccess');
    } catch (error) {
      Alert.alert('Booking Failed', error.message);
    }
  };

  const handlePayment = async () => {
    if (!selectedTime) {
      Alert.alert('Selection Required', 'Please select a preferred time slot first.');
      return;
    }

    try {
      setLoading(true);
      const paymentData = await paymentService.processPayment({
        amount: service.price,
        user: user
      });

      if (paymentData.status === 'succeeded') {
        await handleBooking(paymentData.id);
      }
    } catch (error) {
      if (error.code !== 'Canceled') {
        // Error already alerted in service
        console.log('Payment error details:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const renderDateSelector = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      dates.push(d);
    }

    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateList}>
        {dates.map((date, index) => {
          const isSelected = selectedDate.toDateString() === date.toDateString();
          return (
            <TouchableOpacity 
              key={index} 
              style={[
                styles.dateItem, 
                isSelected && styles.selectedItem,
                isDarkMode && !isSelected && { backgroundColor: '#1E1E1E', borderColor: '#333' }
              ]}
              onPress={() => setSelectedDate(date)}
            >
              <Text style={[styles.dateDay, isSelected && styles.selectedText, isDarkMode && !isSelected && { color: '#888' }]}>
                {date.toLocaleDateString('en-US', { weekday: 'short' })}
              </Text>
              <Text style={[styles.dateNumber, isSelected && styles.selectedText, isDarkMode && !isSelected && { color: '#FFF' }]}>
                {date.getDate()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={[styles.container, isDarkMode && { backgroundColor: '#121212' }]}>
      <View style={[styles.header, isDarkMode && { backgroundColor: '#1E1E1E', borderBottomWidth: 0 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={isDarkMode ? '#FFF' : COLORS.text} />
        </TouchableOpacity>
        <Text style={[styles.title, isDarkMode && { color: '#FFF' }]}>Select Schedule</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDarkMode && { color: '#FFF' }]}>Select Date</Text>
          {renderDateSelector()}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDarkMode && { color: '#FFF' }]}>Available Time</Text>
          <View style={styles.timeGrid}>
            {TIME_SLOTS.map((time) => (
              <TouchableOpacity 
                key={time} 
                style={[
                  styles.timeItem, 
                  selectedTime === time && styles.selectedItem,
                  isDarkMode && selectedTime !== time && { backgroundColor: '#1E1E1E', borderColor: '#333' }
                ]}
                onPress={() => setSelectedTime(time)}
              >
                <Text style={[styles.timeText, selectedTime === time && styles.selectedText, isDarkMode && selectedTime !== time && { color: '#DDD' }]}>
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={[styles.summaryCard, isDarkMode && { backgroundColor: '#1E1E1E' }]}>
          <Text style={[styles.summaryTitle, isDarkMode && { color: '#FFF' }]}>Booking Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, isDarkMode && { color: '#888' }]}>Service</Text>
            <Text style={[styles.summaryValue, isDarkMode && { color: '#FFF' }]}>{service.title}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, isDarkMode && { color: '#888' }]}>Date</Text>
            <Text style={[styles.summaryValue, isDarkMode && { color: '#FFF' }]}>{selectedDate.toDateString()}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, isDarkMode && { color: '#888' }]}>Time</Text>
            <Text style={[styles.summaryValue, isDarkMode && { color: '#FFF' }]}>{selectedTime || 'Not selected'}</Text>
          </View>
          <View style={[styles.summaryRow, { borderTopWidth: 1, borderTopColor: isDarkMode ? '#333' : COLORS.gray[100], marginTop: 10, paddingTop: 10 }]}>
            <Text style={[styles.totalLabel, isDarkMode && { color: '#FFF' }]}>Total Price</Text>
            <Text style={styles.totalValue}>₹{service.price}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, isDarkMode && { backgroundColor: '#1E1E1E', borderTopWidth: 0 }]}>
        <CustomButton 
          title={loading ? "Securing Payment..." : "Confirm & Pay ₹" + service.price} 
          onPress={handlePayment}
          loading={loading}
          style={styles.proceedBtn}
        />
      </View>
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
    padding: SIZES.padding,
    backgroundColor: COLORS.surface,
  },
  title: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  content: {
    flex: 1,
    padding: SIZES.padding,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: SIZES.body1,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  dateList: {
    flexDirection: 'row',
  },
  dateItem: {
    width: 60,
    height: 80,
    backgroundColor: COLORS.surface,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: COLORS.gray[100],
  },
  dateDay: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  dateNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  selectedItem: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  selectedText: {
    color: '#FFF',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  timeItem: {
    width: '31%',
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.gray[100],
  },
  timeText: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: '500',
  },
  summaryCard: {
    backgroundColor: COLORS.surface,
    padding: 20,
    borderRadius: SIZES.radius,
    marginTop: 10,
    marginBottom: 40,
  },
  summaryTitle: {
    fontSize: SIZES.body1,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    color: COLORS.textSecondary,
    fontSize: SIZES.body2,
  },
  summaryValue: {
    color: COLORS.text,
    fontWeight: '500',
    fontSize: SIZES.body2,
  },
  totalLabel: {
    fontSize: SIZES.body1,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  totalValue: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  footer: {
    padding: SIZES.padding,
    backgroundColor: COLORS.surface,
  },
  paymentContent: {
    flex: 1,
    padding: SIZES.padding,
    alignItems: 'center',
    paddingTop: 40,
  },
  proceedBtn: {
    marginTop: 10,
  }
});

export default BookingScreen;
