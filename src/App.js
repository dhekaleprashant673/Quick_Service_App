import React, { useRef, useEffect } from 'react';
import { StripeProvider } from '@stripe/stripe-react-native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { Provider, useSelector } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store } from './store';
import AppNavigator from './navigation/AppNavigator';
import { useAuth } from './hooks/useAuth';
import { COLORS } from './constants/theme';
import { notificationService } from './services/notificationService';
import GlobalToast from './components/GlobalToast';

const AppContent = () => {
  const { loading, user } = useAuth();
  const toastRef = useRef(null);

  useEffect(() => {
    if (user) {
      const unsubscribe = notificationService.startBookingWatcher(user.uid, (notif) => {
        toastRef.current?.show(notif.title, notif.message, notif.type);
      });
      return () => unsubscribe();
    }
  }, [user]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <>
      <AppNavigator />
      <GlobalToast ref={toastRef} />
    </>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <StripeProvider publishableKey="pk_test_51Sp80BC8BuEDaTztH0GC97be0gmfKhUtnjgQbC5UPRbCd00ZCLeE3IiB959ehCANGW101NGTwFnd18t2Eem5UrYS00XFzDOCBj">
        <Provider store={store}>
          <AppContent />
          <StatusBar style="auto" />
        </Provider>
      </StripeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
