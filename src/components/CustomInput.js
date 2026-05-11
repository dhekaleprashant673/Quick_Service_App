import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

const CustomInput = ({ label, placeholder, value, onChangeText, error, secureTextEntry, style, containerStyle, ...props }) => {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputContainer, containerStyle, error && styles.errorBorder]}>
        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          placeholderTextColor={COLORS.textSecondary}
          style={styles.input}
          {...props}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    width: '100%',
  },
  label: {
    fontSize: SIZES.body2,
    color: COLORS.text,
    marginBottom: 8,
    fontWeight: '500',
  },
  inputContainer: {
    height: 56,
    backgroundColor: COLORS.gray[100],
    borderRadius: SIZES.radius,
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  input: {
    fontSize: SIZES.body1,
    color: COLORS.text,
  },
  errorBorder: {
    borderColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    fontSize: SIZES.caption,
    marginTop: 4,
  }
});

export default CustomInput;
