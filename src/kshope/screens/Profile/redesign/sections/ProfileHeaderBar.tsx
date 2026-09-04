import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  UI_COLORS,
  UI_SPACING,
  UI_TYPE,
  MAX_FONT_SCALE,
  hitSlopTo,
  hp,
  wp,
} from '../../../../theme/tokens';

interface Props {
  name?: string;
  onBack: () => void;
  backgroundStyle?: any;
  borderStyle?: any;
  titleStyle?: any;
  nameStyle?: any;
}

const ProfileHeaderBar: React.FC<Props> = ({
  name,
  onBack,
  backgroundStyle,
  borderStyle,
  titleStyle,
  nameStyle,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <Animated.View
      style={[
        styles.header,
        backgroundStyle,
        { paddingTop: insets.top + UI_SPACING.sm },
      ]}
    >
      <TouchableOpacity
        onPress={onBack}
        style={styles.backBtn}
        hitSlop={hitSlopTo(wp('6%'))}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Ionicons
          name="arrow-back"
          size={wp('6%')}
          color={UI_COLORS.textPrimary}
        />
      </TouchableOpacity>

      <View style={styles.titleBlock}>
        <Animated.Text
          style={[styles.title, titleStyle]}
          numberOfLines={1}
          maxFontSizeMultiplier={MAX_FONT_SCALE}
          accessibilityRole="header"
        >
          Profile
        </Animated.Text>
        <Animated.Text
          style={[styles.title, styles.swapName, nameStyle]}
          numberOfLines={1}
          maxFontSizeMultiplier={MAX_FONT_SCALE}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          {name}
        </Animated.Text>
      </View>

      <Animated.View style={[styles.border, borderStyle]} />
    </Animated.View>
  );
};

export default React.memo(ProfileHeaderBar);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: UI_SPACING.sm,
    paddingHorizontal: UI_SPACING.lg,
    paddingBottom: hp('1.2%'),
  },
  backBtn: {
    padding: UI_SPACING.xs,
  },
  titleBlock: {
    flex: 1,
    marginLeft: UI_SPACING.xs,
    justifyContent: 'center',
  },
  title: {
    ...UI_TYPE.title,
    color: UI_COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  swapName: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  border: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: UI_COLORS.border,
  },
});
