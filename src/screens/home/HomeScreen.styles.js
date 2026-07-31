import { StyleSheet, Platform } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { CANVAS, RADIUS, SPACE, GUTTER } from './homeTheme';

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: CANVAS,
  },
  floatingContainer: {
    position: 'absolute',
    bottom: hp('10%'),
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  // Main top banner section (below the sticky header, top of the scroll content)
  topShowcaseContainer: {
    width: wp('100%'),
    aspectRatio: 0.8,
  },
  topShowcaseMain: {
    width: '91%',
    aspectRatio: 5,
    borderRadius: wp('4.65%'),
    top: '52.5%',
    position: 'absolute',
    alignSelf: 'center',
  },
  topShowcaseRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    bottom: '-7%',
    position: 'absolute',
    width: '100%',
  },
  topShowcaseCard: {
    height: wp('52%'),
    width: wp('48%'),
    top: Platform.OS === 'ios' ? '10%' : '7%',
    borderRadius: wp('4%'),
    overflow: 'hidden',
    marginHorizontal: Platform.OS == 'ios' ? -wp('0.5%') : -wp('1%'),
  },
  topShowcaseCardImage: {
    width: '100%',
    height: '65%',
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

  // Bottom showcase banner. Inset to the gutter and rounded so it reads as
  // artwork placed on the page, not as a panel bolted to the screen edges.
  showcaseCard: {
    width: wp('94%'),
    height: hp('32%'),
    alignSelf: 'center',
    marginTop: SPACE.lg,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },
  showcaseCardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: RADIUS.lg,
  },
  showcaseItem: {
    marginRight: wp('1%'),
  },
  showcaseItemImage: {
    width: wp('31%'),
    height: wp('31%'),
    borderRadius: RADIUS.md,
    marginTop: hp('14%'),
  },
  showcaseListContent: {
    paddingHorizontal: wp('3.6%'),
    paddingTop: hp('2%'),
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

  // Seasonal-fruits shimmer (mirrors the bottomBanner carousel section)
  fruitsContainer: {
    paddingVertical: hp('1%'),
  },
  fruitsHeaderView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp('1%'),
    marginBottom: hp('1%'),
  },
  shimmerTitle: {
    width: wp('40%'),
    height: hp('2.5%'),
    borderRadius: 6,
    marginLeft: GUTTER,
  },
  shimmerBannerRow: {
    flexDirection: 'row',
    marginLeft: GUTTER,
  },
  shimmerBanner: {
    width: wp('74.88%'),
    height: hp('19.35%'),
    borderRadius: RADIUS.lg,
    marginRight: wp('5%'),
  },
});

export default styles;
