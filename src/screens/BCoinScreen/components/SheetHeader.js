import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { FONTS } from '@/styles/typography';

import { PALETTE } from '../theme';

const SheetHeader = ({ title, caption, onClose }) => (
  <View style={styles.header}>
    <View style={styles.copy}>
      <Text style={styles.title}>{title}</Text>
      {caption ? <Text style={styles.caption}>{caption}</Text> : null}
    </View>

    <TouchableOpacity
      style={styles.close}
      hitSlop={12}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityLabel="Close"
      onPress={onClose}
    >
      <AntDesign name="close" size={15} color={PALETTE.textSecondary} />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: PALETTE.line,
  },
  copy: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: 17,
    color: PALETTE.textPrimary,
  },
  caption: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: 12,
    color: PALETTE.textMuted,
    marginTop: 3,
  },
  close: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PALETTE.canvas,
  },
});

export default React.memo(SheetHeader);
