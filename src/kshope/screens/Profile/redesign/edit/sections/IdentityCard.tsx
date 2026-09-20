import React from 'react';
import { View, StyleSheet, LayoutChangeEvent, Text, Platform } from 'react-native';
import Animated from 'react-native-reanimated';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ProfileAvatarBadge from '../../../../../components/ProfileAvatarBadge';
import { EDIT_COLORS, EDIT_FONTS } from '../editTheme';

interface Props {
  name: string;
  phone?: string;
  onMeasure?: (bottom: number) => void;
  entering?: any;
}

const IdentityCard: React.FC<Props> = ({
  name,
  phone,
  onMeasure,
  entering,
}) => {
  const trimmed = (name || '').trim();

  const handleLayout = React.useCallback(
    (event: LayoutChangeEvent) => {
      const { y, height } = event.nativeEvent.layout;
      onMeasure?.(y + height);
    },
    [onMeasure],
  );

  return (
    <Animated.View onLayout={handleLayout} entering={entering}>
      <View style={styles.card}>
        <View style={styles.row}>
          <ProfileAvatarBadge size={wp('13%')} />

          <View style={styles.copy}>
            <Text style={styles.name} numberOfLines={1}>
              {trimmed || 'Your Name'}
            </Text>
            {!!phone && (
              <Text style={styles.phone} numberOfLines={1}>
                +91 {phone}
              </Text>
            )}
          </View>

          <View style={styles.memberBadge}>
            <MaterialCommunityIcons
              name="check-decagram"
              size={wp('3.4%')}
              color={EDIT_COLORS.emerald}
            />
            <Text style={styles.memberBadgeText}>Active</Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

export default React.memo(IdentityCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: EDIT_COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: EDIT_COLORS.border,
    paddingHorizontal: wp('4.5%'),
    paddingVertical: hp('1.8%'),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 5,
      },
      android: {
        elevation: 1.5,
      },
    }),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('3.5%'),
  },
  copy: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontFamily: EDIT_FONTS.heading,
    fontSize: wp('4.8%'),
    color: EDIT_COLORS.textPrimary,
  },
  phone: {
    fontFamily: EDIT_FONTS.body,
    fontSize: wp('3%'),
    color: EDIT_COLORS.textMuted,
    marginTop: hp('0.2%'),
  },
  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: EDIT_COLORS.emeraldTint,
    paddingHorizontal: wp('2.5%'),
    paddingVertical: hp('0.4%'),
    borderRadius: 999,
    gap: wp('1%'),
  },
  memberBadgeText: {
    fontFamily: EDIT_FONTS.bodyMedium,
    fontSize: wp('2.8%'),
    color: EDIT_COLORS.emerald,
  },
});
