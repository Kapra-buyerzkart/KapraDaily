import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { FONTS } from '../styles/typography';
import LinearGradient from 'react-native-linear-gradient';

const RatingModal = ({
  visible,
  onClose,
  onSubmit,
  rating,
  title,
  placeholder = 'Tell us about your experience...',
}) => {
  const [review, setReview] = useState('');

  const handleSubmit = () => {
    onSubmit(review);
    setReview('');
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalContainer}>
            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Image
                  style={styles.closeIcon}
                  source={require('../assets/images/close_two.png')}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.ratingContainer}>
              <Text style={styles.ratingLabel}>Your Rating</Text>
              <View style={styles.starContainer}>
                {[1, 2, 3, 4, 5].map(star => (
                  <Image
                    key={star}
                    style={[
                      styles.starIcon,
                      { tintColor: star <= rating ? '#B68D40' : '#E5E0D8' },
                    ]}
                    source={require('../assets/images/star.png')}
                  />
                ))}
              </View>
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Write a Review</Text>
              <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor="#999999"
                multiline
                value={review}
                onChangeText={setReview}
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity
              activeOpacity={0.88}
              onPress={handleSubmit}
              style={styles.submitButton}
            >
              <Text style={styles.submitText}>Submit Rating</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: '#ECE7DE',
    paddingHorizontal: wp('6%'),
    paddingTop: hp('2.5%'),
    paddingBottom: hp('4.5%'),
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  title: {
    fontFamily: 'CormorantGaramond-SemiBold',
    fontSize: wp('5.4%'),
    color: '#12372A',
    letterSpacing: -0.2,
  },
  closeButton: {
    padding: wp('2%'),
  },
  closeIcon: {
    width: wp('4%'),
    height: wp('4%'),
    tintColor: '#666666',
  },
  ratingContainer: {
    alignItems: 'center',
    marginBottom: hp('2.5%'),
  },
  ratingLabel: {
    fontFamily: 'Lexend-Medium',
    fontSize: wp('3.6%'),
    color: '#666666',
    marginBottom: hp('1%'),
  },
  starContainer: {
    flexDirection: 'row',
  },
  starIcon: {
    width: wp('8%'),
    height: wp('8%'),
    marginHorizontal: wp('1%'),
  },
  inputWrapper: {
    marginBottom: hp('3%'),
  },
  label: {
    fontFamily: 'Lexend-Medium',
    fontSize: wp('3.6%'),
    color: '#12372A',
    marginBottom: hp('1%'),
  },
  input: {
    height: hp('14%'),
    backgroundColor: '#FAF8F5',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ECE7DE',
    padding: wp('4%'),
    fontFamily: 'Lexend-Regular',
    fontSize: wp('3.5%'),
    color: '#12372A',
  },
  submitButton: {
    height: hp('5.8%'),
    borderRadius: 14,
    backgroundColor: '#0C382E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitText: {
    fontFamily: 'Lexend-Medium',
    fontSize: wp('3.8%'),
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
});

export default RatingModal;
