import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * Converts provided width percentage to independent pixel (dp).
 * @param  {string | number} widthPercent The percentage of screen's width that UI element should cover.
 * @return {number} The calculated dp value.
 */
export const wp = (widthPercent: string | number): number => {
  const elemWidth = typeof widthPercent === "number" ? widthPercent : parseFloat(widthPercent.replace('%', ''));
  return PixelRatio.roundToNearestPixel((SCREEN_WIDTH * elemWidth) / 100);
};

/**
 * Converts provided height percentage to independent pixel (dp).
 * @param  {string | number} heightPercent The percentage of screen's height that UI element should cover.
 * @return {number} The calculated dp value.
 */
export const hp = (heightPercent: string | number): number => {
  const elemHeight = typeof heightPercent === "number" ? heightPercent : parseFloat(heightPercent.replace('%', ''));
  return PixelRatio.roundToNearestPixel((SCREEN_HEIGHT * elemHeight) / 100);
};
