import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { AppText } from '../../../../../components/atoms';
import { AppIcons } from '../../../../../assets/icons';
import {
  UI_COLORS,
  UI_RADIUS,
  UI_SPACING,
  hitSlopTo,
  hp,
} from '../../../../../theme/tokens';

interface Props {
  isPhone: boolean;
  step: number;
  totalSteps: number;
  onBack: () => void;
}

const UpdateContactHeader: React.FC<Props> = ({
  isPhone,
  step,
  totalSteps,
  onBack,
}) => (
  <View style={styles.header}>
    <TouchableOpacity
      onPress={onBack}
      style={styles.backBtn}
      hitSlop={hitSlopTo(24)}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel="Go back"
    >
      <AppIcons.ArrowBack size={22} color={UI_COLORS.textPrimary} />
    </TouchableOpacity>

    <View style={styles.titleBlock}>
      <AppText variant="title" accessibilityRole="header">
        {isPhone ? 'Change Number' : 'Change Email'}
      </AppText>
      <AppText variant="caption" tone="muted">
        {step === 1 ? 'Enter new details' : 'Verify with OTP'}
      </AppText>
    </View>

    <View style={styles.stepChip}>
      <AppText variant="micro" tone="muted">
        Step {step} of {totalSteps}
      </AppText>
    </View>
  </View>
);

export default React.memo(UpdateContactHeader);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: UI_SPACING.lg,
    paddingVertical: hp('1.2%'),
    backgroundColor: UI_COLORS.card,
    gap: UI_SPACING.sm,
  },
  backBtn: {
    padding: UI_SPACING.xs,
  },
  titleBlock: {
    flex: 1,
    marginLeft: UI_SPACING.xs,
  },
  stepChip: {
    backgroundColor: UI_COLORS.well,
    borderRadius: UI_RADIUS.pill,
    paddingHorizontal: UI_SPACING.md,
    paddingVertical: hp('0.7%'),
  },
});
