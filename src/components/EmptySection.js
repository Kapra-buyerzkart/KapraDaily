import { View, Text, StyleSheet, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { FONTS } from '../styles/typography';

const EmptySection = ({ message = "No items available", imageSource }) => {
    return (
        <View style={styles.container}>
            <Image
                source={imageSource || require('../assets/gifs/bcoin.gif')}
                style={styles.image}
                resizeMode="contain"
            />
            <Text style={styles.message}>{message}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: wp('5%'),
        width: wp('100%'), // Ensure it takes full width of the container/screen if specialized
    },
    image: {
        width: wp('20%'),
        height: wp('20%'),
        marginBottom: hp('1%'),
    },
    message: {
        fontFamily: FONTS.poppins.regular || 'System', // Fallback
        fontSize: wp('3.5%'),
        color: '#777777',
        textAlign: 'center',
    },
});

export default EmptySection;
