import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';

import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import MFAScreen from '../screens/MFAScreen';
import MainTabNavigator from './MainTabNavigator';
import ProviderTabNavigator from './ProviderTabNavigator';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="MFA" component={MFAScreen} />
          </>
        ) : (
          <Stack.Screen 
            name="Main" 
            component={user?.role === 'provider' ? ProviderTabNavigator : MainTabNavigator} 
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
