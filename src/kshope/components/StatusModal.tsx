import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Dimensions,
} from 'react-native';
import { colors } from '../theme/colours';
import { Fonts } from '../theme/fonts';
import { AppIcons } from '../assets/icons';

const { width } = Dimensions.get('window');

interface StatusModalProps {
    visible: boolean;
    onClose: () => void;
    type: 'success' | 'error' | 'warning' | any;
    title: string;
    message: string;
}

const StatusModal: React.FC<StatusModalProps> = ({
    visible,
    onClose,
    type = 'success',
    title,
    message
}) => {
    const scaleAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }).start();
        } else {
            scaleAnim.setValue(0);
        }
    }, [visible]);

    const getIcon = () => {
        switch (type) {
            case 'error':
                return <AppIcons.Delete color={colors.white} size={32} />;
            case 'warning':
                return <AppIcons.ArrowUp color={colors.white} size={32} style={{ transform: [{ rotate: '180deg' }] }} />;
            default:
                return <AppIcons.Check color={colors.white} size={32} />;
        }
    };

    const getIconBackground = () => {
        switch (type) {
            case 'error': return '#FF5252';
            case 'warning': return '#FFAB40';
            default: return colors.themeTeal;
        }
    };

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <Animated.View style={[styles.content, { transform: [{ scale: scaleAnim }] }]}>
                    <View style={[styles.iconContainer, { backgroundColor: getIconBackground() }]}>
                        {getIcon()}
                    </View>

                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>

                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={onClose}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.closeButtonText}>OK</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    content: {
        backgroundColor: colors.white,
        borderRadius: 30,
        padding: 30,
        width: '100%',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontFamily: Fonts.gilroyBold,
        color: colors.black,
        marginBottom: 12,
        textAlign: 'center',
    },
    message: {
        fontSize: 14,
        fontFamily: Fonts.gilroyMedium,
        color: '#666',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 20,
    },
    closeButton: {
        backgroundColor: colors.themeTeal,
        paddingHorizontal: 40,
        paddingVertical: 12,
        borderRadius: 15,
        width: '100%',
        alignItems: 'center',
    },
    closeButtonText: {
        color: colors.white,
        fontFamily: Fonts.gilroyBold,
        fontSize: 16,
    },
});

export default StatusModal;
