import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { COLORS, SIZES } from '../constants/theme';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { authService } from '../services/authService';

const SignupSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'At least 6 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

const SignupScreen = ({ navigation }) => {
  const handleSignup = async (values, { setSubmitting }) => {
    try {
      await authService.signup(values.name, values.email, values.password);
    } catch (error) {
      Alert.alert('Signup Failed', error.message);
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
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join QuickService today</Text>
          </View>

          <Formik
            initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
            validationSchema={SignupSchema}
            onSubmit={handleSignup}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
              <View style={styles.form}>
                <CustomInput 
                  label="Full Name"
                  placeholder="Enter your name"
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  value={values.name}
                  error={touched.name && errors.name}
                />
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
                  placeholder="Create a password"
                  secureTextEntry
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  error={touched.password && errors.password}
                />
                <CustomInput 
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  secureTextEntry
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  value={values.confirmPassword}
                  error={touched.confirmPassword && errors.confirmPassword}
                />

                <CustomButton 
                  title="Sign Up"
                  onPress={handleSubmit}
                  loading={isSubmitting}
                  style={styles.signupBtn}
                />

                <View style={styles.footer}>
                  <Text style={styles.footerText}>Already have an account? </Text>
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.loginText}>Login</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Formik>
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
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: SIZES.padding,
  },
  content: {
    flex: 1,
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
    marginTop: 40,
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
    paddingBottom: 40,
  },
  signupBtn: {
    marginTop: 20,
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
  loginText: {
    color: COLORS.primary,
    fontSize: SIZES.body2,
    fontWeight: 'bold',
  }
});

export default SignupScreen;
