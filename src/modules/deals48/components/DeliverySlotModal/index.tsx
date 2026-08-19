import React, { useState } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Dimensions,
    Platform
} from 'react-native';
import { colors } from '../../assets/theme/colours';
import { Fonts } from '../../assets/theme/fonts';
import { AppIcons } from '../../assets/icons';

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
    slotsByDate
}) => {
    const [selectedDateIndex, setSelectedDateIndex] = useState(0);

    const activeDate = datesList[selectedDateIndex];
    const availableSlots = activeDate ? slotsByDate[activeDate.value] || [] : [];

    const handleSelectSlot = (slot: any) => {
        onSelectSlot({
            ...slot,
            date: activeDate.value,
            dateDisplay: activeDate.display,
            slotDisplay: slot.display || slot.slotValue
        });
        onClose();
    };

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <TouchableOpacity style={styles.dismissArea} activeOpacity={1} onPress={onClose} />
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Select Delivery Slot</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <AppIcons.Close color={colors.black} size={24} />
                        </TouchableOpacity>
                    </View>

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
                                    style={[styles.dateItem, isSelected && styles.selectedDate]}
                                    onPress={() => setSelectedDateIndex(index)}
                                >
                                    <Text style={[styles.dateText, isSelected && styles.selectedDateText]}>
                                        {date.display}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>

                    <ScrollView
                        style={styles.slotList}
                        contentContainerStyle={styles.slotListContent}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.slotSection}>
                            <Text style={styles.sectionSubtitle}>Available Slots for {activeDate?.display}</Text>
                            {availableSlots.length > 0 ? (
                                availableSlots.map((slot: any, index: number) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={[styles.slotItem, !slot.available && styles.disabledSlotItem]}
                                        onPress={() => slot.available && handleSelectSlot(slot)}
                                        disabled={!slot.available}
                                    >
                                        <View style={styles.slotInfo}>
                                            <AppIcons.Calendar color={slot.available ? colors.themeTeal : '#CCC'} size={18} />
                                            <Text style={[styles.slotText, !slot.available && styles.disabledSlotText]}>
                                                {slot.display || slot.slotValue}
                                            </Text>
                                        </View>
                                        {slot.available ? (
                                            <AppIcons.ArrowUp color="#CCC" size={16} style={{ transform: [{ rotate: '90deg' }] }} />
                                        ) : (
                                            <Text style={styles.unavailableText}>Full</Text>
                                        )}
                                    </TouchableOpacity>
                                ))
                            ) : (
                                <View style={styles.emptySlots}>
                                    <Text style={styles.emptyText}>No slots available for this date</Text>
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
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    dismissArea: {
        flex: 1,
    },
    content: {
        backgroundColor: colors.white,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        height: SCREEN_HEIGHT * 0.7,
        paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    },
    header: {
        padding: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontFamily: Fonts.gilroyBold,
        color: colors.black,
    },
    closeButton: {
        padding: 4,
    },
    dateListContainer: {
        flexGrow: 0,
        marginBottom: 8,
    },
    dateListContent: {
        paddingHorizontal: 24,
        paddingBottom: 16,
    },
    dateItem: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 12,
        marginRight: 10,
        backgroundColor: '#F5F5F5',
        borderWidth: 1,
        borderColor: '#EEE',
    },
    selectedDate: {
        backgroundColor: colors.themeTeal,
        borderColor: colors.themeDarkTeal,
    },
    dateText: {
        fontSize: 14,
        fontFamily: Fonts.gilroyMedium,
        color: '#666',
    },
    selectedDateText: {
        color: colors.white,
        fontFamily: Fonts.gilroyBold,
    },
    slotList: {
        paddingHorizontal: 24,
        flex: 1,
    },
    slotListContent: {
        paddingBottom: 24,
        flexGrow: 1,
    },
    slotSection: {
        marginTop: 8,
    },
    sectionSubtitle: {
        fontSize: 14,
        fontFamily: Fonts.gilroyMedium,
        color: '#999',
        marginBottom: 16,
    },
    slotItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#F9F9F9',
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#EEE',
    },
    slotInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    slotText: {
        fontSize: 16,
        fontFamily: Fonts.gilroyBold,
        color: colors.black,
    },
    emptySlots: {
        alignItems: 'center',
        padding: 40,
    },
    emptyText: {
        fontSize: 14,
        fontFamily: Fonts.gilroyMedium,
        color: '#999',
    },
    disabledSlotItem: {
        backgroundColor: '#F0F0F0',
        borderColor: '#DDD',
        opacity: 0.7,
    },
    disabledSlotText: {
        color: '#999',
    },
    unavailableText: {
        fontSize: 12,
        fontFamily: Fonts.gilroyBold,
        color: '#999',
        backgroundColor: '#E0E0E0',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
});

export default DeliverySlotModal;
