import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
// Main stack for the Home tab
import HomeScreen from '../screens/HomeScreen';
import ServiceDetailsScreen from '../screens/ServiceDetailsScreen';
import BookingScreen from '../screens/BookingScreen';
import BookingSuccessScreen from '../screens/BookingSuccessScreen';

const Stack = createStackNavigator();

const HomeStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="ServiceDetails" component={ServiceDetailsScreen} />
      <Stack.Screen name="Booking" component={BookingScreen} />
      <Stack.Screen name="BookingSuccess" component={BookingSuccessScreen} />
    </Stack.Navigator>
  );
};

export default HomeStackNavigator;
