import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { FONTS } from '@/styles/typography';

const ProfileHeaderBar = ({ onBack }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + 6 }]}>
      <TouchableOpacity
        onPress={onBack}
        style={styles.backBtn}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <MaterialCommunityIcons name="chevron-left" size={32} color="#111111" />
      </TouchableOpacity>

      <Text style={styles.title}>Profile</Text>
      <Text style={styles.subtitle}>Your Account, Your Way</Text>
    </View>
  );
};

export default React.memo(ProfileHeaderBar);

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  backBtn: {
    alignSelf: 'flex-start',
    marginBottom: 8,
    marginLeft: -10,
    padding: 2,
  },
  title: {
    fontSize: 22,
    fontFamily: FONTS.gilroy.bold,
    color: '#111111',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: FONTS.gilroy.medium,
    color: '#8E8E93',
    marginTop: 3,
  },
});
