import { initPaymentSheet, presentPaymentSheet } from '@stripe/stripe-react-native';
import { Alert, Platform } from 'react-native';
import Constants from 'expo-constants';

/**
 * 🛠️ BACKEND CONFIGURATION
 * 1. Change 'USE_MOCK' to false when your server is running and reachable.
 * 2. If 'AUTO_DETECT' fails, replace the IP in 'MANUAL_IP' with your computer's IP.
 */
const USE_MOCK = false; 
const MANUAL_IP = ''; // 👈 PUT YOUR IP HERE (e.g., '192.168.1.5')

const getBackendUrl = () => {
  if (MANUAL_IP) return `http://${MANUAL_IP}:3000`;
  
  const debuggerHost = Constants.expoConfig?.hostUri || '';
  const ip = debuggerHost.split(':')[0];
  
  if (Platform.OS === 'android' && !ip) return 'http://10.0.2.2:3000';
  return ip ? `http://${ip}:3000` : 'http://localhost:3000';
};

const API_URL = getBackendUrl();

export const paymentService = {
  processPayment: async ({ amount, user }) => {
    if (USE_MOCK) {
      console.log('🧪 Mock Mode: Simulating success');
      return new Promise(resolve => setTimeout(() => resolve({ id: 'mock_123', status: 'succeeded' }), 1000));
    }

    try {
      console.log('📡 Attempting connection to:', `${API_URL}/create-payment-sheet`);

      const response = await fetch(`${API_URL}/create-payment-sheet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amount * 100, // in paise
          currency: 'inr',
          email: user?.email,
        }),
      }).catch(err => {
        throw new Error(`CONNECTION FAILED!\n\nTarget: ${API_URL}\n\n1. Ensure "node backend/server.js" is running.\n2. Ensure phone & computer are on SAME Wi-Fi.\n3. Turn OFF your computer's Firewall.`);
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Backend Error');
      }

      const { paymentIntent, ephemeralKey, customer } = await response.json();

      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: 'QuickService App',
        paymentIntentClientSecret: paymentIntent,
        customerEphemeralKeySecret: ephemeralKey,
        customerId: customer,
        allowsDelayedPaymentMethods: true,
        enableGooglePay: true,
        googlePay: { merchantCountryCode: 'IN', currencyCode: 'INR', testEnv: true },
      });

      if (initError) throw initError;

      const { error: presentError } = await presentPaymentSheet();
      if (presentError) {
        if (presentError.code === 'Canceled') throw { code: 'Canceled' };
        throw presentError;
      }

      return { id: 'pi_real_success', status: 'succeeded' };

    } catch (error) {
      console.error('❌ Stripe Error:', error);
      if (error.code !== 'Canceled') {
        Alert.alert(
          'Backend Connection Error', 
          error.message,
          [
            { text: 'Try Again' },
            { text: 'Use Mock Mode (For Testing UI)', onPress: () => { /* Logic to enable mock */ }}
          ]
        );
      }
      throw error;
    }
  },
};
