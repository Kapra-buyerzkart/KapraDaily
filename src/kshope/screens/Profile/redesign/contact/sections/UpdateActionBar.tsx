import React from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { CONTACT_COLORS, CONTACT_FONTS } from '../contactTheme';

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
      activeOpacity={0.88}
      style={[styles.btn, !enabled && styles.btnDisabled]}
      onPress={onPress}
      disabled={!enabled || loading}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !enabled }}
      accessibilityHint={enabled ? undefined : hint}
    >
      {loading ? (
        <ActivityIndicator color={CONTACT_COLORS.white} />
      ) : (
        <>
          <Text
            style={[styles.btnText, !enabled && styles.btnTextDisabled]}
            numberOfLines={1}
          >
            {enabled ? label : hint}
          </Text>
          {enabled && (
            <Feather
              name="arrow-right"
              size={wp('4.4%')}
              color={CONTACT_COLORS.white}
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
    backgroundColor: CONTACT_COLORS.card,
    paddingHorizontal: wp('5%'),
    paddingTop: hp('1.5%'),
    borderTopWidth: 1,
    borderTopColor: CONTACT_COLORS.border,
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
    backgroundColor: CONTACT_COLORS.emerald,
    borderRadius: 14,
    paddingVertical: hp('1.8%'),
    marginBottom: hp('1%'),
    borderWidth: 1,
    borderColor: 'rgba(182, 141, 64, 0.35)',
    gap: wp('2%'),
    ...Platform.select({
      ios: {
        shadowColor: CONTACT_COLORS.emerald,
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
      },
      android: { elevation: 3 },
    }),
  },
  btnDisabled: {
    backgroundColor: CONTACT_COLORS.well,
    borderColor: CONTACT_COLORS.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  btnText: {
    fontFamily: CONTACT_FONTS.bodySemiBold,
    fontSize: wp('4%'),
    color: CONTACT_COLORS.white,
    letterSpacing: 0.3,
  },
  btnTextDisabled: {
    color: CONTACT_COLORS.textFaint,
  },
});
