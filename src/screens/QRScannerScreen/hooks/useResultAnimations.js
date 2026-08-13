import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { VALID_DISMISS_MS } from '../constants';

const useResultAnimations = ({ scannedValue, showVerdict, isValid }) => {
  const cardAnim = useRef(new Animated.Value(0)).current;
  const iconAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!scannedValue) {
      cardAnim.setValue(0);
      return;
    }
    Animated.spring(cardAnim, {
      toValue: 1,
      friction: 8,
      tension: 70,
      useNativeDriver: true,
    }).start();
  }, [scannedValue, cardAnim]);

  useEffect(() => {
    if (!showVerdict) {
      iconAnim.setValue(0);
      return;
    }
    Animated.spring(iconAnim, {
      toValue: 1,
      friction: 4,
      tension: 90,
      useNativeDriver: true,
    }).start();
  }, [showVerdict, iconAnim]);

  useEffect(() => {
    if (!isValid) return;
    progressAnim.setValue(1);
    Animated.timing(progressAnim, {
      toValue: 0,
      duration: VALID_DISMISS_MS,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, [isValid, progressAnim]);

  return { cardAnim, iconAnim, progressAnim };
};

export default useResultAnimations;
