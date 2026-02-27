import React from 'react';
import { View, ActivityIndicator, StyleSheet, Modal, Text } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { FONTS } from '../styles/typography';

const CustomLoader = ({ visible, text = "Loading..." }) => {
    return (
        <Modal transparent={true} animationType="fade" visible={visible} statusBarTranslucent>
            <View style={styles.container}>
                <View style={styles.loaderBox}>
                    <ActivityIndicator size="large" color="#F25000" />
                    {text && <Text style={styles.loadingText}>{text}</Text>}
                </View>
            </View>
        </Modal>
    );
};

export default CustomLoader;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)', // semi-transparent backdrop
    },
    loaderBox: {
        width: wp('35%'),
        height: wp('35%'),
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    loadingText: {
        marginTop: hp('1.5%'),
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('3.5%'),
        color: '#000000',
        textAlign: 'center',
    }
});
