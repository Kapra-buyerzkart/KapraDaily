import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Animated, Pressable } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
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
                        <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                            <Ionicons name="close" size={wp('6%')} color="#000" />
                        </TouchableOpacity>
                    </View>

                    {SORT_OPTIONS.map((option) => {
                        const isSelected = selectedValue === option.value;
                        return (
                            <TouchableOpacity
                                key={option.value}
                                style={styles.optionItem}
                                onPress={() => {
                                    onSelect(option.value);
                                    onClose();
                                }}
                            >
                                <Text style={[styles.optionLabel, isSelected && styles.selectedOptionLabel]}>
                                    {option.label}
                                </Text>
                                <View style={[styles.radio, isSelected && styles.selectedRadio]}>
                                    {isSelected && <View style={styles.radioInner} />}
                                </View>
                            </TouchableOpacity>
                        );
                    })}
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
        fontFamily: FONTS.poppins.regular,
        fontSize: wp('3.8%'),
        color: '#666',
    },
    selectedOptionLabel: {
        fontFamily: FONTS.poppins.medium,
        color: '#F25000',
    },
    radio: {
        width: wp('5%'),
        height: wp('5%'),
        borderRadius: wp('2.5%'),
        borderWidth: 2,
        borderColor: '#DADADA',
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedRadio: {
        borderColor: '#F25000',
    },
    radioInner: {
        width: wp('2.5%'),
        height: wp('2.5%'),
        borderRadius: wp('1.25%'),
        backgroundColor: '#F25000',
    },
});

export default SortModal;
