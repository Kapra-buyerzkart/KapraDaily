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
import { styles } from '../styles';
import { ACCENT, MAX_FONT_SCALE } from '@/styles/homeTheme';
import { PRESS_IN, PRESS_OUT } from '@/styles/motion';

const GENDER_OPTIONS = ['Male', 'Female', 'Other'];

const GenderChip = ({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) => {
  const scale = useSharedValue(1);
  const chipStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      style={styles.genderChipPressable}
      onPress={onPress}
      onPressIn={() => {
        scale.value = withTiming(0.96, PRESS_IN);
      }}
      onPressOut={() => {
        scale.value = withSpring(1, PRESS_OUT);
      }}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
    >
      <Animated.View
        style={[
          styles.genderChip,
          selected && styles.genderChipActive,
          chipStyle,
        ]}
      >
        {selected && (
          <MaterialCommunityIcons
            name="check"
            size={wp('3.6%')}
            color={ACCENT.discount}
          />
        )}
        <Text
          style={[
            styles.genderChipText,
            selected && styles.genderChipTextActive,
          ]}
          numberOfLines={1}
          maxFontSizeMultiplier={MAX_FONT_SCALE}
        >
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

type GenderSelectorProps = {
  value: string;
  onChange: (gender: string) => void;
};

const GenderSelector = ({ value, onChange }: GenderSelectorProps) => (
  <View style={styles.field}>
    <View style={styles.fieldLabelRow}>
      <Text style={styles.fieldLabel} maxFontSizeMultiplier={MAX_FONT_SCALE}>
        Gender
      </Text>
      <Text style={styles.fieldOptional} maxFontSizeMultiplier={MAX_FONT_SCALE}>
        Optional
      </Text>
    </View>

    <View style={styles.genderRow} accessibilityRole="radiogroup">
      {GENDER_OPTIONS.map(item => (
        <GenderChip
          key={item}
          label={item}
          selected={value === item}
          onPress={() => onChange(item)}
        />
      ))}
    </View>
  </View>
);

export default GenderSelector;
