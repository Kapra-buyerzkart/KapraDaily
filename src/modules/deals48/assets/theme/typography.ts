import { Fonts as FontFamilies } from './fonts';
import { colors } from './colours';

const colour = colors;

export const fonts = {
    h1: {
        fontFamily: FontFamilies.gilroyBold,
        fontSize: 20,
        lineHeight: 40,
        color: colour.black,
    },
    h2: {
        fontFamily: FontFamilies.medium,
        fontSize: 24,
        lineHeight: 32,
        color: colour.text,
    },
    h3: {
        fontFamily: FontFamilies.medium,
        fontSize: 20,
        lineHeight: 28,
        color: colour.text,
    },
    h4: {
        fontFamily: FontFamilies.medium,
        fontSize: 18,
        lineHeight: 26,
        color: colour.text,
    },
    subtitle1: {
        fontFamily: FontFamilies.medium,
        fontSize: 16,
        lineHeight: 24,
        color: colour.text,
    },
    subtitle2: {
        fontFamily: FontFamilies.regular,
        fontSize: 14,
        lineHeight: 22,
        color: colour.text,
    },
    body1: {
        fontFamily: FontFamilies.regular,
        fontSize: 16,
        lineHeight: 24,
        color: colour.text,
    },
    body2: {
        fontFamily: FontFamilies.regular,
        fontSize: 14,
        lineHeight: 20,
        color: colour.text,
    },
    button: {
        fontFamily: FontFamilies.medium,
        fontSize: 14,
        lineHeight: 16,
        textTransform: 'uppercase' as const,
        color: colour.text,
    },
    caption: {
        fontFamily: FontFamilies.regular,
        fontSize: 12,
        lineHeight: 16,
        color: colour.text,
    },
    overline: {
        fontFamily: FontFamilies.regular,
        fontSize: 10,
        lineHeight: 14,
        textTransform: 'uppercase' as const,
        color: colour.text,
    },
};
