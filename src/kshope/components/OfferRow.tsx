import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { AppText, Badge, IconDisc } from './atoms';
import {
  UI_COLORS,
  UI_RADIUS,
  UI_SPACING,
  hitSlopTo,
  hp,
  wp,
} from '../theme/tokens';

const ICON_TONES: Record<string, { disc: string; color: string }> = {
  brand: { disc: 'brand', color: UI_COLORS.primary },
  ink: { disc: 'ink', color: UI_COLORS.ink },
  pink: { disc: 'pink', color: UI_COLORS.pink },
  token: { disc: 'token', color: UI_COLORS.token },
  success: { disc: 'success', color: UI_COLORS.successDeep },
};

export interface OfferRowProps {
  iconName: string;
  iconTone?: keyof typeof ICON_TONES;
  title: string;
  subtitle?: string;
  appliedLabel?: string | null;
  appliedSubtitle?: string;
  isApplied?: boolean;
  onPress?: () => void;
  onRemove?: () => void;
  removeLabel?: string;
}

const OfferRow: React.FC<OfferRowProps> = ({
  iconName,
  iconTone = 'brand',
  title,
  subtitle,
  appliedLabel,
  appliedSubtitle,
  isApplied = false,
  onPress,
  onRemove,
  removeLabel = 'Remove',
}) => {
  const tone = ICON_TONES[iconTone] || ICON_TONES.brand;
  const Wrapper: React.ElementType = isApplied ? View : TouchableOpacity;
  const wrapperProps = isApplied
    ? {}
    : { activeOpacity: 0.75, onPress, accessibilityRole: 'button' as const };

  return (
    <Wrapper style={styles.row} {...wrapperProps}>
      <IconDisc size={wp('9.5%')} tone={isApplied ? 'success' : tone.disc}>
        <MaterialCommunityIcons
          name={iconName}
          size={wp('5%')}
          color={isApplied ? UI_COLORS.successDeep : tone.color}
        />
      </IconDisc>

      <View style={styles.details}>
        <AppText variant="labelStrong">{title}</AppText>
        {isApplied ? (
          <View style={styles.appliedRow}>
            {appliedLabel ? (
              <Badge tone="neutral" label={appliedLabel} />
            ) : null}
            <Badge
              tone="success"
              label={appliedSubtitle || 'Applied'}
              icon={
                <MaterialCommunityIcons
                  name="check-circle"
                  size={wp('3%')}
                  color={UI_COLORS.successDeep}
                />
              }
            />
          </View>
        ) : (
          <AppText variant="micro" tone="muted" numberOfLines={1}>
            {subtitle}
          </AppText>
        )}
      </View>

      {isApplied ? (
        <TouchableOpacity
          activeOpacity={0.75}
          style={styles.removeButton}
          onPress={onRemove}
          hitSlop={hitSlopTo(hp('3.2%'))}
          accessibilityRole="button"
          accessibilityLabel={`${removeLabel} ${title}`}
        >
          <MaterialCommunityIcons
            name="close"
            size={wp('3.2%')}
            color={UI_COLORS.danger}
          />
          <AppText variant="micro" tone="danger">
            {removeLabel}
          </AppText>
        </TouchableOpacity>
      ) : (
        <AntDesign
          name="right"
          size={wp('3.4%')}
          color={UI_COLORS.textFaint}
        />
      )}
    </Wrapper>
  );
};

export default React.memo(OfferRow);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: UI_SPACING.md,
    paddingVertical: hp('1.2%'),
    paddingHorizontal: UI_SPACING.lg,
  },
  details: {
    flex: 1,
    gap: 2,
  },
  appliedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: UI_SPACING.sm,
    flexWrap: 'wrap',
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: UI_SPACING.xs / 2,
    paddingHorizontal: UI_SPACING.sm,
    paddingVertical: UI_SPACING.xs,
    borderRadius: UI_RADIUS.pill,
    borderWidth: 1,
    borderColor: UI_COLORS.danger,
    backgroundColor: UI_COLORS.dangerTint,
  },
});
