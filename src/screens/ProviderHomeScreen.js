import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';
import { firestoreService } from '../services/firestoreService';

const ProviderHomeScreen = ({ navigation }) => {
  const { user } = useSelector((state) => state.auth);
  const { isDarkMode } = useSelector((state) => state.theme);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      // For demo, we show all 'pending' bookings as available jobs
      const allBookings = await firestoreService.getUserBookings(null); // Modify service to support fetching all if needed
      setJobs(allBookings.filter(b => b.status === 'pending'));
    } catch (error) {
      console.error('Fetch jobs error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptJob = async (jobId) => {
    try {
      await firestoreService.updateBookingStatus(jobId, 'confirmed');
      fetchJobs();
    } catch (error) {
      console.error('Accept job error:', error);
    }
  };

  const renderJobItem = ({ item }) => (
    <View style={[styles.jobCard, isDarkMode && { backgroundColor: '#1E1E1E' }]}>
      <View style={styles.jobHeader}>
        <View style={styles.userInfo}>
          <Ionicons name="person-circle" size={40} color={COLORS.primary} />
          <View style={styles.userText}>
            <Text style={[styles.userName, isDarkMode && { color: '#FFF' }]}>{item.userName || 'Customer'}</Text>
            <Text style={[styles.jobTitle, isDarkMode && { color: '#888' }]}>{item.serviceTitle}</Text>
          </View>
        </View>
        <Text style={styles.price}>₹{item.price}</Text>
      </View>
      
      <View style={styles.jobDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="calendar-outline" size={16} color={COLORS.textSecondary} />
          <Text style={[styles.detailText, isDarkMode && { color: '#AAA' }]}>{item.date}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="time-outline" size={16} color={COLORS.textSecondary} />
          <Text style={[styles.detailText, isDarkMode && { color: '#AAA' }]}>{item.time}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.btn, styles.declineBtn]}
          onPress={() => console.log('Declined')}
        >
          <Text style={styles.declineText}>Decline</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.btn, styles.acceptBtn]}
          onPress={() => handleAcceptJob(item.id)}
        >
          <Text style={styles.acceptText}>Accept Job</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, isDarkMode && { backgroundColor: '#121212' }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.welcome, isDarkMode && { color: '#AAA' }]}>Provider Dashboard</Text>
          <Text style={[styles.title, isDarkMode && { color: '#FFF' }]}>Available Jobs</Text>
        </View>
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Done</Text>
          </View>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={jobs}
          renderItem={renderJobItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={() => (
            <View style={styles.empty}>
              <Ionicons name="briefcase-outline" size={80} color={isDarkMode ? "#333" : COLORS.gray[200]} />
              <Text style={[styles.emptyText, isDarkMode && { color: '#666' }]}>No jobs available right now</Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SIZES.padding,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  stats: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 15,
  },
  statValue: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  statLabel: {
    color: '#FFF',
    fontSize: 10,
    opacity: 0.8,
  },
  list: {
    padding: SIZES.padding,
  },
  jobCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userText: {
    marginLeft: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  jobTitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  jobDetails: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  detailText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 5,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btn: {
    flex: 1,
    height: 45,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  declineBtn: {
    backgroundColor: COLORS.gray[100],
    marginRight: 10,
  },
  acceptBtn: {
    backgroundColor: COLORS.primary,
  },
  declineText: {
    color: COLORS.text,
    fontWeight: 'bold',
  },
  acceptText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  empty: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    marginTop: 20,
    color: COLORS.textSecondary,
  }
});

export default ProviderHomeScreen;
