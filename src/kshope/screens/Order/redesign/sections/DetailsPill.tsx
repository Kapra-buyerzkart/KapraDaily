import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { HOME_FONTS } from '../../../Home/redesign/theme';
import { ORDER_COLORS, fs, s } from './theme';

type Props = {
  onPress: () => void;
  testID?: string;
};

const DetailsPill: React.FC<Props> = ({ onPress, testID }) => (
  <TouchableOpacity
    testID={testID}
    activeOpacity={0.8}
    onPress={onPress}
    style={styles.pill}
  >
    <Text style={styles.label}>Details</Text>
    <Ionicons name="arrow-forward" size={fs(13)} color="#FFFFFF" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: ORDER_COLORS.accent,
    borderRadius: s(6),
    paddingHorizontal: s(12),
    paddingVertical: s(8),
  },
  label: {
    fontFamily: HOME_FONTS.semiBold,
    fontSize: fs(12),
    color: '#FFFFFF',
    marginRight: s(8),
  },
});

export default DetailsPill;
