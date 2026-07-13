import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

const EmptyState = ({ icon, title, subtitle }) => (
  <View style={styles.container}>
    <View style={styles.badge}>
      <Text style={styles.badgeText}>Coming Soon</Text>
    </View>
    {!!icon && <Image source={icon} style={styles.icon} resizeMode="contain" />}
    {!!title && <Text style={styles.title}>{title}</Text>}
    {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 72,
    paddingHorizontal: 40,
  },
  badge: {
    backgroundColor: 'rgba(154,92,255,0.18)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 20,
  },
  badgeText: {
    color: '#C9A6FF',
    fontSize: 11,
    fontFamily: 'Gilroy-Bold',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  icon: {
    width: 64,
    height: 64,
    opacity: 0.6,
    marginBottom: 20,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Gilroy-Bold',
    marginBottom: 8,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
    fontFamily: 'Gilroy-Regular',
    textAlign: 'center',
    lineHeight: 19,
  },
});

export default EmptyState;
