import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

const DEFAULT_BASE = '#E0E0E0';
const DEFAULT_COLORS = ['#EBEBEB', '#F5F5F5', '#EBEBEB'];

const ShimmerPlaceholder = ({
    style,
    duration = 1500,
    width = wp('100%'),
    baseColor = DEFAULT_BASE,
    colors = DEFAULT_COLORS,
    ...rest
}) => {
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const loop = Animated.loop(
            Animated.timing(animatedValue, {
                toValue: 1,
                duration: duration,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        );
        loop.start();

        // Without this the loop keeps driving a detached node after unmount —
        // costly when dozens of shimmers cycle through a list.
        return () => loop.stop();
    }, [animatedValue, duration]);

    const translateX = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [-width, width],
    });

    return (
        <View
            {...rest}
            style={[styles.container, { backgroundColor: baseColor }, style]}
        >
            <Animated.View
                style={[
                    styles.shimmer,
                    {
                        transform: [{ translateX }],
                    },
                ]}
            >
                <LinearGradient
                    colors={colors}
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

export default React.memo(ShimmerPlaceholder);
