import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { FONTS } from '../styles/typography';
import Ionicons from 'react-native-vector-icons/Ionicons';

const FilterModal = ({
  visible,
  onClose,
  onApply,
  onReset,
  initialMin,
  initialMax,
}) => {
  const [minPrice, setMinPrice] = useState(initialMin?.toString() || '');
  const [maxPrice, setMaxPrice] = useState(initialMax?.toString() || '');

  useEffect(() => {
    setMinPrice(initialMin?.toString() || '');
    setMaxPrice(initialMax?.toString() || '');
  }, [initialMin, initialMax]);

  const handleApply = () => {
    onApply(parseFloat(minPrice) || 0, parseFloat(maxPrice) || 100000);
    onClose();
  };

  const handleReset = () => {
    setMinPrice('0');
    setMaxPrice('100000');
    onReset();
    onClose();
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ justifyContent: 'flex-end' }}
        >
          <Pressable
            style={styles.modalContent}
            onPress={e => e.stopPropagation()}
          >
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Filter By</Text>
              <TouchableOpacity
                onPress={onClose}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={wp('6%')} color="#000" />
              </TouchableOpacity>
            </View>

            <View style={styles.body}>
              <Text style={styles.sectionTitle}>Price Range</Text>
              <View style={styles.priceInputsRow}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Min Price (₹)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0"
                    keyboardType="numeric"
                    value={minPrice}
                    onChangeText={setMinPrice}
                  />
                </View>
                <View style={styles.divider} />
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Max Price (₹)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="100000"
                    keyboardType="numeric"
                    value={maxPrice}
                    onChangeText={setMaxPrice}
                  />
                </View>
              </View>
            </View>

            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.resetButton}
                onPress={handleReset}
              >
                <Text style={styles.resetButtonText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={handleApply}
              >
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </KeyboardAvoidingView>
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
    paddingBottom: Platform.OS === 'ios' ? hp('4%') : hp('2%'),
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
  body: {
    paddingHorizontal: wp('6%'),
    marginBottom: hp('3%'),
  },
  sectionTitle: {
    fontFamily: FONTS.lexend.medium,
    fontSize: wp('4%'),
    color: '#333',
    marginBottom: hp('1.5%'),
  },
  priceInputsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  inputContainer: {
    flex: 1,
  },
  inputLabel: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3%'),
    color: '#777',
    marginBottom: hp('0.5%'),
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: wp('2%'),
    height: hp('5%'),
    paddingHorizontal: wp('3%'),
    fontSize: wp('3.8%'),
    color: '#000',
    fontFamily: FONTS.gilroy.regular,
  },
  divider: {
    width: wp('4%'),
    height: 1,
    backgroundColor: '#E5E5E5',
    marginHorizontal: wp('4%'),
    marginBottom: hp('2.5%'),
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: wp('6%'),
    justifyContent: 'space-between',
    marginTop: hp('2%'),
  },
  resetButton: {
    flex: 1,
    height: hp('5.5%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('3%'),
    borderRadius: wp('2%'),
    borderWidth: 1,
    borderColor: '#F25000',
  },
  resetButtonText: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('4%'),
    color: '#F25000',
  },
  applyButton: {
    flex: 2,
    height: hp('5.5%'),
    backgroundColor: '#F25000',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp('2%'),
  },
  applyButtonText: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('4%'),
    color: '#FFFFFF',
  },
});

export default FilterModal;
