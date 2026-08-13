import { View, TextInput } from 'react-native';
import React, { useState } from 'react';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { CANVAS, INK, MAX_FONT_SCALE } from '@/styles/homeTheme';
import {
  FIELD_FOCUS_EDGE,
  FIELD_REST_BG,
  FIELD_REST_EDGE,
  ICON,
  styles,
} from '../../styles';
import { FOCUS_FADE } from '../../motion';
import FieldLabel from '../atoms/FieldLabel';
import FieldFooter from '../atoms/FieldFooter';

const FormField = React.forwardRef(
  (
    { label, icon, helper, counter, multiline, value, onChangeText, ...props },
    ref,
  ) => {
    const [focused, setFocused] = useState(false);
    const focus = useSharedValue(0);

    const wellStyle = useAnimatedStyle(() => ({
      backgroundColor: interpolateColor(
        focus.value,
        [0, 1],
        [FIELD_REST_BG, CANVAS],
      ),
      borderColor: interpolateColor(
        focus.value,
        [0, 1],
        [FIELD_REST_EDGE, FIELD_FOCUS_EDGE],
      ),
    }));

    return (
      <View style={styles.field}>
        <FieldLabel>{label}</FieldLabel>

        <Animated.View
          style={[
            styles.fieldWell,
            multiline && styles.fieldWellMultiline,
            wellStyle,
          ]}
        >
          <MaterialCommunityIcons
            name={icon}
            size={ICON.field}
            color={focused ? INK.base : INK.muted}
            style={[styles.fieldIcon, multiline && styles.fieldIconMultiline]}
          />

          <TextInput
            ref={ref}
            style={[styles.fieldInput, multiline && styles.fieldInputMultiline]}
            value={value}
            onChangeText={onChangeText}
            placeholderTextColor={INK.faint}
            multiline={multiline}
            maxFontSizeMultiplier={MAX_FONT_SCALE}
            onFocus={() => {
              setFocused(true);
              focus.value = withTiming(1, FOCUS_FADE);
            }}
            onBlur={() => {
              setFocused(false);
              focus.value = withTiming(0, FOCUS_FADE);
            }}
            {...props}
          />
        </Animated.View>

        <FieldFooter helper={helper} counter={counter} />
      </View>
    );
  },
);

FormField.displayName = 'FormField';

export default FormField;
