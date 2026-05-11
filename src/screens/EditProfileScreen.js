import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  ScrollView, 
  Alert, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Animated, { 
  FadeInUp, 
  FadeOutUp, 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withDelay,
  withTiming
} from 'react-native-reanimated';
import { COLORS, SIZES } from '../constants/theme';
import { authService } from '../services/authService';
import { updateProfilePhoto, updateProfile } from '../store/slices/authSlice';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

const EditProfileScreen = ({ navigation }) => {
  const { user } = useSelector((state) => state.auth);
  const { isDarkMode } = useSelector((state) => state.theme);
  const dispatch = useDispatch();

  const [name, setName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [photoURL, setPhotoURL] = useState(user?.photoURL);
  const [showToast, setShowToast] = useState(false);

  const toastOpacity = useSharedValue(0);
  const toastTranslateY = useSharedValue(-20);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setPhotoURL(result.assets[0].uri);
    }
  };

  const triggerToast = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      navigation.goBack();
    }, 2000);
  };

  const handleUpdate = async () => {
    if (!name || !email) {
      Alert.alert('Error', 'Name and Email are required.');
      return;
    }

    setLoading(true);
    try {
      // 1. Update Photo if changed
      if (photoURL !== user?.photoURL) {
        await authService.updateProfilePhoto(photoURL);
        dispatch(updateProfilePhoto(photoURL));
      }

      // 2. Update Other Data
      await authService.updateProfileData({ name, email, password });
      
      // Update local Redux state IMMEDIATELY so Main Page (HomeScreen) updates
      dispatch(updateProfile({ 
        displayName: name, 
        email: email,
        photoURL: photoURL 
      }));

      triggerToast();
    } catch (error) {
      console.error('Update profile error:', error);
      Alert.alert('Update Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, isDarkMode && { backgroundColor: '#121212' }]}>
      {/* Animated Success Toast */}
      {showToast && (
        <Animated.View 
          entering={FadeInUp} 
          exiting={FadeOutUp}
          style={styles.toastContainer}
        >
          <View style={styles.toast}>
            <Ionicons name="checkmark-circle" size={24} color="#FFF" />
            <Text style={styles.toastText}>Profile Updated Successfully!</Text>
          </View>
        </Animated.View>
      )}

      <View style={[styles.header, isDarkMode && { backgroundColor: '#1E1E1E', borderBottomWidth: 0 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={isDarkMode ? '#FFF' : COLORS.text} />
        </TouchableOpacity>
        <Text style={[styles.title, isDarkMode && { color: '#FFF' }]}>Edit Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <View style={styles.avatarSection}>
            <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
              <Image 
                source={{ uri: photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=500' }} 
                style={styles.avatarImage} 
              />
              <View style={styles.cameraBadge}>
                <Ionicons name="camera" size={20} color="#FFF" />
              </View>
            </TouchableOpacity>
            <Text style={[styles.avatarTip, isDarkMode && { color: '#888' }]}>Tap to change profile picture</Text>
          </View>

          <View style={styles.form}>
            <CustomInput 
              label="Full Name"
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              isDarkMode={isDarkMode}
            />
            
            <CustomInput 
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              isDarkMode={isDarkMode}
            />

            <View style={styles.passwordSection}>
              <Text style={[styles.sectionLabel, isDarkMode && { color: '#FFF' }]}>Change Password</Text>
              <Text style={[styles.sectionSub, isDarkMode && { color: '#888' }]}>Leave blank if you don't want to change it</Text>
              <CustomInput 
                label="New Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Minimum 6 characters"
                secureTextEntry
                isDarkMode={isDarkMode}
              />
            </View>

            <CustomButton 
              title={loading ? "Saving Changes..." : "Save Changes"}
              onPress={handleUpdate}
              loading={loading}
              style={styles.saveBtn}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  toastContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    zIndex: 9999,
    alignItems: 'center',
  },
  toast: {
    flexDirection: 'row',
    backgroundColor: COLORS.success,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: COLORS.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  toastText: {
    color: '#FFF',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  content: {
    padding: SIZES.padding,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    position: 'relative',
    width: 120,
    height: 120,
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: COLORS.primary + '30',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
  },
  avatarTip: {
    marginTop: 12,
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  form: {
    marginTop: 10,
  },
  passwordSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[100],
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  sectionSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  saveBtn: {
    marginTop: 20,
    marginBottom: 40,
  }
});

export default EditProfileScreen;
