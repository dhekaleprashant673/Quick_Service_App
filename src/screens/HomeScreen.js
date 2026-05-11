import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator, 
  Image, 
  TextInput,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';
import { locationService } from '../services/locationService';
import ServiceCard from '../components/ServiceCard';

const { width } = Dimensions.get('window');

const BANNERS = [
  {
    id: 'b1',
    title: 'Relax & rejuvenate at home',
    sub: 'Spa for women',
    color: '#839237',
    image: 'https://images.unsplash.com/photo-1544161515-436cefb657f8?q=80&w=500'
  },
  {
    id: 'b2',
    title: 'Home repairs affordable',
    sub: 'Electricians & Plumbers',
    color: '#0077C2',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=500'
  }
];

const PROFESSIONALS = [
  { id: 'p1', image: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?q=80&w=300' },
  { id: 'p2', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300' },
  { id: 'p3', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300' }
];

const HomeScreen = ({ navigation }) => {
  const { user } = useSelector((state) => state.auth);
  const { isDarkMode } = useSelector((state) => state.theme);
  
  const [location, setLocation] = useState('Detecting location...');
  const [isServiceAvailable, setIsServiceAvailable] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = async () => {
    const result = await locationService.getCurrentLocation();
    if (result.displayAddress) {
      setLocation(result.displayAddress);
      const available = locationService.checkServiceAvailability(result.city);
      setIsServiceAvailable(available);
    } else {
      setLocation('Location Access Denied');
    }
  };

  const renderBanner = ({ item }) => (
    <View style={[styles.bannerCard, { backgroundColor: item.color }]}>
      <View style={styles.bannerTextContainer}>
        <Text style={styles.bannerTitle}>{item.title}</Text>
        <Text style={styles.bannerSub}>{item.sub}</Text>
        <TouchableOpacity style={styles.bookNowBtn}>
          <Text style={styles.bookNowText}>Book now</Text>
        </TouchableOpacity>
      </View>
      <Image source={{ uri: item.image }} style={styles.bannerImage} />
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, isDarkMode && { backgroundColor: '#121212' }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header - Location & Cart */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.locationContainer} onPress={getUserLocation}>
            <Ionicons name="location" size={24} color={COLORS.primary} />
            <View style={styles.locationText}>
              <Text style={[styles.locationMain, isDarkMode && { color: '#FFF' }]}>{location}</Text>
              <View style={styles.locationSubRow}>
                <Text style={styles.locationSub}>Maharashtra- India</Text>
                <Ionicons name="chevron-down" size={14} color={COLORS.textSecondary} />
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.cartBtn, isDarkMode && { backgroundColor: '#1E1E1E' }]}>
            <Ionicons name="cart-outline" size={24} color={isDarkMode ? "#FFF" : COLORS.text} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={[styles.searchBar, isDarkMode && { backgroundColor: '#1E1E1E', borderColor: '#333' }]}>
            <Ionicons name="search-outline" size={20} color={COLORS.gray[400]} />
            <TextInput 
              placeholder="Search for 'cleaning'" 
              placeholderTextColor={COLORS.gray[400]}
              style={[styles.searchInput, isDarkMode && { color: '#FFF' }]}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Offers & Discounts */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDarkMode && { color: '#FFF' }]}>Offers & discounts</Text>
          <FlatList 
            data={BANNERS}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            renderItem={renderBanner}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.bannerList}
          />
          <View style={styles.pagination}>
            <View style={styles.dotActive} />
            <View style={styles.dotInactive} />
          </View>
        </View>

        {/* Service Availability Alert */}
        {!isServiceAvailable && (
          <View style={styles.availabilityAlert}>
            <Ionicons name="alert-circle" size={20} color="#FFF" />
            <Text style={styles.availabilityText}>Services are currently limited in your area.</Text>
          </View>
        )}

        {/* Celebrating Professionals */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDarkMode && { color: '#FFF' }]}>Celebrating professionals</Text>
          <Text style={styles.sectionSubTitle}>Real lives, real impact</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.profList}>
            {PROFESSIONALS.map(prof => (
              <Image key={prof.id} source={{ uri: prof.image }} style={styles.profImage} />
            ))}
          </ScrollView>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingVertical: 15,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationText: {
    marginLeft: 10,
  },
  locationMain: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  locationSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginRight: 4,
  },
  cartBtn: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchSection: {
    paddingHorizontal: SIZES.padding,
    marginTop: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 50,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  section: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    paddingHorizontal: SIZES.padding,
    marginBottom: 15,
  },
  bannerList: {
    paddingHorizontal: SIZES.padding,
  },
  bannerCard: {
    width: width - (SIZES.padding * 2),
    height: 180,
    borderRadius: 15,
    flexDirection: 'row',
    marginRight: 15,
    overflow: 'hidden',
  },
  bannerTextContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  bannerTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  bannerSub: {
    color: '#FFF',
    fontSize: 14,
    marginTop: 5,
    opacity: 0.9,
  },
  bookNowBtn: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignSelf: 'flex-start',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    marginTop: 15,
  },
  bookNowText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  bannerImage: {
    width: '40%',
    height: '100%',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  dotActive: {
    width: 30,
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    marginHorizontal: 3,
  },
  dotInactive: {
    width: 30,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    marginHorizontal: 3,
  },
  availabilityAlert: {
    backgroundColor: COLORS.error,
    marginHorizontal: SIZES.padding,
    marginTop: 20,
    padding: 12,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  availabilityText: {
    color: '#FFF',
    fontSize: 12,
    marginLeft: 8,
    fontWeight: '500',
  },
  sectionSubTitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    paddingHorizontal: SIZES.padding,
    marginTop: -10,
    marginBottom: 20,
  },
  profList: {
    paddingLeft: SIZES.padding,
  },
  profImage: {
    width: 130,
    height: 200,
    borderRadius: 10,
    marginRight: 12,
  }
});

export default HomeScreen;
