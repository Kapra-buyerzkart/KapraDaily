import { View, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import Animated from 'react-native-reanimated';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import icons from '@/assets/icons';
import { styles } from '../styles';
import { MAX_FONT_SCALE, SPACE, hitSlopTo } from '@/styles/homeTheme';

export default function ProfileTopBar({
  name,
  onBack,
  backgroundStyle,
  borderStyle,
  titleStyle,
  nameStyle,
}) {
  const insets = useSafeAreaInsets();

  return (
    <Animated.View
      style={[
        styles.topBar,
        backgroundStyle,
        { paddingTop: insets.top + SPACE.sm },
      ]}
    >
      <TouchableOpacity
        hitSlop={hitSlopTo(wp('6%'))}
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Image source={icons.backArrowNew} style={styles.backIcon} />
      </TouchableOpacity>

      <View style={styles.topBarTitle}>
        <Animated.Text
          style={[styles.profileHeaderText, titleStyle]}
          numberOfLines={1}
          maxFontSizeMultiplier={MAX_FONT_SCALE}
          accessibilityRole="header"
        >
          Profile
        </Animated.Text>
        {}
        <Animated.Text
          style={[styles.profileHeaderText, styles.topBarName, nameStyle]}
          numberOfLines={1}
          maxFontSizeMultiplier={MAX_FONT_SCALE}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          {name}
        </Animated.Text>
      </View>

      <Animated.View style={[styles.topBarBorder, borderStyle]} />
    </Animated.View>
  );
}
