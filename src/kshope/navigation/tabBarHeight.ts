import { Platform } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

export const getTabBarHeight = (bottomInset: number) =>
  Platform.OS === 'android' ? hp('7%') + bottomInset : hp('8%');
