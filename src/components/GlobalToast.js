import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming, 
  withDelay,
  FadeInUp,
  FadeOutUp
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

const GlobalToast = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState({ title: '', message: '', type: 'info' });

  useImperativeHandle(ref, () => ({
    show: (title, message, type = 'info') => {
      setData({ title, message, type });
      setVisible(true);
      setTimeout(() => setVisible(false), 4000);
    }
  }));

  if (!visible) return null;

  const getIcon = () => {
    switch (data.type) {
      case 'success': return 'checkmark-circle';
      case 'error': return 'alert-circle';
      default: return 'notifications';
    }
  };

  const getColor = () => {
    switch (data.type) {
      case 'success': return COLORS.success;
      case 'error': return COLORS.error;
      default: return COLORS.primary;
    }
  };

  return (
    <Animated.View 
      entering={FadeInUp} 
      exiting={FadeOutUp}
      style={styles.container}
    >
      <View style={[styles.toast, { borderLeftColor: getColor() }]}>
        <Ionicons name={getIcon()} size={24} color={getColor()} />
        <View style={styles.content}>
          <Text style={styles.title}>{data.title}</Text>
          <Text style={styles.message}>{data.message}</Text>
        </View>
      </View>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    zIndex: 9999,
  },
  toast: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    borderLeftWidth: 5,
  },
  content: {
    marginLeft: 12,
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  message: {
    fontSize: 12,
    color: '#636E72',
    marginTop: 2,
  }
});

export default GlobalToast;
