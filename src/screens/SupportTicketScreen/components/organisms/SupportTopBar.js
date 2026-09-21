import { Text, TouchableOpacity } from 'react-native';
import React from 'react';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import { MAX_FONT_SCALE } from '@/styles/homeTheme';
import { styles } from '../../styles';
import { LUXURY_COLORS } from '../../SupportTicketsListScreen/supportLuxuryTheme';

export default function SupportTopBar({ title, onBack, borderStyle }) {
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

      <Text
        style={styles.topBarTitle}
        numberOfLines={1}
        maxFontSizeMultiplier={MAX_FONT_SCALE}
        accessibilityRole="header"
      >
        {title}
      </Text>

      <Animated.View style={[styles.topBarBorder, borderStyle]} />
    </Animated.View>
  );
}
