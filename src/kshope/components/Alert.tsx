import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme/colours';

interface AlertButton {
    text: string;
    onPress: () => void;
    style?: 'default' | 'cancel' | 'destructive';
}

interface AlertProps {
    isVisible: boolean;
    title: string;
    message: string;
    buttons: AlertButton[];
    onClose: () => void;
}

const getStyles = (colour: any) => StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colour.halfTransparent
    },
    alertBox: {
        width: '75%',
        backgroundColor: 'white',
        borderRadius: 15,
        paddingTop: 25,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 5,
    },
    message: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        color: '#666',
        paddingHorizontal: 15,
    },
    buttonContainer: {
        flexDirection: 'row',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: colour.lightGrey,
    },
    button: {
        flex: 1,
        paddingVertical: 15,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 17,
        fontWeight: '600',
        color: colour.blue,
    },
    separator: {
        width: StyleSheet.hairlineWidth,
        backgroundColor: colour.lightGrey,
    },
});

const CustomAlert: React.FC<AlertProps> = ({ isVisible, title, message, buttons, onClose }) => {
    const colour = colors;
    const styles = getStyles(colour);
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.alertBox}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>
                    <View style={styles.buttonContainer}>
                        {buttons.map((button, index) => (
                            <React.Fragment key={index}>
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => {
                                        button.onPress();
                                        onClose();
                                    }}
                                >
                                    <Text style={[
                                        styles.buttonText,
                                        button.style === 'destructive' && { color: '#FF3B30' },
                                        button.style === 'cancel' && { fontWeight: 'bold' }
                                    ]}>
                                        {button.text}
                                    </Text>
                                </TouchableOpacity>
                                {index < buttons.length - 1 && <View style={styles.separator} />}
                            </React.Fragment>
                        ))}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default CustomAlert;
