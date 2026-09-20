import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Platform } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { EDIT_COLORS, EDIT_FONTS } from '../editTheme';

interface Props {
  onBack: () => void;
  backgroundStyle?: any;
  borderStyle?: any;
}

const EditProfileHeader: React.FC<Props> = ({
  onBack,
  backgroundStyle,
  borderStyle,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <Animated.View
      style={[
        styles.header,
        backgroundStyle,
        { paddingTop: insets.top + hp('0.8%') },
      ]}
    >
      <TouchableOpacity
        onPress={onBack}
        style={styles.backBtn}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Feather name="chevron-left" size={wp('5.5%')} color={EDIT_COLORS.emerald} />
      </TouchableOpacity>

      <View style={styles.titleBlock}>
        <Text style={styles.title} numberOfLines={1} accessibilityRole="header">
          Edit Profile
        </Text>
      </View>

      <View style={styles.headerRightPlaceholder} />

      <Animated.View style={[styles.border, borderStyle]} />
    </Animated.View>
  );
};

export default React.memo(EditProfileHeader);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp('5%'),
    paddingBottom: hp('1.4%'),
    backgroundColor: EDIT_COLORS.canvas,
  },
  backBtn: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('5%'),
    backgroundColor: EDIT_COLORS.card,
    borderWidth: 1,
    borderColor: EDIT_COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  titleBlock: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: EDIT_FONTS.title,
    fontSize: wp('5.5%'),
    color: EDIT_COLORS.emerald,
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  headerRightPlaceholder: {
    width: wp('10%'),
  },
  border: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 1,
    backgroundColor: EDIT_COLORS.border,
  },
});
