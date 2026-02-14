import React from 'react';
import { View, Text, TouchableOpacity, FlatList, Modal, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Toast from 'react-native-simple-toast';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FONTS } from '../styles/typography';

const ProfileOffersModal = ({ visible, onClose, title, data }) => {

    const handleCopy = (code) => {
        Toast.show(`Copied: ${code}`, Toast.SHORT);
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerText}>{title}</Text>
                        <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                            <Ionicons name="close" size={wp('6%')} color="#333" />
                        </TouchableOpacity>
                    </View>

                    {/* List */}
                    <FlatList
                        data={data}
                        keyExtractor={(item, index) => item.id?.toString() || item.code || index.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.card}>
                                <View style={styles.cardTop}>
                                    <View style={styles.codeBadge}>
                                        <Text style={styles.codeText}>{item.code}</Text>
                                    </View>
                                    <TouchableOpacity
                                        style={styles.copyButton}
                                        onPress={() => handleCopy(item.code)}
                                    >
                                        <Ionicons name="copy-outline" size={wp('4%')} color="#F25000" />
                                        <Text style={styles.copyText}>COPY</Text>
                                    </TouchableOpacity>
                                </View>
                                {item.description ? (
                                    <Text style={styles.description}>{item.description}</Text>
                                ) : null}
                            </View>
                        )}
                        contentContainerStyle={{ paddingBottom: hp('2%') }}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            <View style={styles.emptyView}>
                                <Text style={styles.emptyText}>No offers available</Text>
                            </View>
                        }
                    />
                </View>
            </View>
        </Modal>
    );
};

export default React.memo(ProfileOffersModal);

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: wp('4.65%'),
        paddingTop: hp('2%'),
        paddingBottom: hp('3%'),
        maxHeight: hp('70%'),
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: hp('2%'),
    },
    headerText: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('4.5%'),
        color: '#000000',
    },
    card: {
        borderWidth: 1,
        borderColor: '#E8E8E8',
        borderRadius: 12,
        padding: wp('4%'),
        marginBottom: hp('1.5%'),
        backgroundColor: '#F9F9F9',
    },
    cardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    codeBadge: {
        backgroundColor: '#FFF5F0',
        borderWidth: 1,
        borderColor: '#F25000',
        borderRadius: 4,
        borderStyle: 'dashed',
        paddingHorizontal: wp('3%'),
        paddingVertical: hp('0.5%'),
    },
    codeText: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('3.5%'),
        color: '#F25000',
        letterSpacing: 1,
    },
    copyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF5F0',
        paddingHorizontal: wp('3%'),
        paddingVertical: hp('0.6%'),
        borderRadius: 6,
        gap: wp('1%'),
    },
    copyText: {
        fontFamily: FONTS.poppins.semiBold,
        fontSize: wp('3%'),
        color: '#F25000',
    },
    description: {
        fontFamily: FONTS.outfit.regular,
        fontSize: wp('3.2%'),
        color: '#777777',
        marginTop: hp('1%'),
    },
    emptyView: {
        alignItems: 'center',
        marginTop: hp('5%'),
    },
    emptyText: {
        fontFamily: FONTS.outfit.regular,
        fontSize: wp('3.8%'),
        color: '#999',
    },
});
