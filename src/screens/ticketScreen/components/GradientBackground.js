import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { splashStyles as styles } from '../styles';

const GradientBackground = ({ children }) => {
    return (
        <LinearGradient
            colors={['#0A0415', '#160B29', '#030107']}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            {children}
        </LinearGradient>
    );
};

export default GradientBackground;
