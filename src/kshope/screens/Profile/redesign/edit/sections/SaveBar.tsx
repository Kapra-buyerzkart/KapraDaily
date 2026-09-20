import React from 'react';
import { StyleSheet, Platform, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { EDIT_COLORS, EDIT_FONTS } from '../editTheme';

interface Props {
  enabled: boolean;
  loading?: boolean;
  onPress: () => void;
}

const SaveBar: React.FC<Props> = ({ enabled, loading, onPress }) => {
  const active = enabled && !loading;

  return (
    <SafeAreaView edges={['bottom']} style={styles.footer}>
      <TouchableOpacity
        activeOpacity={0.88}
        style={[styles.btn, !active && styles.btnDisabled]}
        onPress={onPress}
        disabled={!active}
        accessibilityRole="button"
        accessibilityLabel="Save changes"
        accessibilityState={{ disabled: !active, busy: !!loading }}
        accessibilityHint={
          enabled ? undefined : 'Available once you make changes'
        }
      >
        {loading ? (
          <ActivityIndicator size="small" color={EDIT_COLORS.white} />
        ) : (
          <MaterialCommunityIcons
            name={enabled ? 'check-circle-outline' : 'check'}
            size={wp('4.8%')}
            color={enabled ? EDIT_COLORS.goldMetallic : EDIT_COLORS.textFaint}
          />
        )}
        <Text
          style={[styles.btnText, !active && styles.btnTextDisabled]}
          numberOfLines={1}
        >
          {loading ? 'Saving…' : enabled ? 'Save Changes' : 'No Changes Yet'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default React.memo(SaveBar);

const styles = StyleSheet.create({
  footer: {
    backgroundColor: EDIT_COLORS.card,
    paddingHorizontal: wp('5%'),
    paddingTop: hp('1.5%'),
    borderTopWidth: 1,
    borderTopColor: EDIT_COLORS.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: EDIT_COLORS.emerald,
    borderRadius: 14,
    paddingVertical: hp('1.8%'),
    marginBottom: hp('1%'),
    borderWidth: 1,
    borderColor: 'rgba(182, 141, 64, 0.35)',
    gap: wp('2%'),
    ...Platform.select({
      ios: {
        shadowColor: EDIT_COLORS.emerald,
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
      },
      android: { elevation: 3 },
    }),
  },
  btnDisabled: {
    backgroundColor: EDIT_COLORS.well,
    borderColor: EDIT_COLORS.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  btnText: {
    fontFamily: EDIT_FONTS.bodySemiBold,
    fontSize: wp('4%'),
    color: EDIT_COLORS.white,
    letterSpacing: 0.3,
  },
  btnTextDisabled: {
    color: EDIT_COLORS.textFaint,
  },
});
