import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

const CustomButton = ({ title, onPress, loading, style, textStyle, variant = 'primary' }) => {
  const isSecondary = variant === 'secondary';
  const isOutline = variant === 'outline';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      style={[
        styles.button,
        isSecondary && styles.secondary,
        isOutline && styles.outline,
        style
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isOutline ? COLORS.primary : '#FFF'} />
      ) : (
        <Text style={[
          styles.text,
          isOutline && styles.outlineText,
          textStyle
        ]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  secondary: {
    backgroundColor: COLORS.secondary,
    shadowColor: COLORS.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
    elevation: 0,
    shadowOpacity: 0,
  },
  text: {
    color: '#FFF',
    fontSize: SIZES.body1,
    fontWeight: '600',
  },
  outlineText: {
    color: COLORS.primary,
  }
});

export default CustomButton;
