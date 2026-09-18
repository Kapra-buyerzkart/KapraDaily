import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CART_COLORS, CART_FONTS, fs, s } from '../screens/Cart/cartRedesignTheme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface DeliverySlotModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectSlot: (slot: any) => void;
  datesList: any[];
  slotsByDate: any;
}

const DeliverySlotModal: React.FC<DeliverySlotModalProps> = ({
  visible,
  onClose,
  onSelectSlot,
  datesList,
  slotsByDate,
}) => {
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);

  const activeDate = datesList[selectedDateIndex];
  const availableSlots = activeDate ? slotsByDate[activeDate.value] || [] : [];

  const handleSelectSlot = (slot: any) => {
    onSelectSlot({
      ...slot,
      date: activeDate.value,
      dateDisplay: activeDate.display,
      slotDisplay: slot.display || slot.slotValue,
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.dismissArea}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.content}>
          {/* Top Pull Indicator */}
          <View style={styles.pullIndicator} />

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Select Delivery Slot</Text>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="close" size={s(20)} color={CART_COLORS.textDark} />
            </TouchableOpacity>
          </View>

          {/* Date Selector Row */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.dateListContainer}
            contentContainerStyle={styles.dateListContent}
          >
            {datesList.map((date, index) => {
              const isSelected = selectedDateIndex === index;
              return (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.8}
                  style={[styles.dateItem, isSelected && styles.selectedDate]}
                  onPress={() => setSelectedDateIndex(index)}
                >
                  <Text
                    style={[
                      styles.dateText,
                      isSelected && styles.selectedDateText,
                    ]}
                  >
                    {date.display}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Slots List */}
          <ScrollView
            style={styles.slotList}
            contentContainerStyle={styles.slotListContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.slotSection}>
              <Text style={styles.sectionSubtitle}>
                Available Delivery Windows for {activeDate?.display}
              </Text>
              {availableSlots.length > 0 ? (
                availableSlots.map((slot: any, index: number) => {
                  const isAvailable = Boolean(slot.available);
                  return (
                    <TouchableOpacity
                      key={index}
                      activeOpacity={0.85}
                      style={[
                        styles.slotItem,
                        !isAvailable && styles.disabledSlotItem,
                      ]}
                      onPress={() => isAvailable && handleSelectSlot(slot)}
                      disabled={!isAvailable}
                    >
                      <View style={styles.slotInfo}>
                        <View
                          style={[
                            styles.slotIconBox,
                            !isAvailable && styles.disabledIconBox,
                          ]}
                        >
                          <Ionicons
                            name="time-outline"
                            color={
                              isAvailable
                                ? CART_COLORS.darkEmerald
                                : CART_COLORS.textFaint
                            }
                            size={s(17)}
                          />
                        </View>
                        <Text
                          style={[
                            styles.slotText,
                            !isAvailable && styles.disabledSlotText,
                          ]}
                        >
                          {slot.display || slot.slotValue}
                        </Text>
                      </View>
                      {isAvailable ? (
                        <Ionicons
                          name="chevron-forward"
                          color={CART_COLORS.darkEmerald}
                          size={s(16)}
                        />
                      ) : (
                        <View style={styles.unavailableBadge}>
                          <Text style={styles.unavailableText}>Full</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })
              ) : (
                <View style={styles.emptySlots}>
                  <Ionicons
                    name="calendar-outline"
                    size={s(34)}
                    color="#C4BCB3"
                  />
                  <Text style={styles.emptyTitle}>No Delivery Slots</Text>
                  <Text style={styles.emptyText}>
                    Please select another date for delivery availability.
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.48)',
    justifyContent: 'flex-end',
  },
  dismissArea: {
    flex: 1,
  },
  content: {
    backgroundColor: CART_COLORS.white,
    borderTopLeftRadius: s(24),
    borderTopRightRadius: s(24),
    height: SCREEN_HEIGHT * 0.72,
    paddingBottom: Platform.OS === 'ios' ? s(34) : s(18),
    borderWidth: 1,
    borderColor: CART_COLORS.cardBorder,
  },
  pullIndicator: {
    width: s(40),
    height: s(4),
    borderRadius: s(2),
    backgroundColor: '#DCD6CE',
    alignSelf: 'center',
    marginTop: s(10),
    marginBottom: s(6),
  },
  header: {
    paddingHorizontal: s(20),
    paddingTop: s(8),
    paddingBottom: s(14),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: fs(20),
    fontFamily: CART_FONTS.serifBold,
    color: CART_COLORS.textDark,
  },
  closeButton: {
    width: s(32),
    height: s(32),
    borderRadius: s(16),
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: CART_COLORS.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateListContainer: {
    flexGrow: 0,
    marginBottom: s(6),
  },
  dateListContent: {
    paddingHorizontal: s(20),
    paddingBottom: s(12),
    gap: s(8),
  },
  dateItem: {
    paddingHorizontal: s(16),
    paddingVertical: s(9),
    borderRadius: s(12),
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: CART_COLORS.cardBorder,
  },
  selectedDate: {
    backgroundColor: CART_COLORS.darkEmerald,
    borderColor: CART_COLORS.darkEmerald,
  },
  dateText: {
    fontSize: fs(12.5),
    fontFamily: CART_FONTS.sansMedium,
    color: CART_COLORS.textDark,
  },
  selectedDateText: {
    color: CART_COLORS.white,
    fontFamily: CART_FONTS.sansBold,
  },
  slotList: {
    paddingHorizontal: s(20),
    flex: 1,
  },
  slotListContent: {
    paddingBottom: s(24),
    flexGrow: 1,
  },
  slotSection: {
    marginTop: s(6),
  },
  sectionSubtitle: {
    fontSize: fs(12),
    fontFamily: CART_FONTS.sansMedium,
    color: CART_COLORS.textMuted,
    marginBottom: s(12),
  },
  slotItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: s(14),
    backgroundColor: '#FAF8F5',
    borderRadius: s(14),
    marginBottom: s(10),
    borderWidth: 1,
    borderColor: CART_COLORS.cardBorder,
  },
  slotInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(10),
  },
  slotIconBox: {
    width: s(30),
    height: s(30),
    borderRadius: s(8),
    backgroundColor: CART_COLORS.emeraldTint,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledIconBox: {
    backgroundColor: '#EBE8E3',
  },
  slotText: {
    fontSize: fs(13.5),
    fontFamily: CART_FONTS.sansBold,
    color: CART_COLORS.textDark,
  },
  emptySlots: {
    alignItems: 'center',
    paddingVertical: s(36),
    gap: s(6),
  },
  emptyTitle: {
    fontSize: fs(15),
    fontFamily: CART_FONTS.serifBold,
    color: CART_COLORS.textDark,
  },
  emptyText: {
    fontSize: fs(12),
    fontFamily: CART_FONTS.sansRegular,
    color: CART_COLORS.textMuted,
    textAlign: 'center',
  },
  disabledSlotItem: {
    backgroundColor: '#F5F3EF',
    borderColor: '#ECEAE5',
    opacity: 0.65,
  },
  disabledSlotText: {
    color: '#9E9E9E',
  },
  unavailableBadge: {
    backgroundColor: '#E8E4DD',
    paddingHorizontal: s(8),
    paddingVertical: s(3),
    borderRadius: s(6),
  },
  unavailableText: {
    fontSize: fs(10),
    fontFamily: CART_FONTS.sansBold,
    color: '#7A7A7A',
  },
});

export default DeliverySlotModal;
