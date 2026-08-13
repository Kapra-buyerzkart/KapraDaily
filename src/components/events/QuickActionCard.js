import COLORS from '@/styles/colors';
import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const QuickActionCard = ({ icon, title, onPress }) => (
  <TouchableOpacity activeOpacity={0.85} style={styles.card} onPress={onPress}>
    <View style={styles.background}>
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
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(105, 102, 102, 0.08)',
    overflow: 'hidden',
  },
  background: {
    padding: 16,
    justifyContent: 'space-between',
    backgroundColor: '#08081A',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  icon: {
    width: 53,
    height: 41,
  },
  title: {
    color: '#FFFFFF',
    fontFamily: 'Gilroy-SemiBold',
    lineHeight: 18,
    paddingLeft: 10,
  },
  arrow: {
    borderRadius: 18,
    backgroundColor: COLORS.purple,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default React.memo(QuickActionCard);
