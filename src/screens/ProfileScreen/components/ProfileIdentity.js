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
      <ProfileAvatarBadge size={wp('14.5%')} isPrivileged={isPrivileged} />

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

        {}
        {!!isPrivileged && (
          <View style={styles.privilegeChip}>
            <MaterialCommunityIcons
              name="crown"
              size={wp('2.7%')}
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
            size={wp('3.2%')}
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
