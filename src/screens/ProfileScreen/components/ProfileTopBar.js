import { View, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import Animated from 'react-native-reanimated';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import icons from '@/assets/icons';
import { styles } from '../styles';
import { MAX_FONT_SCALE, SPACE, hitSlopTo } from '@/styles/homeTheme';

// The bar is sticky, so it needs an opaque background of its own and a rule
// that only exists once there is content underneath it — the same treatment
// Home gives its sticky header (`stickyBorderAnimStyle`). A rule that were
// always drawn would put a line under the name while the page is at rest.
//
// Its background is animated rather than fixed: at rest it is painted the
// hero's top colour, so the status bar, the bar and the gradient below read as
// one surface, and it resolves to white only once the hero has scrolled past.
// A permanently white bar put a hard edge across the top of the gradient.
//
// The two titles are stacked rather than swapped: "Profile" is the in-flow
// text that sizes the slot, and the name is laid over it, so neither can shift
// the back arrow or the bar's height as they trade places.
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
        {/* Hidden from assistive tech: it is the same heading as the one above
            in a different wording, and the name is already announced by the
            identity block. */}
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
