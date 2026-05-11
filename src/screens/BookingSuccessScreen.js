import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withDelay,
  withTiming
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';
import CustomButton from '../components/CustomButton';

const { width } = Dimensions.get('window');

const BookingSuccessScreen = ({ navigation }) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 12 });
    opacity.value = withDelay(300, withTiming(1, { duration: 800 }));
    translateY.value = withDelay(300, withSpring(0));
  }, []);

  const checkmarkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Animated.View style={[styles.iconContainer, checkmarkStyle]}>
          <Ionicons name="checkmark-circle" size={120} color={COLORS.success} />
        </Animated.View>

        <Animated.View style={[styles.textContainer, contentStyle]}>
          <Text style={styles.title}>Payment Successful!</Text>
          <Text style={styles.subtitle}>
            Your service booking has been confirmed. Our professional will contact you shortly.
          </Text>
        </Animated.View>
      </View>

      <Animated.View style={[styles.footer, contentStyle]}>
        <CustomButton 
          title="View My Bookings" 
          onPress={() => navigation.navigate('Bookings')}
          style={styles.button}
        />
        <TouchableOpacity 
          onPress={() => navigation.navigate('HomeMain')}
          style={styles.homeLink}
        >
          <Text style={styles.homeLinkText}>Back to Home</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF', // Using clean white for success screen
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  iconContainer: {
    marginBottom: 30,
    shadowColor: COLORS.success,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: SIZES.body1,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  footer: {
    padding: SIZES.padding,
    paddingBottom: 40,
  },
  button: {
    marginBottom: 20,
  },
  homeLink: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  homeLinkText: {
    fontSize: SIZES.body1,
    color: COLORS.primary,
    fontWeight: '600',
  }
});

export default BookingSuccessScreen;
