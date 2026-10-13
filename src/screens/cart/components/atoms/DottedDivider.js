import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Line } from 'react-native-svg';

const WINDOW_WIDTH = Dimensions.get('window').width;

const DottedDivider = ({
  color = '#D1D5DB',
  strokeWidth = 1.5,
  dashLength = 3.5,
  gapLength = 3.5,
  style,
}) => {
  const [width, setWidth] = useState(WINDOW_WIDTH);

  const onLayout = useCallback(
    (e) => {
      const layoutWidth = e.nativeEvent.layout.width;
      if (layoutWidth > 0 && Math.abs(layoutWidth - width) > 1) {
        setWidth(layoutWidth);
      }
    },
    [width],
  );

  return (
    <View style={[styles.container, style]} onLayout={onLayout}>
      <Svg height={strokeWidth} width={width}>
        <Line
          x1={0}
          y1={strokeWidth / 2}
          x2={width}
          y2={strokeWidth / 2}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${dashLength}, ${gapLength}`}
        />
      </Svg>
    </View>
  );
};

export default React.memo(DottedDivider);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
});
