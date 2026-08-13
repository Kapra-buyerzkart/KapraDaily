import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { splashStyles as styles } from '../styles';

const PulsingDot = ({ delay }) => {
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.delay(delay),
                Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
                Animated.timing(opacity, { toValue: 0.3, duration: 400, useNativeDriver: true }),
            ])
        );
        animation.start();

        return () => animation.stop();
    }, [delay, opacity]);

    return <Animated.View style={[styles.dot, { opacity }]} />;
};

export default PulsingDot;
