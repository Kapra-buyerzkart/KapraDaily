import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles, SAVE_RESTING_INK } from '../styles';
import { INK, MAX_FONT_SCALE, SPACE } from '@/styles/homeTheme';
import { PRESS_IN, PRESS_OUT } from '@/styles/motion';

type SaveBarProps = {
  enabled: boolean;
  onPress: () => void;
};

const SaveBar = ({ enabled, onPress }: SaveBarProps) => {
  const insets = useSafeAreaInsets();
  const scale = useSharedValue(1);
  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View
      style={[
        styles.saveBar,
        { paddingBottom: Math.max(insets.bottom, SPACE.md) },
      ]}
    >
      <Pressable
        onPress={onPress}
        disabled={!enabled}
        onPressIn={() => {
          if (enabled) scale.value = withTiming(0.98, PRESS_IN);
        }}
        onPressOut={() => {
          scale.value = withSpring(1, PRESS_OUT);
        }}
        accessibilityRole="button"
        accessibilityState={{ disabled: !enabled }}
        accessibilityLabel="Save changes"
        accessibilityHint={
          enabled ? undefined : 'Available once you change something'
        }
      >
        <Animated.View
          style={[
            styles.saveButton,
            !enabled && styles.saveButtonDisabled,
            buttonStyle,
          ]}
        >
          <MaterialCommunityIcons
            name={enabled ? 'check-circle-outline' : 'check'}
            size={wp('4.6%')}
            color={enabled ? INK.onDark : SAVE_RESTING_INK}
            style={styles.saveButtonIcon}
          />
          <Text
            style={[
              styles.saveButtonText,
              !enabled && styles.saveButtonTextDisabled,
            ]}
            maxFontSizeMultiplier={MAX_FONT_SCALE}
          >
            {enabled ? 'Save Changes' : 'No Changes Yet'}
          </Text>
        </Animated.View>
      </Pressable>
    </View>
  );
};

export default SaveBar;
