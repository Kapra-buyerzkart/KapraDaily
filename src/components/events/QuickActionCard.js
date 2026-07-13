import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const QuickActionCard = ({ icon, title, onPress }) => (
  <TouchableOpacity activeOpacity={0.85} style={styles.card} onPress={onPress}>
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Image source={icon} style={styles.icon} resizeMode="contain" />
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
      </View>

      <View style={styles.arrow}>
        <MaterialIcons name="arrow-forward-ios" size={16} color="#FFFFFF" />
      </View>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'space-between',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  icon: {
    width: 22,
    height: 22,
    top: 2,
    resizeMode: 'contain',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: 'Gilroy-SemiBold',
    lineHeight: 18,
    paddingLeft: 10,
    marginTop: 12,
  },
  arrow: {
    top: 2,
    borderRadius: 18,
    backgroundColor: '#6E34C0',
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default QuickActionCard;
