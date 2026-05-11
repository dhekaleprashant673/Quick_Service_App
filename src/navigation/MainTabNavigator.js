import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import { COLORS } from '../constants/theme';
import { useSelector } from 'react-redux';
import HomeStackNavigator from './HomeStackNavigator';
import BookingStackNavigator from './BookingStackNavigator';
import ChatStackNavigator from './ChatStackNavigator';
import ProfileStackNavigator from './ProfileStackNavigator';
import RewardsScreen from '../screens/RewardsScreen';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  const { isDarkMode } = useSelector((state) => state.theme);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Bookings') iconName = focused ? 'calendar' : 'calendar-outline';
          else if (route.name === 'Rewards') iconName = focused ? 'wallet' : 'wallet-outline';
          else if (route.name === 'Chat') iconName = focused ? 'chatbubble' : 'chatbubble-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';

          if (route.name === 'Chat') {
            return (
              <View>
                <Ionicons name={focused ? 'chatbubble' : 'chatbubble-outline'} size={size} color={color} />
                <View style={{
                  position: 'absolute',
                  right: -6,
                  top: -3,
                  backgroundColor: COLORS.error,
                  borderRadius: 6,
                  width: 12,
                  height: 12,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 2,
                  borderColor: isDarkMode ? '#1E1E1E' : '#FFF'
                }} />
              </View>
            );
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: isDarkMode ? '#888' : COLORS.textSecondary,
        tabBarStyle: {
          height: 60,
          paddingBottom: 10,
          backgroundColor: isDarkMode ? '#1E1E1E' : COLORS.surface,
          borderTopColor: isDarkMode ? '#333' : COLORS.gray[100],
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Bookings" component={BookingStackNavigator} />
      <Tab.Screen name="Rewards" component={RewardsScreen} />
      <Tab.Screen name="Chat" component={ChatStackNavigator} />
      <Tab.Screen name="Profile" component={ProfileStackNavigator} />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
