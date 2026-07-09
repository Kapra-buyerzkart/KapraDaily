import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Pressable,
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
  { label: 'A to Z', value: 'name_asc' },
  { label: 'Z to A', value: 'name_desc' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
];

const SELECTION_DURATION = 150;
const LABEL_INACTIVE = '#666';
const LABEL_ACTIVE = '#F25000';
const RADIO_INACTIVE = '#DADADA';
const RADIO_ACTIVE = '#F25000';

const AnimatedText = ReanimatedAnimated.createAnimatedComponent(Text);
const AnimatedRadio = ReanimatedAnimated.createAnimatedComponent(View);

const SortOptionRow = ({ label, isSelected, onPress }) => {
  const progress = useSharedValue(isSelected ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(isSelected ? 1 : 0, {
      duration: SELECTION_DURATION,
    });
  }, [isSelected, progress]);

  const labelStyle = useAnimatedStyle(() => ({
    color: interpolateColor(progress.value, [0, 1], [LABEL_INACTIVE, LABEL_ACTIVE]),
  }));

  const radioStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      progress.value,
      [0, 1],
      [RADIO_INACTIVE, RADIO_ACTIVE],
    ),
  }));

  return (
    <TouchableOpacity style={styles.optionItem} onPress={onPress}>
      <AnimatedText
        style={[isSelected ? styles.selectedOptionLabel : styles.optionLabel, labelStyle]}
      >
        {label}
      </AnimatedText>
      <AnimatedRadio style={[styles.radio, radioStyle]}>
        {isSelected && <View style={styles.radioInner} />}
      </AnimatedRadio>
    </TouchableOpacity>
  );
};

const SortModal = ({ visible, onClose, onSelect, selectedValue }) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Sort By</Text>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={wp('6%')} color="#000" />
            </TouchableOpacity>
          </View>

          {SORT_OPTIONS.map(option => (
            <SortOptionRow
              key={option.value}
              label={option.label}
              isSelected={selectedValue === option.value}
              onPress={() => {
                onSelect(option.value);
                onClose();
              }}
            />
          ))}
        </View>
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
    borderTopLeftRadius: wp('6%'),
    borderTopRightRadius: wp('6%'),
    paddingBottom: hp('4%'),
    paddingTop: hp('2%'),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp('6%'),
    marginBottom: hp('2%'),
    paddingBottom: hp('1%'),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontFamily: FONTS.lexend.semiBold,
    fontSize: wp('4.5%'),
    color: '#000000',
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('6%'),
  },
  optionLabel: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3.8%'),
  },
  selectedOptionLabel: {
    fontFamily: FONTS.gilroy.medium,
  },
  radio: {
    width: wp('5%'),
    height: wp('5%'),
    borderRadius: wp('2.5%'),
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: wp('2.5%'),
    height: wp('2.5%'),
    borderRadius: wp('1.25%'),
    backgroundColor: '#F25000',
  },
});

export default SortModal;
