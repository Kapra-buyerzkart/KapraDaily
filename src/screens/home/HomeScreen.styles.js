import { StyleSheet, Platform } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  floatingContainer: {
    position: 'absolute',
    bottom: hp('10%'),
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  footerBranding: {
    alignItems: 'flex-start',
    paddingVertical: hp('2%'),
    marginBottom: 0,
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
});

export default styles;
