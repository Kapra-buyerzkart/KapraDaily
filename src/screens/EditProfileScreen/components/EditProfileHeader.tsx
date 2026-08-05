import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Animated from 'react-native-reanimated';
import type { AnimatedStyle } from 'react-native-reanimated';
import type { ViewStyle } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import icons from '@/assets/icons';
import { styles } from '../styles';
import { MAX_FONT_SCALE, SPACE, hitSlopTo } from '@/styles/homeTheme';

// The bar Profile uses, minus the title swap — there is no second title to hand
// over to here, because the name is in a field you are editing rather than a
// heading you are scrolling past.
//
// It is still a sticky child of the ScrollView, so it still needs an opaque
// background of its own and a rule that only exists once there is content
// underneath it. Its background is animated rather than fixed: at rest it is
// the hero's top colour, so the status bar, the bar and the gradient below read
// as one surface, and it resolves to white only once the hero has scrolled
// past. A permanently white bar put a hard edge across the top of the gradient.
type EditProfileHeaderProps = {
  onBack: () => void;
  backgroundStyle?: AnimatedStyle<ViewStyle>;
  borderStyle?: AnimatedStyle<ViewStyle>;
};

const EditProfileHeader = ({
  onBack,
  backgroundStyle,
  borderStyle,
}: EditProfileHeaderProps) => {
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
        {/* Plain text, not Animated.Text: Profile's bar animates its title
            because it trades one for another, and this bar has only ever one
            thing to say. */}
        <Text
          style={styles.headerTitle}
          numberOfLines={1}
          maxFontSizeMultiplier={MAX_FONT_SCALE}
          accessibilityRole="header"
        >
          Edit Profile
        </Text>
      </View>

      <Animated.View style={[styles.topBarBorder, borderStyle]} />
    </Animated.View>
  );
};

export default EditProfileHeader;
