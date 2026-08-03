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
  // `elevation` is Android z-order only: the carousel cards and bottom showcase
  // carry elevation of their own and would otherwise paint over the header.
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

  // ── Section rhythm ──────────────────────────────────────────────────────
  // One spacer token instead of the per-section hp('4%') / hp('2%') / hp('0.5%')
  // margins the sections each used to declare for themselves.
  sectionGapLarge: {
    height: SPACE.xl,
  },
  carouselBleed: {
    marginTop: SPACE.lg,
    marginBottom: SPACE.xs,
  },

  // Footer seal
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
