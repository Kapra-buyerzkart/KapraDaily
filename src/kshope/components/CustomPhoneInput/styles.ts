import { StyleSheet } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { colors, fontColors } from '../../theme/colours';

export const styles = StyleSheet.create({
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        height: hp('5.36%'),
        borderRadius: wp('7.33%'),
        borderWidth: 1,
        borderColor: colors.lightGrey,
        paddingHorizontal: wp('4.18%'),
        backgroundColor: colors.white,
    },
    countryCode: {
        fontSize: wp('4.19%'),
        color: fontColors.titleBlack,
        marginRight: 12,
    },
    divider: {
        width: 1,
        height: hp('4%'),
        backgroundColor: colors.lightGrey,
        marginRight: wp('4%')
    },
    input: {
        flex: 1,
        color: fontColors.titleBlack,
        fontSize: wp('4.19%'),
    },
});
