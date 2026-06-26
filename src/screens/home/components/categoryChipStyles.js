import { StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { FONTS } from '../../../styles/typography';

// Shared between the category grid (CategoryItem) and the category-discovery
// chips (CategoryDiscoverySection) — both render the same "icon in a rounded
// box + label" shape, just with slightly different active-state treatment.
const categoryChipStyles = StyleSheet.create({
  item: {
    width: wp('22%'),
    alignItems: 'center',
    marginBottom: hp('.5%'),
  },
  categoryItemContainer: {
    borderColor: '#F3F4F6',
    borderRadius: 15,
    borderWidth: 1,
  },
  categoryItemContainerActive: {
    backgroundColor: '#FFE9E0',
    borderColor: '#F25000',
    borderWidth: 0.6,
  },
  image: {
    width: wp('17'),
    height: wp('17'),
  },
  label: {
    marginTop: hp('1%'),
    fontSize: wp('2.8%'),
    textAlign: 'center',
    color: '#190A07',
    fontFamily: FONTS.poppins.medium,
  },
});

export default categoryChipStyles;
