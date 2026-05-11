import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { COLORS, SIZES } from '../constants/theme';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { authService } from '../services/authService';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password too short').required('Password is required'),
});

const LoginScreen = ({ navigation }) => {
  const handleLogin = async (values, { setSubmitting }) => {
    try {
      const result = await authService.login(values.email, values.password);
      
      if (result.mfaRequired) {
        navigation.navigate('MFA', { 
          mode: 'verify', 
          resolver: result.resolver 
        });
      }
      // If not mfaRequired, the auth state listener will handle navigation to Home
    } catch (error) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.header}>
          <Text style={styles.title}>QuickService</Text>
          <Text style={styles.subtitle}>Book your service in seconds</Text>
        </View>

        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={handleLogin}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
            <View style={styles.form}>
              <CustomInput 
                label="Email"
                placeholder="Enter your email"
                keyboardType="email-address"
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                error={touched.email && errors.email}
              />
              <CustomInput 
                label="Password"
                placeholder="Enter your password"
                secureTextEntry
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                error={touched.password && errors.password}
              />
              
              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>

              <CustomButton 
                title="Login"
                onPress={handleSubmit}
                loading={isSubmitting}
                style={styles.loginBtn}
              />

              <View style={styles.footer}>
                <Text style={styles.footerText}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                  <Text style={styles.signupText}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Formik>
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
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: SIZES.h1,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  subtitle: {
    fontSize: SIZES.body1,
    color: COLORS.textSecondary,
    marginTop: 8,
  },
  form: {
    width: '100%',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotText: {
    color: COLORS.primary,
    fontSize: SIZES.body2,
    fontWeight: '500',
  },
  loginBtn: {
    marginTop: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.body2,
  },
  signupText: {
    color: COLORS.primary,
    fontSize: SIZES.body2,
    fontWeight: 'bold',
  }
});

export default LoginScreen;
