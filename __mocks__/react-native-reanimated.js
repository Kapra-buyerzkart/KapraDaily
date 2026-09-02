// Reanimated 4 ships its own mock, but that mock still pulls in
// react-native-worklets, which throws without the native module under Jest.
// This covers the surface the kshope home screen and HomeHeader actually use.
const { View, ScrollView, Text, Image } = require('react-native');

const createAnimatedComponent = Component => Component;

const useSharedValue = initial => ({ value: initial });
const useDerivedValue = fn => ({ value: fn() });
const useAnimatedStyle = fn => fn();
const useAnimatedProps = fn => fn();
const useAnimatedScrollHandler = () => () => {};
const useAnimatedRef = () => ({ current: null });
const useAnimatedReaction = () => {};
const useFrameCallback = () => ({ setActive: () => {} });

const withTiming = (toValue, _config, callback) => {
  if (callback) {
    callback(true);
  }
  return toValue;
};
const withSpring = withTiming;
const withDelay = (_delay, value) => value;
const withRepeat = value => value;
const withSequence = (...values) => values[values.length - 1];
const withDecay = value => value;
const runOnJS = fn => fn;
const runOnUI = fn => fn;
const cancelAnimation = () => {};

const interpolate = (value, input = [], output = []) =>
  output.length ? output[0] : value;
const interpolateColor = (value, input = [], output = []) =>
  output.length ? output[0] : value;

const identity = value => value;
const Easing = {
  linear: identity,
  ease: identity,
  quad: identity,
  cubic: identity,
  bezier: () => identity,
  in: identity,
  out: () => identity,
  inOut: () => identity,
};

const ReduceMotion = { System: 'system', Always: 'always', Never: 'never' };

// Entering/exiting animations are chainable builders in Reanimated; return the
// same object from every builder method so any chain length resolves.
const entering = {};
['duration', 'delay', 'reduceMotion', 'springify', 'easing', 'withInitialValues', 'build'].forEach(
  method => {
    entering[method] = () => entering;
  },
);
const FadeInRight = entering;
const FadeIn = entering;
const FadeOut = entering;

const Animated = {
  View,
  ScrollView,
  Text,
  Image,
  createAnimatedComponent,
};

module.exports = {
  __esModule: true,
  default: Animated,
  createAnimatedComponent,
  useSharedValue,
  useDerivedValue,
  useAnimatedStyle,
  useAnimatedProps,
  useAnimatedScrollHandler,
  useAnimatedRef,
  useAnimatedReaction,
  useFrameCallback,
  withTiming,
  withSpring,
  withDelay,
  withRepeat,
  withSequence,
  withDecay,
  runOnJS,
  runOnUI,
  cancelAnimation,
  interpolate,
  interpolateColor,
  Easing,
  ReduceMotion,
  FadeInRight,
  FadeIn,
  FadeOut,
  Extrapolation: { CLAMP: 'clamp', EXTEND: 'extend', IDENTITY: 'identity' },
  Extrapolate: { CLAMP: 'clamp', EXTEND: 'extend', IDENTITY: 'identity' },
};
