import { Text, TouchableOpacity, Image, Pressable, View } from 'react-native';
import React from 'react';
import Animated from 'react-native-reanimated';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import icons from '@/assets/icons';
import { INK, MAX_FONT_SCALE, SPACE, hitSlopTo } from '@/styles/homeTheme';
import { ICON, styles } from '../../styles';

export default function TicketsTopBar({
  title,
  subtitle,
  onBack,
  onAdd,
  borderStyle,
}) {
  const insets = useSafeAreaInsets();

  return (
    <Animated.View
      style={[styles.topBar, { paddingTop: insets.top + SPACE.md }]}
    >
      <TouchableOpacity
        hitSlop={hitSlopTo(wp('6%'))}
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Image source={icons.backArrowNew} style={styles.backIcon} />
      </TouchableOpacity>

      <View style={styles.topBarCopy}>
        <Text
          style={styles.topBarTitle}
          numberOfLines={1}
          maxFontSizeMultiplier={MAX_FONT_SCALE}
          accessibilityRole="header"
        >
          {title}
        </Text>
        {subtitle ? (
          <Text
            style={styles.topBarSubtitle}
            numberOfLines={1}
            maxFontSizeMultiplier={MAX_FONT_SCALE}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>

      <Pressable
        onPress={onAdd}
        accessibilityRole="button"
        accessibilityLabel="Raise a new ticket"
        style={({ pressed }) => [
          styles.topBarAction,
          pressed && styles.topBarActionPressed,
        ]}
      >
        <MaterialCommunityIcons name="plus" size={ICON.plus} color={INK.base} />
        <Text
          style={styles.topBarActionText}
          maxFontSizeMultiplier={MAX_FONT_SCALE}
        >
          New
        </Text>
      </Pressable>

      <Animated.View style={[styles.topBarBorder, borderStyle]} />
    </Animated.View>
  );
}
