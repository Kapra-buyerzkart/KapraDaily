import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

export const useTicketAnimations = (width, onComplete) => {
    const logoScale = useRef(new Animated.Value(0.3)).current;
    const logoOpacity = useRef(new Animated.Value(0)).current;
    const taglineOpacity = useRef(new Animated.Value(0)).current;
    const taglineTranslateY = useRef(new Animated.Value(30)).current;
    const circleScale1 = useRef(new Animated.Value(0)).current;
    const circleScale2 = useRef(new Animated.Value(0)).current;
    const circleOpacity1 = useRef(new Animated.Value(0.3)).current;
    const circleOpacity2 = useRef(new Animated.Value(0.2)).current;
    const fadeToBlackOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Background circles animation
        const circleAnimation1 = Animated.loop(
            Animated.sequence([
                Animated.parallel([
                    Animated.timing(circleScale1, { toValue: 1.5, duration: 3000, useNativeDriver: true }),
                    Animated.timing(circleOpacity1, { toValue: 0, duration: 3000, useNativeDriver: true }),
                ]),
                Animated.parallel([
                    Animated.timing(circleScale1, { toValue: 0, duration: 0, useNativeDriver: true }),
                    Animated.timing(circleOpacity1, { toValue: 0.3, duration: 0, useNativeDriver: true }),
                ]),
            ])
        );

        const circleAnimation2 = Animated.loop(
            Animated.sequence([
                Animated.delay(800),
                Animated.parallel([
                    Animated.timing(circleScale2, { toValue: 1.5, duration: 3000, useNativeDriver: true }),
                    Animated.timing(circleOpacity2, { toValue: 0, duration: 3000, useNativeDriver: true }),
                ]),
                Animated.parallel([
                    Animated.timing(circleScale2, { toValue: 0, duration: 0, useNativeDriver: true }),
                    Animated.timing(circleOpacity2, { toValue: 0.2, duration: 0, useNativeDriver: true }),
                ]),
            ])
        );

        // Main animation sequence
        const mainAnimation = Animated.sequence([
            // Phase 1: Logo appears with spring
            Animated.parallel([
                Animated.spring(logoScale, {
                    toValue: 1,
                    friction: 4,
                    tension: 50,
                    useNativeDriver: true,
                }),
                Animated.timing(logoOpacity, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }),
            ]),
            // Phase 2: Tagline slides up
            Animated.delay(200),
            Animated.parallel([
                Animated.timing(taglineOpacity, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.spring(taglineTranslateY, {
                    toValue: 0,
                    friction: 6,
                    tension: 40,
                    useNativeDriver: true,
                }),
            ]),
            // Phase 4: Fade to black
            Animated.timing(fadeToBlackOpacity, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
        ]);

        circleAnimation1.start();
        circleAnimation2.start();
        mainAnimation.start(({ finished }) => {
            if (finished && onComplete) {
                onComplete();
            }
        });

        return () => {
            circleAnimation1.stop();
            circleAnimation2.stop();
            mainAnimation.stop();
        };
    }, [
        circleOpacity1,
        circleOpacity2,
        circleScale1,
        circleScale2,
        logoOpacity,
        logoScale,
        taglineOpacity,
        taglineTranslateY,
        fadeToBlackOpacity,
        width,
        onComplete,
    ]);

    return {
        logoScale,
        logoOpacity,
        taglineOpacity,
        taglineTranslateY,
        circleScale1,
        circleScale2,
        circleOpacity1,
        circleOpacity2,
        fadeToBlackOpacity,
    };
};
