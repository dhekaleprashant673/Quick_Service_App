import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { authService } from '../services/authService';
import { COLORS, SIZES } from '../constants/theme';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import app from '../config/firebase';

const MFAScreen = ({ route, navigation }) => {
  const { mode, resolver, phoneNumber: initialPhoneNumber } = route.params; // mode: 'enroll' | 'verify'
  
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber || '');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationId, setVerificationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const recaptchaVerifier = useRef(null);

  const handleSendCode = async () => {
    if (!phoneNumber && mode === 'enroll') {
      Alert.alert('Error', 'Please enter a phone number');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'enroll') {
        const vid = await authService.enrollMFA(phoneNumber, recaptchaVerifier.current);
        setVerificationId(vid);
        Alert.alert('Success', 'Verification code sent to your phone');
      } else {
        // Sign-in verification
        const firstFactor = resolver.hints[0];
        const vid = await resolver.sendSecondFactor(firstFactor, recaptchaVerifier.current);
        setVerificationId(vid);
        Alert.alert('Success', 'Verification code sent to your phone');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      Alert.alert('Error', 'Please enter the verification code');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'enroll') {
        await authService.confirmMFAEnrollment(verificationId, verificationCode);
        Alert.alert('Success', 'Two-factor authentication enabled!');
        navigation.goBack();
      } else {
        await authService.verifyMFASignIn(resolver, verificationId, verificationCode);
        // Login success - Redux state will be updated by auth listener if implemented
        // or we might need to handle it here if not.
        // Assuming there's an onAuthStateChanged listener elsewhere.
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={app.options}
      />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.header}>
          <Text style={styles.title}>
            {mode === 'enroll' ? 'Enable 2FA' : 'Two-Step Verification'}
          </Text>
          <Text style={styles.subtitle}>
            {mode === 'enroll' 
              ? 'Secure your account by adding a phone number' 
              : 'Enter the code sent to your phone'}
          </Text>
        </View>

        <View style={styles.form}>
          {!verificationId ? (
            <>
              {mode === 'enroll' && (
                <CustomInput 
                  label="Phone Number"
                  placeholder="+1 123 456 7890"
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                />
              )}
              <CustomButton 
                title={mode === 'enroll' ? "Send Code" : "Send Verification Code"}
                onPress={handleSendCode}
                loading={loading}
              />
            </>
          ) : (
            <>
              <CustomInput 
                label="Verification Code"
                placeholder="123456"
                keyboardType="number-pad"
                value={verificationCode}
                onChangeText={setVerificationCode}
              />
              <CustomButton 
                title="Verify Code"
                onPress={handleVerifyCode}
                loading={loading}
              />
              <TouchableOpacity onPress={() => setVerificationId(null)} style={styles.retryBtn}>
                <Text style={styles.retryText}>Change phone number / Resend</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: SIZES.padding,
    paddingTop: 40,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: SIZES.body2,
    color: COLORS.textSecondary,
  },
  form: {
    gap: 16,
  },
  retryBtn: {
    marginTop: 16,
    alignItems: 'center',
  },
  retryText: {
    color: COLORS.primary,
    fontSize: SIZES.body2,
  }
});

export default MFAScreen;
