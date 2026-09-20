import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { FONTS } from '../styles/typography';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { getDeliverySlotsApi } from '../api/cartService';
import CustomModal, { MODAL_POSITION } from './modal/CustomModal';
import BallPulse from './BallPulse';

const DeliverySlotModal = ({
  visible,
  onClose,
  onSelectSlot,
  pincodeAreaId,
}) => {
  const [loading, setLoading] = useState(true);
  const [slotGroups, setSlotGroups] = useState([]);
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const modalRef = useRef(null);

  useEffect(() => {
    if (visible) {
      modalRef.current?.open();
    } else {
      modalRef.current?.close();
    }
  }, [visible]);

  useEffect(() => {
    if (visible) {
      fetchSlots();
    }
  }, [visible, pincodeAreaId]);

  const fetchSlots = async () => {
    try {
      setLoading(true);
      const response = await getDeliverySlotsApi(pincodeAreaId);
      console.log('🕐 [SLOTS] Response:', response);
      if (response?.success && response?.data?.items) {
        setSlotGroups(response.data.items);
        setSelectedDay(0);
        setSelectedSlot(null);
      } else {
        setSlotGroups([]);
      }
    } catch (error) {
      console.error('Error fetching delivery slots:', error);
      setSlotGroups([]);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (selectedSlot) {
      const dayGroup = slotGroups[selectedDay];
      onSelectSlot({
        date: selectedSlot.slotDate,
        dateDisplay: dayGroup?.title || '',
        slotValue: selectedSlot.slotValue,
        slotDisplay: selectedSlot.slotDisplayText,
        deliverySlotId: selectedSlot.deliverySlotId,
      });
      onClose();
    }
  };

  const currentSlots = slotGroups[selectedDay]?.slots || [];

  return (
    <CustomModal
      ref={modalRef}
      position={MODAL_POSITION.BOTTOM}
      maxHeight={hp('65%')}
      scrollable={false}
      onClose={onClose}
      contentStyle={styles.modalContent}
    >
      {}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialCommunityIcons
            name="clock-outline"
            size={wp('5.5%')}
            color="#0C382E"
          />
          <Text style={styles.headerTitle}>Select Delivery Slot</Text>
        </View>
        <TouchableOpacity
          onPress={onClose}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="close" size={wp('5.5%')} color="#666666" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <BallPulse size="large" color="#0C382E" />
          <Text style={styles.loadingText}>Loading available slots...</Text>
        </View>
      ) : slotGroups.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons
            name="calendar-remove-outline"
            size={wp('12%')}
            color="#CCCCCC"
          />
          <Text style={styles.emptyText}>No delivery slots available</Text>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <View style={styles.dayTabsContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.dayTabsScroll}
            >
              {slotGroups.map((group, index) => {
                const isActive = selectedDay === index;
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      setSelectedDay(index);
                      setSelectedSlot(null);
                    }}
                    activeOpacity={0.8}
                    style={{ marginRight: wp('2.5%') }}
                  >
                    <View
                      style={[
                        styles.dayTab,
                        isActive && styles.dayTabActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayTabText,
                          isActive && styles.dayTabTextActive,
                        ]}
                      >
                        {group.title}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          <ScrollView
            style={styles.slotsScrollView}
            showsVerticalScrollIndicator={false}
          >
            {currentSlots.map((slot, index) => {
              const isSelected =
                selectedSlot?.deliverySlotId === slot.deliverySlotId &&
                selectedSlot?.slotDate === slot.slotDate;
              const isAvailable = slot.isAvailable === 1;

              return (
                <TouchableOpacity
                  key={`${slot.deliverySlotId}-${index}`}
                  style={[
                    styles.slotCard,
                    isSelected && styles.slotCardSelected,
                    !isAvailable && styles.slotCardDisabled,
                  ]}
                  onPress={() => isAvailable && setSelectedSlot(slot)}
                  activeOpacity={isAvailable ? 0.7 : 1}
                  disabled={!isAvailable}
                >
                  <View style={styles.slotLeft}>
                    <Ionicons
                      name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                      size={wp('5%')}
                      color={
                        !isAvailable
                          ? '#DDDDDD'
                          : isSelected
                          ? '#0C382E'
                          : '#CCCCCC'
                      }
                    />
                    <View style={styles.slotInfo}>
                      <Text
                        style={[
                          styles.slotTime,
                          isSelected && styles.slotTimeSelected,
                          !isAvailable && styles.slotTimeDisabled,
                        ]}
                      >
                        {slot.slotDisplayText}
                      </Text>
                      {!isAvailable && (
                        <Text style={styles.slotUnavailable}>Slot full</Text>
                      )}
                    </View>
                  </View>
                  {isAvailable && (
                    <View style={styles.slotBadge}>
                      <Text style={styles.slotBadgeText}>
                        {slot.maxOrders - slot.currentOrders} left
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
            {currentSlots.length === 0 && (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No slots for this day</Text>
              </View>
            )}
          </ScrollView>
        </View>
      )}

      <View style={styles.footer}>
        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.confirmButton,
            !selectedSlot && styles.confirmButtonDisabled,
          ]}
          onPress={handleConfirm}
          disabled={!selectedSlot}
          activeOpacity={0.88}
        >
          <Text style={styles.confirmButtonText}>Confirm Slot</Text>
        </TouchableOpacity>
      </View>
    </CustomModal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    paddingTop: hp('1.5%'),
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
    paddingBottom: hp('1.5%'),
    borderBottomWidth: 1,
    borderBottomColor: '#ECE7DE',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'CormorantGaramond-SemiBold',
    fontSize: wp('5.2%'),
    color: '#12372A',
    marginLeft: wp('2%'),
    letterSpacing: -0.2,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp('8%'),
  },
  loadingText: {
    fontFamily: 'Lexend-Regular',
    fontSize: wp('3.5%'),
    color: '#888888',
    marginTop: hp('1.5%'),
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp('5%'),
  },
  emptyText: {
    fontFamily: 'Lexend-Regular',
    fontSize: wp('3.6%'),
    color: '#888888',
    marginTop: hp('1%'),
  },
  dayTabsContainer: {
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('1.5%'),
  },
  dayTabsScroll: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayTab: {
    paddingHorizontal: wp('4.5%'),
    paddingVertical: hp('1%'),
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ECE7DE',
    backgroundColor: '#FAF8F5',
  },
  dayTabActive: {
    backgroundColor: '#0C382E',
    borderColor: '#0C382E',
  },
  dayTabText: {
    fontFamily: 'Lexend-Medium',
    fontSize: wp('3.4%'),
    color: '#555555',
  },
  dayTabTextActive: {
    fontFamily: 'Lexend-Medium',
    fontSize: wp('3.4%'),
    color: '#FFFFFF',
  },
  slotsScrollView: {
    maxHeight: hp('30%'),
    paddingHorizontal: wp('5%'),
  },
  slotCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('4%'),
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ECE7DE',
    marginBottom: hp('1%'),
    backgroundColor: '#FFFFFF',
  },
  slotCardSelected: {
    borderColor: '#0C382E',
    backgroundColor: '#FAF8F5',
  },
  slotCardDisabled: {
    backgroundColor: '#FAF9F6',
    borderColor: '#F0ECE6',
  },
  slotLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  slotInfo: {
    marginLeft: wp('3%'),
  },
  slotTime: {
    fontFamily: 'Lexend-Regular',
    fontSize: wp('3.6%'),
    color: '#333333',
  },
  slotTimeSelected: {
    color: '#0C382E',
    fontFamily: 'Lexend-Medium',
  },
  slotTimeDisabled: {
    color: '#CCCCCC',
  },
  slotUnavailable: {
    fontFamily: 'Lexend-Regular',
    fontSize: wp('2.8%'),
    color: '#B83A3A',
    marginTop: hp('0.2%'),
  },
  slotBadge: {
    backgroundColor: '#E8F2EE',
    paddingHorizontal: wp('2.5%'),
    paddingVertical: hp('0.4%'),
    borderRadius: 10,
  },
  slotBadgeText: {
    fontFamily: 'Lexend-Medium',
    fontSize: wp('2.8%'),
    color: '#0C382E',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: wp('5%'),
    paddingTop: hp('1.5%'),
    paddingBottom: hp('1%'),
    borderTopWidth: 1,
    borderTopColor: '#ECE7DE',
    gap: wp('3%'),
  },
  cancelButton: {
    flex: 1,
    height: hp('5.5%'),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D8D4CC',
    backgroundColor: '#FAF8F5',
  },
  cancelButtonText: {
    fontFamily: 'Lexend-Medium',
    fontSize: wp('3.6%'),
    color: '#12372A',
  },
  confirmButton: {
    flex: 2,
    height: hp('5.5%'),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: '#0C382E',
  },
  confirmButtonDisabled: {
    backgroundColor: '#D1DDD8',
  },
  confirmButtonText: {
    fontFamily: 'Lexend-Medium',
    fontSize: wp('3.6%'),
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
});

export default DeliverySlotModal;
