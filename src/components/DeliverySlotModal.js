import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, Modal, TouchableOpacity,
    Pressable, ActivityIndicator, ScrollView, Platform
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { FONTS } from '../styles/typography';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { getDeliverySlotsApi } from '../api/cartService';

const DeliverySlotModal = ({ visible, onClose, onSelectSlot, pincodeAreaId }) => {
    const [loading, setLoading] = useState(true);
    const [slotGroups, setSlotGroups] = useState([]);
    const [selectedDay, setSelectedDay] = useState(0);
    const [selectedSlot, setSelectedSlot] = useState(null);

    useEffect(() => {
        if (visible) {
            fetchSlots();
        }
    }, [visible, pincodeAreaId]);

    const fetchSlots = async () => {
        try {
            setLoading(true);
            const response = await getDeliverySlotsApi(pincodeAreaId);
            console.log('🕐 [SLOTS] Response:', JSON.stringify(response, null, 2));
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
        <Modal
            transparent
            visible={visible}
            animationType="slide"
            onRequestClose={onClose}
        >
            <Pressable style={styles.overlay} onPress={onClose}>
                <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            <MaterialCommunityIcons name="clock-outline" size={wp('5.5%')} color="#F25000" />
                            <Text style={styles.headerTitle}>Select Delivery Slot</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                            <Ionicons name="close" size={wp('6%')} color="#000" />
                        </TouchableOpacity>
                    </View>

                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#F25000" />
                            <Text style={styles.loadingText}>Loading available slots...</Text>
                        </View>
                    ) : slotGroups.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <MaterialCommunityIcons name="calendar-remove-outline" size={wp('12%')} color="#CCCCCC" />
                            <Text style={styles.emptyText}>No delivery slots available</Text>
                        </View>
                    ) : (
                        <View style={{ flex: 1 }}>
                            {/* Day Tabs */}
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
                                                activeOpacity={0.7}
                                                style={{ marginRight: wp('2.5%') }}
                                            >
                                                {isActive ? (
                                                    <View
                                                        style={[styles.dayTab, { backgroundColor: '#F25000' }]}
                                                    >
                                                        <Text style={[styles.dayTabText, { color: '#FFFFFF' }]}>{group.title}</Text>
                                                    </View>
                                                ) : (
                                                    <View style={styles.dayTab}>
                                                        <Text style={styles.dayTabText}>{group.title}</Text>
                                                    </View>
                                                )}
                                            </TouchableOpacity>
                                        );
                                    })}
                                </ScrollView>
                            </View>

                            {/* Slots List */}
                            <ScrollView style={styles.slotsScrollView} showsVerticalScrollIndicator={false}>
                                {currentSlots.map((slot, index) => {
                                    const isSelected = selectedSlot?.deliverySlotId === slot.deliverySlotId &&
                                        selectedSlot?.slotDate === slot.slotDate;
                                    const isAvailable = slot.isAvailable === 1;

                                    return (
                                        <TouchableOpacity
                                            key={`${slot.deliverySlotId}-${index}`}
                                            style={[
                                                styles.slotCard,
                                                isSelected && styles.slotCardSelected,
                                                !isAvailable && styles.slotCardDisabled
                                            ]}
                                            onPress={() => isAvailable && setSelectedSlot(slot)}
                                            activeOpacity={isAvailable ? 0.7 : 1}
                                            disabled={!isAvailable}
                                        >
                                            <View style={styles.slotLeft}>
                                                <Ionicons
                                                    name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                                                    size={wp('5%')}
                                                    color={!isAvailable ? '#DDDDDD' : isSelected ? '#F25000' : '#CCCCCC'}
                                                />
                                                <View style={styles.slotInfo}>
                                                    <Text style={[
                                                        styles.slotTime,
                                                        isSelected && styles.slotTimeSelected,
                                                        !isAvailable && styles.slotTimeDisabled
                                                    ]}>
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

                    {/* Footer */}
                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <LinearGradient
                            colors={selectedSlot ? ['#F25000', '#FF7B3A'] : ['#CCCCCC', '#CCCCCC']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.confirmGradient}
                        >
                            <TouchableOpacity
                                style={styles.confirmButton}
                                onPress={handleConfirm}
                                disabled={!selectedSlot}
                            >
                                <Text style={styles.confirmButtonText}>Confirm Slot</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: wp('6%'),
        borderTopRightRadius: wp('6%'),
        paddingTop: hp('1.5%'),
        paddingBottom: Platform.OS === 'ios' ? hp('4%') : hp('2%'),
        maxHeight: hp('65%'),
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: wp('5%'),
        paddingBottom: hp('1.5%'),
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('4.5%'),
        color: '#000000',
        marginLeft: wp('2%'),
    },
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: hp('8%'),
    },
    loadingText: {
        fontFamily: FONTS.outfit.regular,
        fontSize: wp('3.5%'),
        color: '#999999',
        marginTop: hp('1.5%'),
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: hp('5%'),
    },
    emptyText: {
        fontFamily: FONTS.outfit.regular,
        fontSize: wp('3.8%'),
        color: '#999999',
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
        paddingHorizontal: wp('5%'),
        paddingVertical: hp('1%'),
        borderRadius: wp('5%'),
        borderWidth: 1,
        borderColor: '#E5E5E5',
        backgroundColor: '#FFFFFF',
    },
    dayTabActive: {
        paddingHorizontal: wp('6%'),
        paddingVertical: hp('1.5%'),
        borderRadius: wp('6%'),
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: wp('25%'),
    },
    dayTabText: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('3.5%'),
        color: '#666666',
    },
    dayTabTextActive: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('3.8%'),
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
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        marginBottom: hp('1%'),
        backgroundColor: '#FFFFFF',
    },
    slotCardSelected: {
        borderColor: '#F25000',
        backgroundColor: '#FFF8F5',
    },
    slotCardDisabled: {
        backgroundColor: '#F9F9F9',
        borderColor: '#EEEEEE',
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
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('3.8%'),
        color: '#333333',
    },
    slotTimeSelected: {
        color: '#F25000',
        fontFamily: FONTS.poppins.semiBold,
    },
    slotTimeDisabled: {
        color: '#CCCCCC',
    },
    slotUnavailable: {
        fontFamily: FONTS.outfit.regular,
        fontSize: wp('2.8%'),
        color: '#FF4444',
        marginTop: hp('0.2%'),
    },
    slotBadge: {
        backgroundColor: '#E8F5E9',
        paddingHorizontal: wp('2.5%'),
        paddingVertical: hp('0.3%'),
        borderRadius: 20,
    },
    slotBadgeText: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('2.8%'),
        color: '#2E7D32',
    },
    footer: {
        flexDirection: 'row',
        paddingHorizontal: wp('5%'),
        paddingTop: hp('1.5%'),
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        gap: wp('3%'),
    },
    cancelButton: {
        flex: 1,
        height: hp('5.5%'),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#F25000',
    },
    cancelButtonText: {
        fontFamily: FONTS.poppins.medium,
        fontSize: wp('3.8%'),
        color: '#F25000',
    },
    confirmGradient: {
        flex: 2,
        borderRadius: 12,
    },
    confirmButton: {
        height: hp('5.5%'),
        justifyContent: 'center',
        alignItems: 'center',
    },
    confirmButtonText: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('3.8%'),
        color: '#FFFFFF',
    },
});

export default DeliverySlotModal;
