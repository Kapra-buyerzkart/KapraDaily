import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

const ShimmerPlaceholder = ({ style, duration = 1500 }) => {
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const startShimmer = () => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(animatedValue, {
                        toValue: 1,
                        duration: duration,
                        useNativeDriver: true,
                    }),
                    Animated.timing(animatedValue, {
                        toValue: 0,
                        duration: duration,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        };

        startShimmer();
    }, [animatedValue, duration]);

    const translateX = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [-wp('100%'), wp('100%')],
    });

    return (
        <View style={[styles.container, style]}>
            <Animated.View
                style={[
                    styles.shimmer,
                    {
                        transform: [{ translateX }],
                    },
                ]}
            >
                <LinearGradient
                    colors={['#E0E0E0', '#F5F5F5', '#E0E0E0']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.gradient}
                />
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#E0E0E0',
        overflow: 'hidden',
    },
    shimmer: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    gradient: {
        flex: 1,
    },
});

export default ShimmerPlaceholder;
