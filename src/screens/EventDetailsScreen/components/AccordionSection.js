import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, LayoutAnimation } from 'react-native';
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

const EXPAND_SETTLE_MS = 340;

const AccordionSection = ({
  title,
  children,
  defaultOpen = false,
  maxHeight,

  onExpand,
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const rotation = useSharedValue(defaultOpen ? 1 : 0);
  const containerRef = useRef(null);
  const settleTimer = useRef(null);

  useEffect(() => () => clearTimeout(settleTimer.current), []);

  const toggle = () => {
    const willOpen = !open;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    rotation.value = withTiming(willOpen ? 1 : 0, { duration: 220 });
    setOpen(willOpen);

    clearTimeout(settleTimer.current);
    if (!willOpen || !onExpand) return;
    settleTimer.current = setTimeout(() => {
      containerRef.current?.measureInWindow((x, y, width, height) => {
        if (height) onExpand({ y, height });
      });
    }, EXPAND_SETTLE_MS);
  };

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value * 180}deg` }],
  }));

  const body =
    typeof children === 'string' ? (
      <Text style={styles.accordionText}>{children}</Text>
    ) : (
      children
    );

  return (
    <View ref={containerRef} collapsable={false} style={styles.accordion}>
      <AnimatedPressable style={styles.accordionHeader} onPress={toggle}>
        <Text style={styles.accordionTitle}>{title}</Text>
        <Animated.View style={chevronStyle}>
          <Ionicons name="chevron-down" size={20} color={COLORS.white} />
        </Animated.View>
      </AnimatedPressable>
      {open && (
        <Animated.View entering={FadeIn.duration(200)}>
          <View style={styles.accordionBody}>
            {maxHeight ? (
              <ScrollView
                style={{ maxHeight }}
                nestedScrollEnabled
                showsVerticalScrollIndicator
              >
                {body}
              </ScrollView>
            ) : (
              body
            )}
          </View>
        </Animated.View>
      )}
    </View>
  );
};

export default React.memo(AccordionSection);
