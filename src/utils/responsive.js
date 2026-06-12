import { Dimensions, PixelRatio } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

/**
 * Converts width dimension to percentage.
 * @param {string|number} widthPercent - The percentage of screen's width (e.g., 10, '10%', '10p').
 * @returns {number} The calculated value in pixels.
 */
export const wp = (widthPercent) => {
  let elemWidth = typeof widthPercent === 'number' ? widthPercent : parseFloat(widthPercent);
  return PixelRatio.roundToNearestPixel((screenWidth * elemWidth) / 100);
};

/**
 * Converts height dimension to percentage.
 * @param {string|number} heightPercent - The percentage of screen's height (e.g., 10, '10%', '10p').
 * @returns {number} The calculated value in pixels.
 */
export const hp = (heightPercent) => {
  let elemHeight = typeof heightPercent === 'number' ? heightPercent : parseFloat(heightPercent);
  return PixelRatio.roundToNearestPixel((screenHeight * elemHeight) / 100);
};
