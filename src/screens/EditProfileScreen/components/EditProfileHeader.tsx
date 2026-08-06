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
        {}
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
