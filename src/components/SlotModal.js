import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  Platform,
  StyleSheet,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { FONTS } from '../styles/typography';

const SlotModal = ({
  visible,
  onClose,
  selectedDeliveryType,
  setSelectedDeliveryType,
  selectedDateIndex,
  onSelectDate,
  selectedSlot,
  setSelectedSlot,
  datesList,
  slotsByDate,
  deliveryModes = [],
}) => (
  <Modal visible={visible} animationType="slide" transparent>
    <View style={styles.modalOverlay}>
      <View style={styles.modalContainer}>
        <View style={styles.modalHeaderView}>
          <Text style={styles.modalHeaderText}>Schedule Your Time</Text>
          <TouchableOpacity onPress={onClose}>
            <Image
              style={styles.closeIcon}
              source={require('../assets/images/close_two.png')}
            />
          </TouchableOpacity>
        </View>
        <ScrollView>
          {deliveryModes.map(mode => {
            const isSelected = selectedDeliveryType === mode.type;

            // Handle "quick" or "express" type
            if (mode.type === 'quick' || mode.type === 'express') {
              return (
                <View key={mode.type} style={styles.quickDeliveryContainer}>
                  <TouchableOpacity
                    onPress={() => setSelectedDeliveryType(mode.type)}
                    style={
                      isSelected ? styles.radioSelected : styles.radioUnselected
                    }
                  />
                  <View style={styles.quickDeliveryInnerView}>
                    <Image
                      style={styles.lightingImage}
                      source={require('../assets/images/lighting.png')}
                    />
                    <Text style={styles.timeTextTwo}>
                      {mode.name || '20 mins'}
                    </Text>
                  </View>
                  <Text style={styles.quickDeliveryText}>
                    {mode.description || 'Quick delivery'}
                  </Text>
                </View>
              );
            }

            // Handle "slotted" or "slot" type
            if (mode.type === 'slot' || mode.type === 'slotted') {
              return (
                <View key={mode.type} style={styles.slotDeliveryContainer}>
                  <View style={styles.slotDeliveryInnerView}>
                    <TouchableOpacity
                      onPress={() => setSelectedDeliveryType(mode.type)}
                      style={
                        isSelected
                          ? styles.radioSelected
                          : styles.radioUnselected
                      }
                    />
                    <Image
                      style={styles.clockImage}
                      source={require('../assets/images/clock.png')}
                    />
                    <Text style={styles.timeTextTwo}>
                      {mode.name || 'Slot Delivery'}
                    </Text>
                  </View>

                  {/* Date Selection */}
                  <View style={{ marginTop: hp('2.5%') }}>
                    <Text style={styles.sectionTitle}>Select Date</Text>
                    <View style={styles.datesContainer}>
                      {datesList.map((item, index) => (
                        <TouchableOpacity
                          key={item.id}
                          onPress={() => onSelectDate(index)}
                          style={[
                            styles.dateCard,
                            selectedDateIndex === index && styles.dateSelected,
                          ]}
                        >
                          <Text style={styles.dateLabelText}>{item.label}</Text>
                          <Text style={styles.dateText}>{item.formatted}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  {/* Time Selection */}
                  <View style={{ marginTop: hp('2.5%') }}>
                    <Text style={styles.sectionTitle}>Select Time</Text>
                    <View style={styles.slotsContainer}>
                      {slotsByDate[selectedDateIndex]?.map((slot, index) => (
                        <TouchableOpacity
                          key={index}
                          onPress={() => setSelectedSlot(slot)}
                          style={[
                            styles.slotCard,
                            selectedSlot === slot && styles.slotSelected,
                          ]}
                        >
                          <Text
                            style={[
                              styles.slotText,
                              selectedSlot === slot && styles.slotTextSelected,
                            ]}
                          >
                            {slot}
                          </Text>
                        </TouchableOpacity>
                      ))}
                      {(!slotsByDate[selectedDateIndex] ||
                        slotsByDate[selectedDateIndex].length === 0) && (
                        <Text style={styles.dateLabelText}>
                          No slots available for this date
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
              );
            }

            return null;
          })}

          {deliveryModes.length === 0 && (
            <Text style={styles.quickDeliveryText}>
              Loading delivery options...
            </Text>
          )}
        </ScrollView>
      </View>
    </View>
  </Modal>
);

export default React.memo(SlotModal);

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: wp('4.65%'),
    paddingVertical: hp('2%'),
    maxHeight: hp('80%'),
  },
  modalHeaderView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  modalHeaderText: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('4.5%'),
    color: '#000000',
  },
  closeIcon: {
    width: wp('6%'),
    height: wp('6%'),
    resizeMode: 'contain',
  },
  quickDeliveryContainer: {
    borderWidth: 1,
    borderColor: '#DADADA',
    borderRadius: 12,
    padding: wp('3%'),
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  radioSelected: {
    width: wp('5%'),
    height: wp('5%'),
    borderRadius: wp('2.5%'),
    borderWidth: 5,
    borderColor: '#F25000',
  },
  radioUnselected: {
    width: wp('5%'),
    height: wp('5%'),
    borderRadius: wp('2.5%'),
    borderWidth: 1,
    borderColor: '#DADADA',
  },
  quickDeliveryInnerView: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F0',
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.5%'),
    borderRadius: 50,
    marginLeft: wp('3%'),
    marginRight: wp('3%'),
  },
  lightingImage: {
    width: wp('4%'),
    height: wp('4%'),
    resizeMode: 'contain',
  },
  timeTextTwo: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.5%'),
    color: '#F25000',
    marginLeft: wp('1%'),
  },
  quickDeliveryText: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('4%'),
    color: '#000000',
  },
  slotDeliveryContainer: {
    borderWidth: 1,
    borderColor: '#DADADA',
    borderRadius: 12,
    padding: wp('3%'),
  },
  slotDeliveryInnerView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('1%'),
  },
  clockImage: {
    width: wp('5%'),
    height: wp('5%'),
    resizeMode: 'contain',
    marginLeft: wp('3%'),
    marginRight: wp('3%'),
  },
  sectionTitle: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.5%'),
    color: '#000000',
  },
  datesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp('1.5%'),
  },
  dateCard: {
    borderWidth: 1,
    borderColor: '#DADADA',
    borderRadius: 8,
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('3%'),
    alignItems: 'center',
    width: wp('28%'),
  },
  dateSelected: {
    borderColor: '#F25000',
    backgroundColor: '#FFF5F0',
  },
  dateLabelText: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3%'),
    color: '#777777',
  },
  dateText: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.5%'),
    color: '#000000',
    marginTop: hp('0.5%'),
  },
  slotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: hp('1.5%'),
    gap: wp('3%'),
  },
  slotCard: {
    borderWidth: 1,
    borderColor: '#DADADA',
    borderRadius: 8,
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('4%'),
  },
  slotSelected: {
    borderColor: '#F25000',
    backgroundColor: '#FFF5F0',
  },
  slotText: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.5%'),
    color: '#777777',
  },
  slotTextSelected: {
    color: '#F25000',
  },
});
