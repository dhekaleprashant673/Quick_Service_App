import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';

const SettingsScreen = ({ navigation }) => {
  const { isDarkMode } = useSelector((state) => state.theme);
  
  const [notifications, setNotifications] = useState({
    whatsapp: true,
    push: true,
    email: true,
    sms: true,
    voice: true
  });

  const toggleSwitch = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const SettingRow = ({ label, icon, value, onValueChange, type = 'switch' }) => (
    <View style={[styles.row, isDarkMode && { borderBottomColor: '#333' }]}>
      <View style={styles.rowLeft}>
        {icon}
        <Text style={[styles.rowLabel, isDarkMode && { color: '#FFF' }]}>{label}</Text>
      </View>
      {type === 'switch' ? (
        <Switch 
          value={value} 
          onValueChange={onValueChange}
          trackColor={{ false: '#767577', true: '#27AE60' }}
          thumbColor="#FFF"
        />
      ) : (
        <Ionicons name="chevron-forward" size={20} color={COLORS.gray[400]} />
      )}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, isDarkMode && { backgroundColor: '#121212' }]}>
      <View style={[styles.header, isDarkMode && { backgroundColor: '#1E1E1E', borderBottomWidth: 0 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={isDarkMode ? '#FFF' : COLORS.text} />
        </TouchableOpacity>
        <Text style={[styles.title, isDarkMode && { color: '#FFF' }]}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order related messages</Text>
          <Text style={styles.sectionSub}>Order related messages can't be turned off as they are important for service experience</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications & reminders</Text>
          <SettingRow 
            label="WhatsApp" 
            icon={<FontAwesome name="whatsapp" size={20} color="#25D366" style={styles.icon} />} 
            value={notifications.whatsapp} 
            onValueChange={() => toggleSwitch('whatsapp')}
          />
          <SettingRow 
            label="Push Notifications" 
            icon={<Ionicons name="notifications-outline" size={20} color="#000" style={styles.icon} />} 
            value={notifications.push} 
            onValueChange={() => toggleSwitch('push')}
          />
          <SettingRow 
            label="Email" 
            icon={<Ionicons name="mail-outline" size={20} color="#000" style={styles.icon} />} 
            value={notifications.email} 
            onValueChange={() => toggleSwitch('email')}
          />
          <SettingRow 
            label="SMS" 
            icon={<Ionicons name="chatbox-outline" size={20} color="#000" style={styles.icon} />} 
            value={notifications.sms} 
            onValueChange={() => toggleSwitch('sms')}
          />
          <SettingRow 
            label="Voice calls" 
            icon={<Ionicons name="call-outline" size={20} color="#000" style={styles.icon} />} 
            value={notifications.voice} 
            onValueChange={() => toggleSwitch('voice')}
          />
        </View>

        <TouchableOpacity style={styles.section}>
           <SettingRow 
              label="Privacy & data" 
              icon={<Ionicons name="shield-checkmark-outline" size={20} color="#000" style={styles.icon} />} 
              type="link"
           />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  section: {
    padding: 20,
    borderBottomWidth: 8,
    borderBottomColor: '#F5F6FA',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  sectionSub: {
    fontSize: 13,
    color: '#636E72',
    lineHeight: 18,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowLabel: {
    fontSize: 14,
    color: '#2D3436',
    marginLeft: 15,
  },
  icon: {
    width: 24,
    textAlign: 'center',
  }
});

export default SettingsScreen;
