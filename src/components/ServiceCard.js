import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

const ServiceCard = ({ service, onPress, isDarkMode }) => {
  return (
    <TouchableOpacity 
      style={[
        styles.card, 
        isDarkMode && { backgroundColor: '#1E1E1E', shadowColor: '#000' }
      ]} 
      onPress={onPress}
    >
      <Image 
        source={{ uri: service.image || 'https://via.placeholder.com/150' }} 
        style={styles.image} 
      />
      <View style={styles.content}>
        <Text style={[styles.title, isDarkMode && { color: '#FFF' }]}>{service.title}</Text>
        <Text style={[styles.category, isDarkMode && { color: '#888' }]}>{service.category}</Text>
        <View style={styles.footer}>
          <Text style={styles.price}>₹{service.price} / hr</Text>
          <View style={[styles.rating, isDarkMode && { backgroundColor: '#333' }]}>
            <Text style={[styles.ratingText, isDarkMode && { color: '#FFF' }]}>⭐ {service.rating || '4.5'}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 150,
  },
  content: {
    padding: 12,
    alignItems: 'center',
  },
  title: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
  },
  category: {
    fontSize: SIZES.body2,
    color: COLORS.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    width: '100%',
  },
  price: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  rating: {
    backgroundColor: COLORS.gray[100],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.text,
  },
});

export default ServiceCard;
