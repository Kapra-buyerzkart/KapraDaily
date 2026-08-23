import React from 'react';
import { Modal, View, StyleSheet, Dimensions } from 'react-native';
import { colors } from '../theme/colours';
import LottieView from 'lottie-react-native';

const windowWidth = Dimensions.get('window').width;

interface LoadingIndicatorProps {
    isVisible: boolean;
    size?: 'small' | 'large';
    color?: string;
}

const getStyles = (colour: any) => StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colour.halfTransparent
    },
    indicatorContainer: {
        padding: 20,
        backgroundColor: colour.white,
        borderRadius: 10,
        shadowColor: colour.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
    isVisible,
    size = 'large',
    color = '#F25000',
}) => {
    const colour = colors;
    const styles = getStyles(colour);
    return (
        <Modal
            transparent={true}
            animationType="fade"
            visible={isVisible}
            onRequestClose={() => { }}
        >
            <View style={styles.container}>
                <LottieView
                    source={require('../assets/Lottie/CartLoader1.json')}
                    style={{
                        height: windowWidth * (40 / 100),
                        width: windowWidth * (40 / 100),
                    }}
                    colorFilters={[
                        { keypath: "cart 2.**", color: '#F25000' },
                        { keypath: "right wheel 2.**", color: '#F25000' },
                        { keypath: "left wheel 2.**", color: '#F25000' },
                        { keypath: "cart.**", color: '#F25000' },
                        { keypath: "right wheel.**", color: '#F25000' },
                        { keypath: "left wheel.**", color: '#F25000' },
                        { keypath: "**.Stroke 1", color: '#F25000' },
                    ]}
                    autoPlay
                    loop
                />
            </View>
        </Modal>
    );
};

export default LoadingIndicator;
