import React from 'react';
import { ActivityIndicator, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { AppText } from '../../../../../components/atoms';
import {
  UI_COLORS,
  UI_ELEVATION,
  UI_RADIUS,
  UI_SPACING,
  wp,
  hp,
} from '../../../../../theme/tokens';

interface Props {
  enabled: boolean;
  label: string;
  hint?: string;
  loading?: boolean;
  onPress: () => void;
}

const UpdateActionBar: React.FC<Props> = ({
  enabled,
  label,
  hint,
  loading,
  onPress,
}) => (
  <SafeAreaView edges={['bottom']} style={styles.footer}>
    <TouchableOpacity
      activeOpacity={0.9}
      style={[styles.btn, !enabled && styles.btnDisabled]}
      onPress={onPress}
      disabled={!enabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !enabled }}
      accessibilityHint={enabled ? undefined : hint}
    >
      {loading ? (
        <ActivityIndicator color={UI_COLORS.onPrimary} />
      ) : (
        <>
          <AppText
            variant="cta"
            tone={enabled ? 'onDark' : 'faint'}
            numberOfLines={1}
          >
            {enabled ? label : hint}
          </AppText>
          {enabled && (
            <AntDesign
              name="arrowright"
              size={wp('4%')}
              color={UI_COLORS.onPrimary}
            />
          )}
        </>
      )}
    </TouchableOpacity>
  </SafeAreaView>
);

export default React.memo(UpdateActionBar);

const styles = StyleSheet.create({
  footer: {
    backgroundColor: UI_COLORS.card,
    paddingHorizontal: UI_SPACING.lg,
    paddingTop: UI_SPACING.md,
    borderTopLeftRadius: UI_RADIUS.card,
    borderTopRightRadius: UI_RADIUS.card,
    ...UI_ELEVATION.bar,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: UI_SPACING.sm,
    backgroundColor: UI_COLORS.primary,
    borderRadius: UI_RADIUS.button,
    paddingHorizontal: UI_SPACING.lg,
    paddingVertical: hp('1.6%'),
    marginBottom: UI_SPACING.md,
    ...Platform.select({
      ios: {
        shadowColor: UI_COLORS.primary,
        shadowOpacity: 0.22,
        shadowOffset: { width: 0, height: 6 },
        shadowRadius: 12,
      },
      android: { elevation: 1 },
    }),
  },
  btnDisabled: {
    backgroundColor: UI_COLORS.well,
    shadowOpacity: 0,
    elevation: 0,
  },
});
