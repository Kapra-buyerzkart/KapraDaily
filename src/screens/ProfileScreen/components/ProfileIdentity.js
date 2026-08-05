import { View, Text, Pressable } from 'react-native';
import React from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import ProfileAvatarBadge from '../../../components/ProfileAvatarBadge';
import { styles, PRIVILEGE_INK } from '../styles';
import { ACCENT, MAX_FONT_SCALE } from '@/styles/homeTheme';
import { PRESS_IN, PRESS_OUT } from '../motion';

// `onMeasure` reports the bottom edge of the identity *row*, not of the hero.
// The bar swaps its title the moment the real name goes behind it, so the
// anchor has to track the name — the hero's own padding, which is there to let
// the gradient resolve, would push that swap later than the eye expects it.
export default function ProfileIdentity({
  profile,
  onEditProfile,
  isPrivileged,
  onMeasure,
  entering,
}) {
  const chipScale = useSharedValue(1);
  const chipStyle = useAnimatedStyle(() => ({
    transform: [{ scale: chipScale.value }],
  }));

  const handleLayout = React.useCallback(
    event => {
      const { y, height } = event.nativeEvent.layout;
      onMeasure?.(y + height);
    },
    [onMeasure],
  );

  return (
    <Animated.View
      style={styles.identityRow}
      onLayout={handleLayout}
      entering={entering}
    >
      <ProfileAvatarBadge size={wp('18%')} isPrivileged={isPrivileged} />

      <View style={styles.identityText}>
        <Text
          style={styles.userNameText}
          numberOfLines={1}
          maxFontSizeMultiplier={MAX_FONT_SCALE}
        >
          {profile?.custName}
        </Text>
        <Text
          style={styles.phoneNumberStyle}
          numberOfLines={1}
          maxFontSizeMultiplier={MAX_FONT_SCALE}
        >
          {profile?.phoneNo}
        </Text>

        {/* The crown on the avatar says the account is privileged; this says
            what that is. Only drawn when it applies, so an ordinary profile
            keeps the tighter two-line block. */}
        {!!isPrivileged && (
          <View style={styles.privilegeChip}>
            <MaterialCommunityIcons
              name="crown"
              size={wp('2.9%')}
              color={PRIVILEGE_INK}
            />
            <Text
              style={styles.privilegeChipText}
              maxFontSizeMultiplier={MAX_FONT_SCALE}
            >
              Privilege Member
            </Text>
          </View>
        )}
      </View>

      <Pressable
        onPress={onEditProfile}
        onPressIn={() => {
          chipScale.value = withTiming(0.94, PRESS_IN);
        }}
        onPressOut={() => {
          chipScale.value = withSpring(1, PRESS_OUT);
        }}
        accessibilityRole="button"
        accessibilityLabel="Edit profile"
      >
        <Animated.View style={[styles.editChip, chipStyle]}>
          <MaterialCommunityIcons
            name="pencil-outline"
            size={wp('3.6%')}
            color={ACCENT.primary}
          />
          <Text
            style={styles.editChipText}
            maxFontSizeMultiplier={MAX_FONT_SCALE}
          >
            Edit
          </Text>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}
