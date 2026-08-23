import { StyleSheet } from 'react-native';
import { Fonts } from '../../theme/fonts';
import { fontColors } from '../../theme/colours';

export const getStyles = (colour: any) => StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    label: {
        fontFamily: Fonts.regular,
        fontSize: 14,
        color: fontColors.titleBlack,
        marginBottom: 8,
        fontWeight: '400',
    },
    input: {
        fontFamily: Fonts.regular,
        height: 40,
        borderRadius: 25,
        paddingHorizontal: 15,
        fontSize: 14,
        color: fontColors.titleBlack,
        borderWidth: 0,
        fontWeight: '500',
        flex: 1,
    },
    focused: {
        borderColor: colour.outlineTeal || colour.secondary,
    },
    error: {
        borderColor: colour.red,
    },
    errorText: {
        fontFamily: Fonts.regular,
        color: colour.red,
        fontSize: 12,
        marginTop: 5,
    },
    iconContainer: {
        paddingHorizontal: 15,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderRadius: 25,
        backgroundColor: colour.themeWhite || '#FFFFFF',
        height: 40,
    },
});
