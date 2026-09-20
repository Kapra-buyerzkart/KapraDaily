import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ReturnItemModal = ({
  visible,
  onClose,
  onSubmit,
  item,
  title = 'Return Item',
}) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError('Please enter a reason for return');
      return;
    }
    if (onSubmit) {
      onSubmit(reason);
    }
    setReason('');
    setError('');
    onClose();
  };

  const handleClose = () => {
    setReason('');
    setError('');
    onClose();
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardAvoidingView}
          >
            <View style={styles.modalContainer}>
              <View style={styles.iconCircle}>
                <Ionicons
                  name="arrow-undo-outline"
                  size={wp('7%')}
                  color="#0C382E"
                />
              </View>

              <Text style={styles.title}>{title}</Text>
              <Text style={styles.message}>
                Please provide a reason for returning this item.
              </Text>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter reason for return..."
                  placeholderTextColor="#999"
                  value={reason}
                  onChangeText={text => {
                    setReason(text);
                    if (error) setError('');
                  }}
                  multiline
                  numberOfLines={3}
                />
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  activeOpacity={0.8}
                  onPress={handleClose}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.confirmButton]}
                  activeOpacity={0.88}
                  onPress={handleConfirm}
                >
                  <Text style={styles.confirmButtonText}>Confirm Return</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
  },
  keyboardAvoidingView: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: hp('3%'),
    paddingHorizontal: wp('5.5%'),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ECE7DE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 18,
    elevation: 8,
  },
  iconCircle: {
    width: wp('14%'),
    height: wp('14%'),
    borderRadius: wp('7%'),
    backgroundColor: '#E8F2EE',
    borderWidth: 1,
    borderColor: '#D1E6DD',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp('1.8%'),
  },
  title: {
    fontFamily: 'CormorantGaramond-SemiBold',
    fontSize: wp('5.2%'),
    color: '#12372A',
    marginBottom: hp('0.8%'),
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  message: {
    fontFamily: 'Lexend-Regular',
    fontSize: wp('3.3%'),
    color: '#666666',
    textAlign: 'center',
    marginBottom: hp('2.5%'),
    lineHeight: wp('4.8%'),
  },
  inputContainer: {
    width: '100%',
    marginBottom: hp('2.5%'),
  },
  input: {
    fontFamily: 'Lexend-Regular',
    fontSize: wp('3.4%'),
    color: '#12372A',
    borderWidth: 1,
    borderColor: '#ECE7DE',
    borderRadius: 14,
    padding: wp('3.5%'),
    textAlignVertical: 'top',
    minHeight: hp('10%'),
    backgroundColor: '#FAF8F5',
  },
  errorText: {
    fontFamily: 'Lexend-Regular',
    fontSize: wp('3%'),
    color: '#B83A3A',
    marginTop: hp('0.5%'),
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    gap: wp('3%'),
  },
  button: {
    flex: 1,
    height: hp('5.6%'),
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: '#D8D4CC',
  },
  confirmButton: {
    backgroundColor: '#0C382E',
  },
  cancelButtonText: {
    fontFamily: 'Lexend-Medium',
    fontSize: wp('3.6%'),
    color: '#12372A',
  },
  confirmButtonText: {
    fontFamily: 'Lexend-Medium',
    fontSize: wp('3.6%'),
    color: '#FFFFFF',
  },
});

export default ReturnItemModal;
