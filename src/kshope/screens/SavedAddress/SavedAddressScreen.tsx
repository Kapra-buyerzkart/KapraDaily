import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { useAddresses } from '../../hooks/useAddresses';
import { colors } from '../../theme/colours';
import styles from './styles';

import AddressConfirmationModal from '../../components/AddressConfirmationModal';

const SavedAddressScreen: React.FC = () => {
    const navigation = useNavigation<any>();


    const {
        addresses,
        onSelectAddress,
        onThreeDotsClicked,
        onDeleteClicked,
        onCloseThreeDots,
        isLoading,
        refreshAddresses,
        addressConfirmationData,
        setAddressConfirmationData,
    } = useAddresses();

    useFocusEffect(
        useCallback(() => {
            refreshAddresses();
        }, [refreshAddresses])
    );

    const ThreeDotsActions = ({ onEdit, onDelete, onCloseThreeDots }: any) => (
        <View style={styles.threeDotActionContainer}>
            <TouchableOpacity onPress={onEdit}>
                <MaterialCommunityIcons name="pencil-outline" size={20} color={colors.themeDarkGray} />
            </TouchableOpacity>
            <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={onDelete}>
                <MaterialCommunityIcons name="trash-can-outline" size={20} color={colors.logoutred} />
            </TouchableOpacity>
            <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={onCloseThreeDots}>
                <AntDesign name="right" size={18} color={colors.themeDarkGray} />
            </TouchableOpacity>
        </View>
    );

    const renderAddressCard = ({ item }: { item: any }) => {
        const handlePress = () => {
            if (item.selected) {
                navigation.navigate('KshopeAddLocation', { address: item.raw });
            } else {
                onSelectAddress(item.id, false);
            }
        };

        const isHome = item.type?.toLowerCase() === 'home';

        return (
            <TouchableOpacity
                onPress={handlePress}
                style={[styles.addressContainer, !item.selected && { borderColor: colors.themeLightGray }]}
            >
                <View style={[styles.addressContainerTopView, !item.selected && { marginBottom: 8 }]}>
                    <View style={styles.addressContainerInnerView}>
                        <MaterialCommunityIcons
                            name={isHome ? 'home-outline' : 'briefcase-outline'}
                            size={20}
                            color={colors.themeTeal}
                        />
                        <Text style={styles.addressTypeText}>{item.type}</Text>
                    </View>

                    {item.selected ? (
                        !item.threeDotsClicked ? (
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={styles.selectedView}>
                                    <AntDesign name="checkcircle" size={12} color={colors.green} />
                                    <Text style={styles.selectedText}>Selected</Text>
                                </View>
                                <TouchableOpacity
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                    onPress={() => onThreeDotsClicked(item.id)}
                                >
                                    <MaterialCommunityIcons name="dots-vertical" size={20} color={colors.themeDarkGray} />
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <ThreeDotsActions
                                onEdit={() => navigation.navigate('KshopeAddLocation', { address: item.raw })}
                                onDelete={() => onDeleteClicked(item.id)}
                                onCloseThreeDots={onCloseThreeDots}
                            />
                        )
                    ) : (
                        !item.threeDotsClicked ? (
                            <TouchableOpacity
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                onPress={() => onThreeDotsClicked(item.id)}
                            >
                                <MaterialCommunityIcons name="dots-vertical" size={20} color={colors.themeDarkGray} />
                            </TouchableOpacity>
                        ) : (
                            <ThreeDotsActions
                                onEdit={() => navigation.navigate('KshopeAddLocation', { address: item.raw })}
                                onDelete={() => onDeleteClicked(item.id)}
                                onCloseThreeDots={onCloseThreeDots}
                            />
                        )
                    )}
                </View>

                <View style={styles.unSelectedAddressInnerContainer}>
                    <Text style={[styles.addressLine, { marginHorizontal: 16 }]} numberOfLines={2}>
                        {item.address}
                    </Text>
                    <View style={styles.addressContainerBottomView}>
                        <View style={styles.addressBottomInnerView}>
                            <MaterialCommunityIcons name="phone-outline" size={16} color={colors.themeTeal} />
                            <Text style={[styles.addressLine, { marginLeft: 8 }]}>{item.phone}</Text>
                        </View>
                        <Text style={styles.addressLine}>PIN: {item.pin}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.mainContainer}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <AntDesign name="arrowleft" size={24} color={colors.black} />
                </TouchableOpacity>
                <Text style={styles.addressText}>Address</Text>
            </View>

            <FlatList
                data={addresses}
                keyExtractor={(item, index) => (item.id || index).toString()}
                renderItem={renderAddressCard}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={refreshAddresses} />
                }
                contentContainerStyle={{ paddingHorizontal: 16, marginTop: 24 }}
                ListHeaderComponent={() => (
                    <TouchableOpacity
                        onPress={() => navigation.navigate('KshopeAddLocation')}
                        style={styles.chooseLocationContainer}
                    >
                        <AntDesign name="plus" size={20} color={colors.themeTeal} />
                        <Text style={styles.locationText}>Add new location</Text>
                    </TouchableOpacity>
                )}
            />

            <AddressConfirmationModal
                visible={!!addressConfirmationData}
                onClose={() => setAddressConfirmationData(null)}
                onConfirm={() => setAddressConfirmationData(null)}
                data={addressConfirmationData}
            />
        </SafeAreaView>
    );
};

export default SavedAddressScreen;
