import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { useSelector } from 'react-redux';
import ProviderHomeScreen from '../screens/ProviderHomeScreen';
import ChatStackNavigator from './ChatStackNavigator';
import ProfileStackNavigator from './ProfileStackNavigator';

const Tab = createBottomTabNavigator();

const ProviderTabNavigator = () => {
  const { isDarkMode } = useSelector((state) => state.theme);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Dashboard') iconName = focused ? 'speedometer' : 'speedometer-outline';
          else if (route.name === 'Chat') iconName = focused ? 'chatbubble' : 'chatbubble-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';

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
      <Tab.Screen name="Dashboard" component={ProviderHomeScreen} />
      <Tab.Screen name="Chat" component={ChatStackNavigator} />
      <Tab.Screen name="Profile" component={ProfileStackNavigator} />
    </Tab.Navigator>
  );
};

export default ProviderTabNavigator;
