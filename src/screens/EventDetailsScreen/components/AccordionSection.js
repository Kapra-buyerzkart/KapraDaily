import React, { useState } from 'react';
import { View, Text, LayoutAnimation } from 'react-native';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AnimatedPressable from '@/components/AnimatedPressable';
import COLORS from '@/styles/colors';
import styles from '../styles';

const AccordionSection = ({ title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  const rotation = useSharedValue(defaultOpen ? 1 : 0);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    rotation.value = withTiming(open ? 0 : 1, { duration: 220 });
    setOpen(prev => !prev);
  };

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value * 180}deg` }],
  }));

  return (
    <View style={styles.accordion}>
      <AnimatedPressable
        style={styles.accordionHeader}
        onPress={toggle}
      >
        <Text style={styles.accordionTitle}>{title}</Text>
        <Animated.View style={chevronStyle}>
          <Ionicons name="chevron-down" size={20} color={COLORS.white} />
        </Animated.View>
      </AnimatedPressable>
      {open && (
        <Animated.View entering={FadeIn.duration(200)}>
          <View style={styles.divider} />
          <View style={styles.accordionBody}>
            {typeof children === 'string' ? (
              <Text style={styles.accordionText}>{children}</Text>
            ) : (
              children
            )}
          </View>
        </Animated.View>
      )}
    </View>
  );
};

export default React.memo(AccordionSection);
