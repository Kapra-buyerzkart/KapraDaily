import React from 'react';
import Svg, { Path, Ellipse, Circle } from 'react-native-svg';

// Small hand-drawn grocery glyphs for the background drift layer. Kept as
// simple geometric silhouettes (not detailed illustrations) since they only
// ever render at ~5% opacity — composed-Path convention matches
// src/components/ProfileIcons.js.

export const LeafyGreenIcon = ({ size = 28, color = '#111111', ...props }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M4 20C4 12 9 4 20 4C20 15 12 20 4 20Z"
      fill={color}
    />
    <Path
      d="M5 19C9 15 13 11 19 5"
      stroke={color}
      strokeWidth={1.4}
      strokeLinecap="round"
      opacity={0.5}
    />
  </Svg>
);

export const BreadIcon = ({ size = 28, color = '#111111', ...props }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M3 13C3 8 7 4 12 4C17 4 21 8 21 13C21 18 17.5 20 12 20C6.5 20 3 18 3 13Z"
      fill={color}
    />
    <Path
      d="M9 9L8 15M15 9L16 15"
      stroke="#FFFFFF"
      strokeWidth={1.2}
      strokeLinecap="round"
      opacity={0.6}
    />
  </Svg>
);

export const MilkIcon = ({ size = 28, color = '#111111', ...props }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M9 3H15L16 7L18 9.5V20C18 20.55 17.55 21 17 21H7C6.45 21 6 20.55 6 20V9.5L8 7L9 3Z"
      fill={color}
    />
    <Path d="M9 3H15V5H9V3Z" fill={color} opacity={0.6} />
  </Svg>
);

export const TomatoIcon = ({ size = 28, color = '#111111', ...props }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Circle cx={12} cy={14} r={7} fill={color} />
    <Path
      d="M9 7C9.5 5.5 10.5 4.5 12 4.5C13.5 4.5 14.5 5.5 15 7"
      stroke={color}
      strokeWidth={1.4}
      strokeLinecap="round"
    />
  </Svg>
);

export const EggIcon = ({ size = 28, color = '#111111', ...props }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Ellipse cx={12} cy={13} rx={6.5} ry={8.5} fill={color} />
  </Svg>
);

export const GROCERY_ICONS = [
  LeafyGreenIcon,
  BreadIcon,
  MilkIcon,
  TomatoIcon,
  EggIcon,
];
