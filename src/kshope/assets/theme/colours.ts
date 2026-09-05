// src/theme/colors.ts

const lightColors = {
  primary: '#1A72DD',
  secondary: '#1A72DD',
  black: '#000000',
  white: '#ffffff',
  inputBackground: 'rgba(0, 0, 0, 0.05)',
  background: '#ffffff',
  text: '#2A3256',
  card: '#b4f0edff',
  border: '#d1d1d1ff',
  grey: '#808080',
  greyborder: '#C6d2d0',
  lightGrey: '#d3d3d3',
  red: '#ff0000',
  green: '#0cA201',
  blue: '#0000ff',
  halfTransparent: 'rgba(0, 0, 0, 0.5)',

  // Custom Colors
  themeWhite: '#FFFFFF',
  themeLightGray: '#DADADA',
  themeDarkGray: '#727783',
  themeTeal: '#F25000',
  themeTealTwo: '#F25000',
  tealButton: '#FF6A00',
  tealIconFont: '#F25000',
  themeBlack: '#000000',
  themeDarkTeal: '#F25000',
  themeDarkTealHalf: 'rgba(242, 80, 0, 0.5)',
  themeBg: '#F25000',
  figmaTeal: '#fff3edff',
  outlineTeal: '#F25000',
  starYellow: '#FFD700',
  darkCardBackground: '#1F1F1F',
  homeScreenBackground: '#F2FBFB',
  wishlistbg: '#fffdfbff', //'#f5fffeff',
  logoutred: '#Ff4242',
  darkFontOne: '#393939',
  black1: '#2F2F2F',
};


export const fontColors = {
  buttonWhite: '#FFFFFF',
  themeLightGray: '#DADADA',
  subtext: '#727783',
  themeTeal: '#F25000',
  titleBlack: '#000000',
  themeDarkTeal: '#F25000',
};

export const colors = lightColors;

export const getThemeColors = () => colors;
