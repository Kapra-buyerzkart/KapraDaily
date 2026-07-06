import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { FONTS } from '../styles/typography';
import { BlurView } from '@react-native-community/blur';
import LottieView from 'lottie-react-native';

const ComingSoonModal = ({
  visible,
  onClose,
  title = 'Coming Soon!',
  message = "We're working hard to bring this feature to you. Stay tuned!",
}) => {
  const scaleValue = useRef(new Animated.Value(0)).current;
  const opacityValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleValue, {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }),
        Animated.timing(opacityValue, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleValue.setValue(0);
      opacityValue.setValue(0);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {Platform.OS === 'ios' ? (
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType="dark"
            blurAmount={10}
            reducedTransparencyFallbackColor="white"
          />
        ) : (
          <View
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: 'rgba(0,0,0,0.7)' },
            ]}
          />
        )}

        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ scale: scaleValue }],
              opacity: opacityValue,
            },
          ]}
        >
          <View style={styles.gradientBorder}>
            <View style={styles.innerContainer}>
              <View style={styles.iconContainer}>
                <LottieView
                  source={require('../assets/Lottie/CartLoader1.json')}
                  autoPlay
                  loop
                  style={styles.lottie}
                />
              </View>

              <Text style={styles.title}>{title}</Text>
              <Text style={styles.message}>{message}</Text>

              <TouchableOpacity
                style={styles.button}
                activeOpacity={0.8}
                onPress={onClose}
              >
                <Text style={styles.buttonText}>Excited to see!</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: wp('85%'),
    borderRadius: wp('8%'),
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  gradientBorder: {
    padding: 2,
    backgroundColor: '#F25000', // Solid orange for now, can use LinearGradient if needed
    borderRadius: wp('8%'),
  },
  innerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: wp('7.5%'),
    padding: wp('6%'),
    alignItems: 'center',
  },
  iconContainer: {
    width: wp('35%'),
    height: wp('35%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  lottie: {
    width: wp('45%'),
    height: wp('45%'),
    position: 'absolute',
  },
  title: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('6%'),
    color: '#000000',
    marginBottom: hp('1.5%'),
    textAlign: 'center',
  },
  message: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('4%'),
    color: '#616161',
    textAlign: 'center',
    marginBottom: hp('4%'),
    lineHeight: wp('6%'),
  },
  button: {
    width: '100%',
    backgroundColor: '#000000',
    paddingVertical: hp('2%'),
    borderRadius: wp('4%'),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  buttonText: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('4.2%'),
    color: '#FFFFFF',
  },
});

export default ComingSoonModal;
