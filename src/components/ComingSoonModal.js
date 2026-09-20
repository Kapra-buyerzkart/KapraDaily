import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { BlurView } from '@sbaiahmed1/react-native-blur';
import LuxuryLoader from './LuxuryLoader';

const ComingSoonModal = ({
  visible,
  onClose,
  title = 'Coming Soon',
  message = "We're perfecting this experience for you. Stay tuned!",
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
              { backgroundColor: 'rgba(0,0,0,0.65)' },
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
          <View style={styles.innerContainer}>
            <View style={styles.iconContainer}>
              <LuxuryLoader fullscreen={false} />
            </View>

            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>

            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.88}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Got it</Text>
            </TouchableOpacity>
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
    paddingHorizontal: wp('6%'),
  },
  modalContainer: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECE7DE',
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
  },
  innerContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: hp('3%'),
    paddingHorizontal: wp('6%'),
    alignItems: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('1.8%'),
  },
  title: {
    fontFamily: 'CormorantGaramond-SemiBold',
    fontSize: wp('5.8%'),
    color: '#12372A',
    marginBottom: hp('1%'),
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  message: {
    fontFamily: 'Lexend-Regular',
    fontSize: wp('3.5%'),
    color: '#666666',
    textAlign: 'center',
    marginBottom: hp('3%'),
    lineHeight: wp('5%'),
    paddingHorizontal: wp('2%'),
  },
  button: {
    width: '100%',
    backgroundColor: '#0C382E',
    height: hp('5.8%'),
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: 'Lexend-Medium',
    fontSize: wp('3.7%'),
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
});

export default ComingSoonModal;
