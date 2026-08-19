import { StyleSheet } from 'react-native';
import { hp, wp } from '../../utils/responsive';
import { colors } from '../../assets/theme/colours';
import { Fonts as FONTS } from '../../assets/theme/fonts';

export const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: colors.halfTransparent,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: wp('85%'),
        backgroundColor: colors.white,
        borderRadius: wp('5%'),
        padding: wp('5%'),
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    iconContainer: {
        marginBottom: hp('1%'),
    },
    title: {
        fontFamily: FONTS.gilroySemiBold,
        fontSize: wp('4.5%'),
        color: colors.black,
        marginBottom: hp('1%'),
        textAlign: 'center',
    },
    message: {
        fontFamily: FONTS.gilroyRegular,
        fontSize: wp('3.5%'),
        color: colors.grey,
        textAlign: 'center',
        marginBottom: hp('3%'),
        lineHeight: wp('5%'),
    },
    buttonContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        gap: wp('3%'),
    },
    button: {
        flex: 1,
        paddingVertical: hp('1.5%'),
        borderRadius: wp('2.5%'),
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButton: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.lightGrey,
    },
    confirmButton: {
        backgroundColor: colors.red,
    },
    cancelButtonText: {
        fontFamily: FONTS.gilroyMedium,
        fontSize: wp('3.7%'),
        color: colors.grey,
    },
    confirmButtonText: {
        fontFamily: FONTS.gilroyMedium,
        fontSize: wp('3.7%'),
        color: colors.white,
    },
});
