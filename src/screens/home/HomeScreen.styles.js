import { StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { CANVAS, SPACE } from '@/styles/homeTheme';

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: CANVAS,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    elevation: 12,
  },
  floatingContainer: {
    position: 'absolute',
    bottom: hp('10%'),
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  carouselHeight: {
    height: hp('22%'),
  },

  sectionGapLarge: {
    height: SPACE.xl,
  },
  carouselBleed: {
    marginTop: SPACE.lg,
    marginBottom: SPACE.xs,
  },

  sealWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: hp('3%'),
    opacity: 0.9,
  },
  sealImage: {
    width: wp('42%'),
    height: wp('42%'),
  },
});

export default styles;
