import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { AppText } from '../../../components/atoms';
import { hitSlopTo } from '../../../theme/tokens';
import { PALETTE, SPACING } from '../theme';

interface SheetHeaderProps {
  title: string;
  caption?: string;
  onClose: () => void;
}

const SheetHeader: React.FC<SheetHeaderProps> = ({
  title,
  caption,
  onClose,
}) => (
  <View style={styles.header}>
    <View style={styles.copy}>
      <AppText variant="title">{title}</AppText>
      {caption ? (
        <AppText variant="caption" tone="muted" style={styles.caption}>
          {caption}
        </AppText>
      ) : null}
    </View>

    <TouchableOpacity
      style={styles.close}
      hitSlop={hitSlopTo(30)}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityLabel="Close"
      onPress={onClose}
    >
      <AntDesign name="close" size={15} color={PALETTE.textSecondary} />
    </TouchableOpacity>
  </View>
);

export default React.memo(SheetHeader);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: PALETTE.line,
  },
  copy: {
    flex: 1,
    paddingRight: SPACING.md,
  },
  caption: {
    marginTop: 3,
  },
  close: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PALETTE.well,
  },
});
