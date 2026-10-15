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

interface CartEmptyComponentProps {
    showShopNow?: boolean;
    onShopNow?: () => void;
}

const CartEmptyComponent: React.FC<CartEmptyComponentProps> = ({
    showShopNow = false,
    onShopNow,
}) => {
    const navigation = useNavigation<any>();

    const handleShopNow = () => {
        if (onShopNow) {
            onShopNow();
        } else {
            navigation.goBack();
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image
                    source={require('../../assets/images/noimages/no_CART.png')}
                    style={styles.image}
                    resizeMode="contain"
                />
            </View>
            <Text style={styles.title}>Your cart is empty</Text>
            <Text style={styles.description}>
                Add groceries and essentials to get them delivered fast
            </Text>

            {showShopNow && (
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleShopNow}
                >
                    <Text style={styles.buttonText}>Shop Now</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
        backgroundColor: colors.white,
    },
    imageContainer: {
        width: width * 0.78,
        aspectRatio: 353 / 267,
        marginBottom: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    title: {
        fontSize: 22,
        fontFamily: Fonts.gilroyBold,
        color: colors.black,
        textAlign: 'center',
        marginBottom: 8,
        letterSpacing: -0.2,
    },
    description: {
        fontSize: 14,
        fontFamily: Fonts.gilroyMedium,
        color: '#71717A',
        textAlign: 'center',
        lineHeight: 20,
        paddingHorizontal: 16,
    },
    button: {
        marginTop: 24,
        backgroundColor: colors.themeTeal,
        paddingHorizontal: 40,
        paddingVertical: 14,
        borderRadius: 12,
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
