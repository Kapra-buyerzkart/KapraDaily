import React from 'react';
import { StyleSheet, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import AddrText from './AddrText';
import { COLORS, SPACING, wp } from '../../theme';

const FieldError = ({ message, style }) => {
  if (!message) return null;

  return (
    <View
      accessibilityLiveRegion="polite"
      accessibilityRole="alert"
      style={[styles.row, style]}
    >
      <Ionicons
        name="alert-circle"
        size={wp('3.6%')}
        color={COLORS.danger}
        style={styles.icon}
      />
      <AddrText variant="micro" tone="danger" style={styles.text}>
        {message}
      </AddrText>
    </View>
  );
};

export default React.memo(FieldError);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
    paddingHorizontal: SPACING.xs,
  },
  icon: {
    marginRight: SPACING.xs,
  },
  text: {
    flex: 1,
  },
});
