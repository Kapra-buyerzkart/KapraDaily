import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

/**
 * CurvedFolderTab - Zepto / Swiggy Instamart style tab with curved inverted corners (concave fillets)
 *
 * @param {number} width - Measured width of the tab body
 * @param {number} height - Tab height (default: 40)
 * @param {number} topRadius - Convex radius for top rounded shoulders (default: 10)
 * @param {number} bottomRadius - Concave fillet radius for bottom curved feet (default: 10)
 * @param {string} strokeColor - Tab outline stroke color (default: '#0D5335')
 * @param {number} strokeWidth - Border stroke width (default: 1.8)
 * @param {string} fillColor - Background fill color (default: '#FFFFFF')
 */
const CurvedFolderTab = React.memo(({
  width = 60,
  height = 40,
  topRadius = 10,
  bottomRadius = 10,
  strokeColor = '#0D5335',
  strokeWidth = 1,
  fillColor = 'transparent',
}) => {
  const half = strokeWidth / 2;
  const top = half;
  const base = height - half;
  const left = bottomRadius;

  const safeW = Math.max(width, topRadius * 2 + 4);
  const right = left + safeW;
  const canvasW = right + bottomRadius;
  const bleed = height + 3;

  // Path for the active tab stroke (lands on the baseline at y = base on both ends)
  const strokePath = [
    `M 0,${base}`,
    `Q ${left},${base} ${left},${base - bottomRadius}`,
    `L ${left},${top + topRadius}`,
    `Q ${left},${top} ${left + topRadius},${top}`,
    `L ${right - topRadius},${top}`,
    `Q ${right},${top} ${right},${top + topRadius}`,
    `L ${right},${base - bottomRadius}`,
    `Q ${right},${base} ${canvasW},${base}`,
  ].join(' ');

  // Path for the white fill covering the baseline directly underneath the tab
  const fillPath = `${strokePath} L ${canvasW},${bleed} L 0,${bleed} Z`;

  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: -bottomRadius,
        top: 0,
        width: canvasW,
        height: bleed,
        zIndex: 0,
      }}
    >
      <Svg width={canvasW} height={bleed} viewBox={`0 0 ${canvasW} ${bleed}`}>
        {/* Solid white fill that seamlessly blends with the content section below */}
        <Path d={fillPath} fill={fillColor} />
        {/* Continuous curved stroke outlining the folder tab */}
        <Path
          d={strokePath}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
});

export default CurvedFolderTab;
