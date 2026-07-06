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
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { FONTS } from '../styles/typography';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AppButton from './AppButton';

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
              <View style={styles.iconContainer}>
                <MaterialIcons
                  name="assignment-return"
                  size={wp('12%')}
                  color="#F04B1B"
                />
              </View>

              <Text style={styles.title}>{title}</Text>
              <Text style={styles.message}>
                Please provide a reason for returning this item.
              </Text>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter reason (e.g., Damaged product)"
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
                <AppButton
                  title="Cancel"
                  onPress={handleClose}
                  variant="outline"
                  style={styles.cancelButton}
                  textStyle={styles.cancelButtonText}
                />

                <AppButton
                  title="Confirm Return"
                  onPress={handleConfirm}
                  style={styles.confirmButton}
                  textStyle={styles.confirmButtonText}
                />
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardAvoidingView: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    width: wp('85%'),
    backgroundColor: '#FFFFFF',
    borderRadius: wp('5%'),
    padding: wp('5%'),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  iconContainer: {
    marginBottom: hp('2%'),
  },
  title: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('4.5%'),
    color: '#000000',
    marginBottom: hp('1%'),
    textAlign: 'center',
  },
  message: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3.5%'),
    color: '#666666',
    textAlign: 'center',
    marginBottom: hp('2%'),
  },
  inputContainer: {
    width: '100%',
    marginBottom: hp('3%'),
  },
  input: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3.5%'),
    color: '#000000',
    borderWidth: 1,
    borderColor: '#DADADA',
    borderRadius: wp('2%'),
    padding: wp('3%'),
    textAlignVertical: 'top',
    minHeight: hp('10%'),
    backgroundColor: '#FAFAFA',
  },
  errorText: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3%'),
    color: 'red',
    marginTop: hp('0.5%'),
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    gap: wp('3%'),
  },
  modalButton: {
    flex: 1,
  },
  cancelButtonText: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.5%'),
    color: '#666666',
  },
  confirmButtonText: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('3.5%'),
    color: '#FFFFFF',
  },
  cancelButton: {
    flex: 1,
    minHeight: hp('5%'),
    paddingVertical: hp('0.8%'),
  },
  confirmButton: {
    flex: 1.2,
    minHeight: hp('5%'),
    paddingVertical: hp('0.8%'),
  },
});

export default ReturnItemModal;
