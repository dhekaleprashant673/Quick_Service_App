import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BookingHistoryScreen from '../screens/BookingHistoryScreen';
import BookingDetailScreen from '../screens/BookingDetailScreen';

const Stack = createStackNavigator();

const BookingStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BookingList" component={BookingHistoryScreen} />
      <Stack.Screen name="BookingDetail" component={BookingDetailScreen} />
    </Stack.Navigator>
  );
};

export default BookingStackNavigator;
