import React from 'react';
import { Modal } from 'react-native';
import LuxuryLoader from '../../components/LuxuryLoader';

interface LoadingIndicatorProps {
    isVisible: boolean;
    size?: 'small' | 'large';
    color?: string;
    text?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
    isVisible,
    text,
}) => {
    if (!isVisible) return null;

    return (
        <Modal
            transparent={true}
            animationType="fade"
            visible={isVisible}
            onRequestClose={() => { }}
            statusBarTranslucent
        >
            <LuxuryLoader text={text} />
        </Modal>
    );
};

export default LoadingIndicator;
