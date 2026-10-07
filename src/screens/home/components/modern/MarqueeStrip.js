import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { FONTS } from '@/styles/typography';

const MarqueeStrip = ({ text, speed = 40 }) => {
  const [contentWidth, setContentWidth] = useState(0);
  const translateX = useSharedValue(0);

  // Replace spaces with non-breaking spaces to ensure it stays on one line
  const singleLineText = text.replace(/ /g, '\u00A0');

  useEffect(() => {
    if (contentWidth > 0) {
      const duration = (contentWidth / 100) * speed * 100;
      
      translateX.value = 0;
      translateX.value = withRepeat(
        withTiming(-contentWidth, {
          duration,
          easing: Easing.linear,
        }),
        -1, // loop continuously
        false
      );
    }
  }, [contentWidth, translateX, speed]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.row, animatedStyle]}>
        <View
          style={styles.textWrapper}
          onLayout={(e) => {
            const width = e.nativeEvent.layout.width;
            if (width > 0 && contentWidth === 0) {
              setContentWidth(width);
            }
          }}
        >
          <Text style={styles.text}>{singleLineText}</Text>
        </View>
        {/* Render a duplicate block right after to create the seamless loop effect */}
        {contentWidth > 0 && (
          <View style={styles.textWrapper}>
            <Text style={styles.text}>{singleLineText}</Text>
          </View>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0A4C36',
    paddingVertical: hp('1.2%'),
    overflow: 'hidden',
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    width: 9999, // Force parent wide enough so children do not wrap
  },
  textWrapper: {
    flexDirection: 'row',
    paddingRight: wp('8%'), // spacing between loops
  },
  text: {
    color: '#FFFFFF',
    fontSize: wp('3.5%'),
    fontFamily: FONTS.gilroy.medium,
  },
});

export default MarqueeStrip;
