import React from 'react';
import { StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppText } from '../../../../../components/atoms';
import { PressableScale } from '../../atoms';
import {
  UI_COLORS,
  UI_ELEVATION,
  UI_RADIUS,
  UI_SPACING,
  hp,
  wp,
} from '../../../../../theme/tokens';

interface Props {
  enabled: boolean;
  loading?: boolean;
  onPress: () => void;
}

const SaveBar: React.FC<Props> = ({ enabled, loading, onPress }) => {
  const active = enabled && !loading;

  return (
    <SafeAreaView edges={['bottom']} style={styles.footer}>
      <PressableScale
        to={0.98}
        contentStyle={[styles.btn, !active && styles.btnDisabled]}
        onPress={onPress}
        disabled={!active}
        accessibilityRole="button"
        accessibilityLabel="Save changes"
        accessibilityState={{ disabled: !active, busy: !!loading }}
        accessibilityHint={
          enabled ? undefined : 'Available once you change something'
        }
      >
        {loading ? (
          <ActivityIndicator size="small" color={UI_COLORS.textFaint} />
        ) : (
          <MaterialCommunityIcons
            name={enabled ? 'check-circle-outline' : 'check'}
            size={wp('4.4%')}
            color={enabled ? UI_COLORS.onPrimary : UI_COLORS.textFaint}
          />
        )}
        <AppText
          variant="cta"
          tone={active ? 'onDark' : 'faint'}
          numberOfLines={1}
        >
          {loading
            ? 'Saving…'
            : enabled
            ? 'Save Changes'
            : 'No Changes Yet'}
        </AppText>
      </PressableScale>
    </SafeAreaView>
  );
};

export default React.memo(SaveBar);

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
