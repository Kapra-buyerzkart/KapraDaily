import React from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme/colours';
import { Fonts } from '../theme/fonts';

const { width } = Dimensions.get('window');

const CartEmptyComponent = () => {
    const navigation = useNavigation<any>();

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image
                    source={require('../assets/images/productcart.png')}
                    style={styles.image}
                    resizeMode="contain"
                />
            </View>
            <Text style={styles.title}>Oops!</Text>
            <Text style={styles.subtitle}>Your cart is empty</Text>
            <Text style={styles.description}>
                Looks like you haven't added anything to your cart yet.
            </Text>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.buttonText}>Shop Now</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        backgroundColor: colors.white,
    },
    imageContainer: {
        width: width * 0.6,
        height: width * 0.6,
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    title: {
        fontSize: 28,
        fontFamily: Fonts.gilroyBold,
        color: colors.black,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 18,
        fontFamily: Fonts.gilroySemiBold,
        color: '#666',
        marginBottom: 12,
    },
    description: {
        fontSize: 14,
        fontFamily: Fonts.gilroyMedium,
        color: '#999',
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 20,
    },
    button: {
        backgroundColor: colors.themeTeal,
        paddingHorizontal: 40,
        paddingVertical: 15,
        borderRadius: 15,
        shadowColor: colors.themeTeal,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    buttonText: {
        color: colors.white,
        fontSize: 16,
        fontFamily: Fonts.gilroyBold,
    },
});

export default CartEmptyComponent;
