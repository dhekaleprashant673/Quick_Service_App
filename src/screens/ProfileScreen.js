import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, SIZES } from '../constants/theme';
import { authService } from '../services/authService';
import { logout, updateProfilePhoto, updateProfile } from '../store/slices/authSlice';

const ProfileScreen = ({ navigation }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const defaultImage = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=500';
  const profileImage = user?.photoURL || defaultImage;

  const menuItems = [
    { id: '1', title: 'Edit Profile', icon: 'person-outline', color: '#4834d4' },
    { id: '2', title: 'Booking History', icon: 'calendar-outline', color: '#686de0' },
    { id: '3', title: 'Payment Methods', icon: 'card-outline', color: '#635bff' },
    { id: 'role', title: user?.role === 'provider' ? 'Switch to Customer Mode' : 'Switch to Provider Mode', icon: 'swap-horizontal-outline', color: '#2ecc71' },
    { id: '4', title: 'Manage Addresses', icon: 'location-outline', color: '#eb4d4b' },
    { id: 'mfa', title: 'Two-Factor Auth', icon: 'shield-checkmark-outline', color: '#6ab04c' },
    { id: '5', title: 'Settings', icon: 'settings-outline', color: '#535c68' },
    { id: '6', title: 'Help & Support', icon: 'help-circle-outline', color: '#f0932b' },
  ];

  const handleRoleSwitch = async () => {
    const newRole = user?.role === 'provider' ? 'customer' : 'provider';
    try {
      setLoading(true);
      await authService.updateProfileData({ role: newRole });
      dispatch(updateProfile({ role: newRole }));
      Alert.alert('Role Updated', `You are now in ${newRole.charAt(0).toUpperCase() + newRole.slice(1)} mode.`);
    } catch (error) {
      Alert.alert('Error', 'Failed to switch role.');
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const newPhotoURL = result.assets[0].uri;
      try {
        await authService.updateProfilePhoto(newPhotoURL);
        dispatch(updateProfilePhoto(newPhotoURL));
        Alert.alert('Success', 'Profile picture updated successfully!');
      } catch (error) {
        console.error('Update photo error:', error);
        Alert.alert('Error', 'Failed to update profile picture.');
      }
    }
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Logout', 
        style: 'destructive',
        onPress: async () => {
          try {
            await authService.logout();
            dispatch(logout());
          } catch (error) {
            console.error('Logout error:', error);
          }
        }
      },
    ]);
  };

  const handleMenuItemPress = (item) => {
    switch (item.title) {
      case 'Edit Profile':
        navigation.navigate('EditProfile');
        break;
      case 'Switch to Provider Mode':
      case 'Switch to Customer Mode':
        handleRoleSwitch();
        break;
      case 'Booking History':
        navigation.navigate('Bookings');
        break;
      case 'Payment Methods':
        Alert.alert('Payment Methods', 'Your Stripe account is connected.\n\nCard: **** 4242\nStatus: Verified');
        break;
      case 'Settings':
        navigation.navigate('Settings');
        break;
      case 'Help & Support':
        Alert.alert('Help & Support', 'How can we help?\n\n- Chat with us\n- Call: +91 1234567890\n- Email: support@quickservice.com');
        break;
      case 'Two-Factor Auth':
        navigation.navigate('MFA', { mode: 'enroll' });
        break;
      default:
        Alert.alert(item.title, `This feature will be available in the next update!`);
        break;
    }
  };

  const { isDarkMode } = useSelector((state) => state.theme);

  return (
    <SafeAreaView style={[styles.container, isDarkMode && { backgroundColor: '#121212' }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.header, isDarkMode && { backgroundColor: '#1E1E1E', borderBottomWidth: 0 }]}>
          <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
            <Image 
              source={{ uri: profileImage }} 
              style={styles.avatarImage} 
            />
            <View style={styles.cameraIconContainer}>
              <Ionicons name="camera" size={20} color="#FFF" />
            </View>
          </TouchableOpacity>
          <Text style={[styles.name, isDarkMode && { color: '#FFF' }]}>{user?.displayName || 'User Name'}</Text>
          <Text style={[styles.email, isDarkMode && { color: '#AAA' }]}>{user?.email || 'user@example.com'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionLabel, isDarkMode && { color: '#666' }]}>Account Settings</Text>
          {menuItems.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={[styles.menuItem, isDarkMode && { backgroundColor: '#1E1E1E', shadowColor: '#000' }]}
              onPress={() => handleMenuItemPress(item)}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.iconWrapper, { backgroundColor: item.color + '15' }]}>
                   <Ionicons name={item.icon} size={22} color={item.color} />
                </View>
                <Text style={[styles.menuItemText, isDarkMode && { color: '#FFF' }]}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={isDarkMode ? "#444" : COLORS.gray[400]} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
           <Text style={[styles.sectionLabel, isDarkMode && { color: '#666' }]}>Support</Text>
           <TouchableOpacity 
             style={[styles.menuItem, isDarkMode && { backgroundColor: '#1E1E1E', shadowColor: '#000' }]} 
             onPress={() => Alert.alert('Privacy Policy', 'Privacy Policy content...')}
           >
              <View style={styles.menuItemLeft}>
                <View style={styles.iconWrapper}>
                   <Ionicons name="shield-outline" size={22} color={COLORS.primary} />
                </View>
                <Text style={[styles.menuItemText, isDarkMode && { color: '#FFF' }]}>Privacy Policy</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={isDarkMode ? "#444" : COLORS.gray[400]} />
            </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color={COLORS.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
        
        <Text style={styles.versionText}>Version 1.0.0</Text>
        <View style={{ height: 40 }} />
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
    paddingHorizontal: SIZES.padding,
    paddingVertical: 20, // Reduced for a tighter top alignment
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 5,
  },
  profileInfo: {
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 16,
    position: 'relative',
    width: 110,
    height: 110,
  },
  avatarImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: '#FFF',
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
  },
  name: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  email: {
    fontSize: SIZES.body2,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  section: {
    marginTop: 30,
    paddingHorizontal: SIZES.padding,
  },
  sectionLabel: {
    fontSize: SIZES.body2,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 15,
    marginLeft: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 15,
    borderRadius: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 2,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.gray[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuItemText: {
    fontSize: SIZES.body1,
    color: COLORS.text,
    fontWeight: '500',
  },
  stripeBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  stripeText: {
    backgroundColor: COLORS.error + '10',
    marginHorizontal: SIZES.padding,
    paddingVertical: 15,
    borderRadius: 15,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    backgroundColor: COLORS.error + '10',
    marginHorizontal: SIZES.padding,
    paddingVertical: 15,
    borderRadius: 15,
  },
  logoutText: {
    fontSize: SIZES.body1,
    color: COLORS.error,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  versionText: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 20,
  }
});

export default ProfileScreen;
