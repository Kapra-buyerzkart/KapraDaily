import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '../../../../../components/atoms';
import {
  UI_COLORS,
  UI_SPACING,
  hitSlopTo,
  hp,
  wp,
} from '../../../../../theme/tokens';

interface Props {
  onBack: () => void;
  backgroundStyle?: any;
  borderStyle?: any;
}

const EditProfileHeader: React.FC<Props> = ({
  onBack,
  backgroundStyle,
  borderStyle,
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
        <AppText variant="title" numberOfLines={1} accessibilityRole="header">
          Edit Profile
        </AppText>
      </View>

      <Animated.View style={[styles.border, borderStyle]} />
    </Animated.View>
  );
};

export default React.memo(EditProfileHeader);

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
  border: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: UI_COLORS.border,
  },
});
