import { TouchableOpacity, Image } from 'react-native';
import React from 'react';
import Animated from 'react-native-reanimated';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import icons from '@/assets/icons';
import { MAX_FONT_SCALE, SPACE, hitSlopTo } from '@/styles/homeTheme';
import { styles } from '../../styles';

export default function AddressTopBar({ title, onBack, borderStyle }) {
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

      <Animated.Text
        style={styles.topBarTitle}
        numberOfLines={1}
        maxFontSizeMultiplier={MAX_FONT_SCALE}
        accessibilityRole="header"
      >
        {title}
      </Animated.Text>

      <Animated.View style={[styles.topBarBorder, borderStyle]} />
    </Animated.View>
  );
}
