import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const wp = (widthPercent: string | number): number => {
  const elemWidth = typeof widthPercent === "number" ? widthPercent : parseFloat(widthPercent.replace('%', ''));
  return PixelRatio.roundToNearestPixel((SCREEN_WIDTH * elemWidth) / 100);
};

export const hp = (heightPercent: string | number): number => {
  const elemHeight = typeof heightPercent === "number" ? heightPercent : parseFloat(heightPercent.replace('%', ''));
  return PixelRatio.roundToNearestPixel((SCREEN_HEIGHT * elemHeight) / 100);
};
