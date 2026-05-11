import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';

const RewardsScreen = () => {
  const { isDarkMode } = useSelector((state) => state.theme);

  return (
    <SafeAreaView style={[styles.container, isDarkMode && { backgroundColor: '#121212' }]}>
      <View style={[styles.header, isDarkMode && { backgroundColor: '#000' }]}>
        <Text style={styles.headerTitle}>Refer & Earn</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Refer Banner */}
        <View style={styles.banner}>
          <View style={styles.bannerLeft}>
            <Text style={styles.bannerTitle}>Refer and get FREE services</Text>
            <Text style={styles.bannerSub}>
              Invite your friends to try QuickService. They get instant ₹100 off. You win ₹100 once they take a service.
            </Text>
          </View>
          <Image 
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2912/2912761.png' }} 
            style={styles.bannerIcon} 
          />
        </View>

        {/* Share Section */}
        <View style={styles.shareSection}>
          <Text style={styles.referVia}>Refer via</Text>
          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialItem}>
              <View style={[styles.iconCircle, { backgroundColor: '#25D366' }]}>
                <FontAwesome name="whatsapp" size={24} color="#FFF" />
              </View>
              <Text style={styles.socialText}>Whatsapp</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialItem}>
              <View style={[styles.iconCircle, { backgroundColor: '#0084FF' }]}>
                <Ionicons name="chatbubble-ellipses" size={24} color="#FFF" />
              </View>
              <Text style={styles.socialText}>Messenger</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialItem}>
              <View style={[styles.iconCircle, { backgroundColor: '#636E72' }]}>
                <Ionicons name="link-outline" size={24} color="#FFF" />
              </View>
              <Text style={styles.socialText}>Copy Link</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* How it works */}
        <View style={[styles.infoCard, isDarkMode && { backgroundColor: '#1E1E1E' }]}>
          <Text style={[styles.infoTitle, isDarkMode && { color: '#FFF' }]}>How it works?</Text>
          
          <View style={styles.step}>
            <View style={styles.stepNumContainer}>
               <Text style={styles.stepNum}>1</Text>
            </View>
            <Text style={[styles.stepText, isDarkMode && { color: '#AAA' }]}>Invite your friends & get rewarded</Text>
          </View>
          <View style={styles.line} />
          
          <View style={styles.step}>
            <View style={styles.stepNumContainer}>
               <Text style={styles.stepNum}>2</Text>
            </View>
            <Text style={[styles.stepText, isDarkMode && { color: '#AAA' }]}>They get ₹100 on their first service</Text>
          </View>
          <View style={styles.line} />

          <View style={styles.step}>
            <View style={styles.stepNumContainer}>
               <Text style={styles.stepNum}>3</Text>
            </View>
            <Text style={[styles.stepText, isDarkMode && { color: '#AAA' }]}>You get ₹100 once their service is completed</Text>
          </View>
        </View>

        {/* Empty State */}
        <View style={styles.emptyState}>
          <Text style={[styles.emptyTitle, isDarkMode && { color: '#FFF' }]}>You are yet to earn any scratch cards</Text>
          <Text style={styles.emptySub}>Start referring to get surprises</Text>
          <View style={styles.rewardAlert}>
            <Ionicons name="gift-outline" size={20} color={COLORS.primary} />
            <Text style={[styles.alertText, isDarkMode && { color: '#AAA' }]}>Earn ₹100 on every successful referral</Text>
          </View>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  header: {
    padding: 15,
    backgroundColor: '#000',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  banner: {
    backgroundColor: '#FFF',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerLeft: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  bannerSub: {
    fontSize: 13,
    color: '#636E72',
    marginTop: 8,
    lineHeight: 18,
  },
  bannerIcon: {
    width: 70,
    height: 70,
    marginLeft: 15,
  },
  shareSection: {
    padding: 20,
    backgroundColor: '#FFF',
    marginTop: 10,
  },
  referVia: {
    textAlign: 'center',
    fontSize: 14,
    color: '#636E72',
    marginBottom: 20,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  socialItem: {
    alignItems: 'center',
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  socialText: {
    fontSize: 12,
    color: '#2D3436',
  },
  infoCard: {
    backgroundColor: '#EBF4FF',
    margin: 20,
    padding: 25,
    borderRadius: 15,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 25,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepNumContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#D1D1D1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  stepNum: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
  stepText: {
    fontSize: 14,
    color: '#2D3436',
    flex: 1,
  },
  line: {
    width: 1,
    height: 30,
    backgroundColor: '#D1D1D1',
    marginLeft: 12,
  },
  emptyState: {
    padding: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  emptySub: {
    fontSize: 14,
    color: '#636E72',
    marginTop: 4,
  },
  rewardAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
  },
  alertText: {
    fontSize: 14,
    color: '#2D3436',
    marginLeft: 12,
  }
});

export default RewardsScreen;
