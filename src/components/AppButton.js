import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, View } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { FONTS } from '../styles/typography';

const AppButton = ({
    title,
    onPress,
    isLoading = false,
    disabled = false,
    style,
    textStyle,
    loaderColor,
    variant = 'solid', // 'solid' | 'outline'
    icon,
    iconPosition = 'left',
}) => {
    const isOutline = variant === 'outline';
    const defaultLoaderColor = isOutline ? '#F25000' : '#FFFFFF';
    const finalLoaderColor = loaderColor || defaultLoaderColor;

    const handlePress = () => {
        if (isLoading || disabled) return;

        // Trigger Haptic Feedback
        // ReactNativeHapticFeedback.trigger("impactLight", hapticOptions);

        if (onPress) {
            onPress();
        }
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.8}
            disabled={isLoading || disabled}
            style={[
                styles.button,
                isOutline && styles.outlineButton,
                disabled && (isOutline ? styles.disabledOutlineButton : styles.disabledButton),
                style
            ]}
        >
            {isLoading ? (
                <ActivityIndicator size="small" color={finalLoaderColor} />
            ) : (
                <View style={[styles.contentContainer, iconPosition === 'right' && { flexDirection: 'row-reverse' }]}>
                    {icon && <View style={[iconPosition === 'left' ? { marginRight: 8 } : { marginLeft: 8 }]}>{icon}</View>}
                    <Text style={[styles.text, isOutline && styles.outlineText, textStyle]}>{title}</Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

export default AppButton;

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#F25000',
        paddingVertical: hp('1.5%'),
        paddingHorizontal: wp('5%'),
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        minHeight: hp('6%'),
    },
    outlineButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#F25000',
    },
    disabledButton: {
        backgroundColor: '#A0A0A0',
        opacity: 0.7
    },
    disabledOutlineButton: {
        borderColor: '#A0A0A0',
        opacity: 0.6
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: '#FFFFFF',
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('4%'),
    },
    outlineText: {
        color: '#F25000',
    }
});
