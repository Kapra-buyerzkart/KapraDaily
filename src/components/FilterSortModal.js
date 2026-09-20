import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Pressable,
  Animated,
  PanResponder,
  Platform,
} from 'react-native';
import ReanimatedAnimated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { FONTS } from '../styles/typography';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SORT_OPTIONS = [
  { label: 'Relevance', value: 'relevance' },
  { label: 'Latest', value: 'latest' },
  { label: 'A to Z', value: 'a-z' },
  { label: 'Z to A', value: 'z-a' },
  { label: 'Price: Low to High', value: 'lowToHigh' },
  { label: 'Price: High to Low', value: 'highToLow' },
];

const SELECTION_DURATION = 150;
const CHIP_BG_INACTIVE = '#FFFFFF';
const CHIP_BG_ACTIVE = '#E8F2EE';
const CHIP_BORDER_INACTIVE = '#ECE7DE';
const CHIP_BORDER_ACTIVE = '#0C382E';
const CHIP_TEXT_INACTIVE = '#666666';
const CHIP_TEXT_ACTIVE = '#0C382E';

const AnimatedTouchable =
  ReanimatedAnimated.createAnimatedComponent(TouchableOpacity);
const AnimatedText = ReanimatedAnimated.createAnimatedComponent(Text);

const SortOptionChip = ({ label, isSelected, onPress }) => {
  const progress = useSharedValue(isSelected ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(isSelected ? 1 : 0, {
      duration: SELECTION_DURATION,
    });
  }, [isSelected, progress]);

  const chipStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [CHIP_BG_INACTIVE, CHIP_BG_ACTIVE],
    ),
    borderColor: interpolateColor(
      progress.value,
      [0, 1],
      [CHIP_BORDER_INACTIVE, CHIP_BORDER_ACTIVE],
    ),
  }));

  const labelStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      progress.value,
      [0, 1],
      [CHIP_TEXT_INACTIVE, CHIP_TEXT_ACTIVE],
    ),
  }));

  return (
    <AnimatedTouchable style={[styles.sortOption, chipStyle]} onPress={onPress}>
      <AnimatedText
        style={[
          isSelected ? styles.selectedSortLabel : styles.sortLabel,
          labelStyle,
        ]}
      >
        {label}
      </AnimatedText>
    </AnimatedTouchable>
  );
};

