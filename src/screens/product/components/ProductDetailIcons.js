import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import BrandSvg from '../../../assets/icons/brand 1.svg';
import BoxSvg from '../../../assets/icons/box 1.svg';
import CountriesSvg from '../../../assets/icons/countries 1.svg';

export { BrandSvg, BoxSvg, CountriesSvg };

/**
 * Brand rosette / medal with ribbon tails
 * Replaces the generated icon with brand 1.svg from src/assets/icons/
 */
export const BrandIcon = ({ size = 38, width, height, ...props }) => (
  <BrandSvg width={width || size} height={height || size} {...props} />
);

/**
 * 3D Isometric Cardboard Box
 * Replaces the generated icon with box 1.svg from src/assets/icons/
 */
export const ManufacturerIcon = ({ size = 38, width, height, ...props }) => (
  <BoxSvg width={width || size} height={height || size} {...props} />
);

/**
 * Globe with meridian and continent coordinates
 * Replaces the generated icon with countries 1.svg from src/assets/icons/
 */
export const CountryOriginIcon = ({ size = 38, width, height, ...props }) => (
  <CountriesSvg width={width || size} height={height || size} {...props} />
);


/**
 * Token Gold Coin Icon
 * Matches the pill token coin in the mockup
 */
export const TokenCoinIcon = ({ size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Circle cx="10" cy="10" r="9" fill="#EAB308" />
    <Circle cx="10" cy="10" r="7.2" stroke="#CA8A04" strokeWidth="1.2" fill="#FACC15" />
    <Path
      d="M7.5 7.5H12.5M10 7.5V12.5M8 12.5H12"
      stroke="#A16207"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * Shopping Cart Icon
 * For top header and Add To Cart button
 */
export const CartOutlineIcon = ({ size = 22, color = '#111827' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 3H5.2L6.8 14.2C6.9 14.8 7.4 15.2 8 15.2H18.2C18.8 15.2 19.3 14.8 19.4 14.2L20.8 7H5.6"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="9" cy="19.5" r="1.5" fill={color} />
    <Circle cx="17.5" cy="19.5" r="1.5" fill={color} />
  </Svg>
);

/**
 * Heart outline / filled icon for top bar
 */
export const WishlistHeartIcon = ({ size = 22, isLiked = false, color = '#111827' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={isLiked ? '#E1233A' : 'none'}>
    <Path
      d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z"
      stroke={isLiked ? '#E1233A' : color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * Back Chevron Arrow icon
 */
export const BackArrowIcon = ({ size = 22, color = '#111827' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M15 19L8 12L15 5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
