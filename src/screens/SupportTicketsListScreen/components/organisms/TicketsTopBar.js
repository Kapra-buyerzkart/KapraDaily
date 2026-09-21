import { Text, TouchableOpacity, Pressable, View } from 'react-native';
import React from 'react';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { MAX_FONT_SCALE } from '@/styles/homeTheme';
import { styles } from '../../styles';
import { LUXURY_COLORS } from '../../supportLuxuryTheme';

export default function TicketsTopBar({
  title,
  subtitle,
  onBack,
  onAdd,
  borderStyle,
}) {
  const insets = useSafeAreaInsets();
  const dynamicTopBarStyle = [
    styles.topBar,
    { paddingTop: insets.top ? insets.top + 8 : 14 },
  ];

  return (
    <Animated.View style={dynamicTopBarStyle}>
      <TouchableOpacity
        onPress={onBack}
        style={styles.backBtn}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        activeOpacity={0.7}
      >
        <Feather name="chevron-left" size={22} color={LUXURY_COLORS.emerald} />
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
        <MaterialCommunityIcons name="plus" size={16} color={LUXURY_COLORS.white} />
        <Text
          style={styles.topBarActionText}
          maxFontSizeMultiplier={MAX_FONT_SCALE}
        >
          New Ticket
        </Text>
      </Pressable>

      <Animated.View style={[styles.topBarBorder, borderStyle]} />
    </Animated.View>
  );
}
