import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Entypo from 'react-native-vector-icons/Entypo';
import { FONTS } from '../styles/typography';

const SeeAllButton = ({ onPress, style, label }) => {
    const title = label || 'See All';

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={onPress}
            style={[styles.button, style]}
        >
            <Text style={styles.text}>{title}</Text>
            <Entypo
                name="controller-play"
                size={wp('4%')}
                color="#000000"
                style={styles.icon}
            />
        </TouchableOpacity>
    );
};

export default SeeAllButton;

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: wp('90%'),
        height: hp('6%'),
        borderRadius: wp('9%'),
        backgroundColor: '#FFFFFF',
        // Soft orange drop shadow like the design
        shadowColor: '#F25000',
        shadowOpacity: 0.4,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 2,
        elevation: 4,
    },
    text: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('4%'),
        color: '#000000',
        fontWeight: '600',
    },
    icon: {
        marginLeft: wp('1.5%'),
    },
});