const FilterSortModal = ({
  visible,
  onClose,
  onApply,
  initialSort,
  initialMin,
  initialMax,
}) => {
  const [selectedSort, setSelectedSort] = useState(initialSort);
  const [minPrice, setMinPrice] = useState(initialMin);
  const [maxPrice, setMaxPrice] = useState(initialMax);

  const sliderWidth = wp('75%');
  const minVal = 0;
  const maxVal = 5000;

  const [leftPos, setLeftPos] = useState(
    new Animated.Value((initialMin / maxVal) * sliderWidth),
  );
  const [rightPos, setRightPos] = useState(
    new Animated.Value((initialMax / maxVal) * sliderWidth),
  );

  useEffect(() => {
    setSelectedSort(initialSort);
    setMinPrice(initialMin);
    setMaxPrice(initialMax);
    leftPos.setValue((initialMin / maxVal) * sliderWidth);
    rightPos.setValue((initialMax / maxVal) * sliderWidth);
  }, [visible, initialSort, initialMin, initialMax]);

  const panResponderLeft = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        const newPos = Math.max(
          0,
          Math.min(gestureState.moveX - wp('12.5%'), rightPos._value - 20),
        );
        leftPos.setValue(newPos);
        setMinPrice(Math.round((newPos / sliderWidth) * maxVal));
      },
    }),
  ).current;

  const panResponderRight = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        const newPos = Math.min(
          sliderWidth,
          Math.max(leftPos._value + 20, gestureState.moveX - wp('12.5%')),
        );
        rightPos.setValue(newPos);
        setMaxPrice(Math.round((newPos / sliderWidth) * maxVal));
      },
    }),
  ).current;

  const handleApply = () => {
    onApply({ sort: selectedSort, min: minPrice, max: maxPrice });
    onClose();
  };

  const handleReset = () => {
    setSelectedSort('relevance');
    setMinPrice(0);
    setMaxPrice(5000);
    leftPos.setValue(0);
    rightPos.setValue(sliderWidth);
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={styles.modalContent}
          onPress={e => e.stopPropagation()}
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Sort & Filter</Text>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={wp('6%')} color="#000" />
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            <Text style={styles.sectionTitle}>Sort By</Text>
            <View style={styles.sortContainer}>
              {SORT_OPTIONS.map(option => (
                <SortOptionChip
                  key={option.value}
                  label={option.label}
                  isSelected={selectedSort === option.value}
                  onPress={() => setSelectedSort(option.value)}
                />
              ))}
            </View>

            <Text style={[styles.sectionTitle, { marginTop: hp('3%') }]}>
              Price Range
            </Text>
            <View style={styles.priceDisplay}>
              <Text style={styles.priceLabel}>
                ₹{minPrice} - ₹{maxPrice}+
              </Text>
            </View>

            <View style={styles.sliderContainer}>
              <View style={styles.sliderTrack} />
              <Animated.View
                style={[
                  styles.sliderActiveTrack,
                  {
                    left: leftPos,
                    width: Animated.subtract(rightPos, leftPos),
                  },
                ]}
              />

              <Animated.View
                {...panResponderLeft.panHandlers}
                style={[
                  styles.sliderThumb,
                  { left: Animated.subtract(leftPos, 10) },
                ]}
              />
              <Animated.View
                {...panResponderRight.panHandlers}
                style={[
                  styles.sliderThumb,
                  { left: Animated.subtract(rightPos, 10) },
                ]}
              />
            </View>
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLimitText}>₹0</Text>
              <Text style={styles.sliderLimitText}>₹5000+</Text>
            </View>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyButtonText}>Apply Changes</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: '#ECE7DE',
    paddingBottom: hp('4%'),
    paddingTop: hp('2%'),
    maxHeight: hp('85%'),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp('6%'),
    marginBottom: hp('2%'),
    paddingBottom: hp('1%'),
    borderBottomWidth: 1,
    borderBottomColor: '#ECE7DE',
  },
  headerTitle: {
    fontFamily: 'CormorantGaramond-SemiBold',
    fontSize: wp('5.2%'),
    color: '#12372A',
    letterSpacing: -0.2,
  },
  body: {
    paddingHorizontal: wp('6%'),
  },
  sectionTitle: {
    fontFamily: 'Lexend-Medium',
    fontSize: wp('4%'),
    color: '#12372A',
    marginBottom: hp('1.5%'),
  },
  sortContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp('2%'),
  },
  sortOption: {
    paddingHorizontal: wp('3.5%'),
    paddingVertical: hp('0.9%'),
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ECE7DE',
    marginBottom: hp('1%'),
  },
  sortLabel: {
    fontFamily: 'Lexend-Regular',
    fontSize: wp('3.2%'),
  },
  selectedSortLabel: {
    fontFamily: 'Lexend-Medium',
  },
  priceDisplay: {
    alignItems: 'center',
    marginBottom: hp('1%'),
  },
  priceLabel: {
    fontFamily: 'Lexend-Medium',
    fontSize: wp('4%'),
    color: '#0C382E',
  },
  sliderContainer: {
    height: 40,
    justifyContent: 'center',
    marginHorizontal: wp('6.5%'),
    paddingHorizontal: 10,
  },
  sliderTrack: {
    height: 4,
    backgroundColor: '#ECE7DE',
    borderRadius: 2,
  },
  sliderActiveTrack: {
    height: 4,
    backgroundColor: '#0C382E',
    position: 'absolute',
    top: 18,
  },
  sliderThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#0C382E',
    position: 'absolute',
    top: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: wp('6.5%'),
  },
  sliderLimitText: {
    fontFamily: 'Lexend-Regular',
    fontSize: wp('2.8%'),
    color: '#888888',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: wp('6%'),
    justifyContent: 'space-between',
    marginTop: hp('4%'),
  },
  resetButton: {
    flex: 1,
    height: hp('5.6%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('3%'),
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D8D4CC',
    backgroundColor: '#FAF8F5',
  },
  resetButtonText: {
    fontFamily: 'Lexend-Medium',
    fontSize: wp('3.8%'),
    color: '#12372A',
  },
  applyButton: {
    flex: 2,
    height: hp('5.6%'),
    backgroundColor: '#0C382E',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
  },
  applyButtonText: {
    fontFamily: 'Lexend-Medium',
    fontSize: wp('3.8%'),
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
});

export default FilterSortModal;
