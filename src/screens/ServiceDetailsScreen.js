import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';
import CustomButton from '../components/CustomButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { chatService } from '../services/chatService';

const ServiceDetailsScreen = ({ route, navigation }) => {
  const { service } = route.params;
  const { user } = useSelector((state) => state.auth);
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image 
          source={{ uri: service.image || 'https://via.placeholder.com/400' }} 
          style={styles.image} 
        />
        <TouchableOpacity 
          style={[styles.backButton, { top: insets.top + 10 }]} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>

        <View style={styles.content}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>{service.title}</Text>
              <Text style={styles.category}>{service.category}</Text>
            </View>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>{service.rating || '4.5'}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About Service</Text>
            <Text style={styles.description}>
              {service.description || "Get professional " + service.title.toLowerCase() + " at your doorstep. Our experts are highly trained and verified to provide the best experience."}
            </Text>
          </View>

            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Ionicons name="time-outline" size={20} color={COLORS.primary} />
                <Text style={styles.infoLabel}>Duration</Text>
                <Text style={styles.infoValue}>60-90 min</Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="card-outline" size={20} color={COLORS.primary} />
                <Text style={styles.infoLabel}>Billing</Text>
                <Text style={styles.infoValue}>Per Hour</Text>
              </View>
            </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View>
          <Text style={styles.priceLabel}>Price</Text>
          <Text style={styles.price}>₹{service.price} / hr</Text>
        </View>
        <View style={styles.footerRight}>
          <TouchableOpacity 
            style={styles.chatIconBtn}
            onPress={async () => {
              const chatId = await chatService.getOrCreateChat(
                user.uid, 
                user.displayName || 'Customer', 
                service.providerId || 'p1', 
                service.providerName || 'John Doe'
              );
              navigation.navigate('Chat', { screen: 'ChatDetail', params: { chatId, recipientName: service.providerName || 'John Doe' } });
            }}
          >
            <Ionicons name="chatbubble-ellipses-outline" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <CustomButton 
            title="Book Now" 
            onPress={() => navigation.navigate('Booking', { service })}
            style={styles.bookBtn}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  image: {
    width: '100%',
    height: 300,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    padding: SIZES.padding,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  category: {
    fontSize: SIZES.body2,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray[100],
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  ratingText: {
    marginLeft: 5,
    fontSize: SIZES.body2,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  description: {
    fontSize: SIZES.body2,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  infoGrid: {
    flexDirection: 'row',
    marginTop: 24,
    justifyContent: 'space-between',
  },
  infoItem: {
    flex: 0.48,
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: SIZES.radius,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: SIZES.caption,
    color: COLORS.textSecondary,
    marginTop: 8,
  },
  infoValue: {
    fontSize: SIZES.body2,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    padding: SIZES.padding,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[100],
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceLabel: {
    fontSize: SIZES.caption,
    color: COLORS.textSecondary,
  },
  price: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
    marginLeft: 20,
  },
  chatIconBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  bookBtn: {
    flex: 1,
  }
});

export default ServiceDetailsScreen;
