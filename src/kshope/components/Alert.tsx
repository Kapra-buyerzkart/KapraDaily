import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

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

const CustomAlert: React.FC<AlertProps> = ({
  isVisible,
  title,
  message,
  buttons,
  onClose,
}) => {
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
                  activeOpacity={0.8}
                  onPress={() => {
                    button.onPress();
                    onClose();
                  }}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      button.style === 'destructive' && styles.destructiveText,
                      button.style === 'cancel' && styles.cancelText,
                    ]}
                  >
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

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 24,
  },
  alertBox: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingTop: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ECE7DE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 18,
    elevation: 8,
  },
  title: {
    fontSize: 21,
    fontFamily: 'CormorantGaramond-SemiBold',
    color: '#12372A',
    textAlign: 'center',
    marginBottom: 8,
    paddingHorizontal: 16,
    letterSpacing: -0.2,
  },
  message: {
    fontSize: 13.5,
    fontFamily: 'Lexend-Regular',
    color: '#666666',
    textAlign: 'center',
    marginBottom: 22,
    lineHeight: 19,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#ECE7DE',
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontFamily: 'Lexend-Medium',
    color: '#0C382E',
  },
  destructiveText: {
    color: '#B83A3A',
  },
  cancelText: {
    color: '#666666',
  },
  separator: {
    width: 1,
    backgroundColor: '#ECE7DE',
  },
});

export default CustomAlert;
