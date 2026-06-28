import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  Modal,
  Platform,
  StyleSheet,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { FONTS } from '../styles/typography';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';

const AddressCard = ({
  item,
  onSelect,
  onEdit,
  onThreeDots,
  onDelete,
  onCloseThreeDots,
  navigation,
  onClose,
}) => {
  const handlePress = () => {
    if (item.selected) {
      onClose?.();
    } else {
      onSelect(item.id);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        styles.addressContainer,
        !item.selected && { borderColor: '#DADADA' },
      ]}
    >
      <View
        style={[
          styles.addressContainerTopView,
          !item.selected && { marginBottom: hp('1%') },
        ]}
      >
        <View style={styles.addressContainerInnerView}>
          <Image
            style={[
              styles.homeIcon,
              item.type !== 'Home' && { height: wp('3%') },
            ]}
            source={
              item.type === 'Home'
                ? require('../assets/images/home_icon.png')
                : require('../assets/images/office_icon.png')
            }
          />
          <Text style={styles.addressTypeText}>{item.type}</Text>
        </View>

        {item.selected ? (
          !item.threeDotsClicked ? (
            <View style={{ flexDirection: 'row' }}>
              <View style={styles.selectedView}>
                <Image
                  style={styles.tickImage}
                  source={require('../assets/images/tick.png')}
                />
                <Text style={styles.selectedText}>Selected</Text>
              </View>
              <TouchableOpacity
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                onPress={() => onThreeDots(item.id)}
              >
                <Image
                  style={styles.threeDotsIcon}
                  source={require('../assets/images/three_dots.png')}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <ThreeDotsActions
              onEdit={() => {
                onCloseThreeDots();
                onClose?.();
                navigation.navigate('AddLocationScreen', { address: item.raw });
              }}
              onDelete={() => onDelete(item.id)}
              onCloseThreeDots={onCloseThreeDots}
            />
          )
        ) : !item.threeDotsClicked ? (
          <TouchableOpacity
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            onPress={() => onThreeDots(item.id)}
          >
            <Image
              style={styles.threeDotsIcon}
              source={require('../assets/images/three_dots.png')}
            />
          </TouchableOpacity>
        ) : (
          <ThreeDotsActions
            onEdit={() => {
              onCloseThreeDots();
              onClose?.();
              navigation.navigate('AddLocationScreen', { address: item.raw });
            }}
            onDelete={() => onDelete(item.id)}
            onCloseThreeDots={onCloseThreeDots}
          />
        )}
      </View>

      <View
        style={
          !item.selected ? styles.unSelectedAddressInnerContainer : undefined
        }
      >
        <Text style={[styles.addressLine, { marginHorizontal: wp('4%') }]}>
          {item.address}
        </Text>
        <View style={styles.addressContainerBottomView}>
          <View style={styles.addressBottomInnerView}>
            <Image
              style={styles.phoneIcon}
              source={require('../assets/images/phone_icon.png')}
            />
            <Text style={styles.addressLine}>{item.phone}</Text>
          </View>
          <Text style={styles.addressLine}>PIN: {item.pin}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const ThreeDotsActions = ({ onEdit, onDelete, onCloseThreeDots }) => (
  <View style={styles.threeDotActionContainer}>
    <TouchableOpacity onPress={onEdit}>
      <MaterialCommunityIcons
        name="pencil-outline"
        size={wp('4.5%')}
        color="#777777"
      />
    </TouchableOpacity>
    <TouchableOpacity
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      onPress={onDelete}
    >
      <MaterialCommunityIcons
        name="trash-can-outline"
        size={wp('4.5%')}
        color="#D32F2F"
      />
    </TouchableOpacity>
    <TouchableOpacity
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      onPress={onCloseThreeDots}
    >
      <AntDesign name="right" size={wp('4%')} color="#777777" />
    </TouchableOpacity>
  </View>
);

const AddressModal = ({
  visible,
  onClose,
  addresses,
  onSelectAddress,
  onThreeDotsClicked,
  onDeleteClicked,
  onCloseThreeDots,
  navigation,
}) => (
  <Modal visible={visible} animationType="slide" transparent>
    <View style={styles.modalOverlay}>
      <View style={styles.modalContainer}>
        <View style={styles.modalHeaderView}>
          <Text style={styles.modalHeaderText}>Select Your Address</Text>
          <TouchableOpacity onPress={onClose}>
            <Image
              style={styles.closeIcon}
              source={require('../assets/images/close_two.png')}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.modalInnerView}>
          {/* <TouchableOpacity style={styles.chooseLocationContainer}>
                        <Image
                            style={Platform.OS === 'ios' ? styles.locationIcon : [styles.locationIcon, { bottom: hp('0.25%') }]}
                            source={require('../assets/images/location_three.png')}
                        />
                        <Text style={styles.locationText}>Choose current location</Text>
                    </TouchableOpacity> */}
          <TouchableOpacity
            onPress={() => {
              onClose();
              navigation.navigate('AddLocationScreen');
            }}
            style={styles.chooseLocationContainer}
          >
            <Image
              style={
                Platform.OS === 'ios'
                  ? styles.locationIcon
                  : [styles.locationIcon, { bottom: hp('0.25%') }]
              }
              source={require('../assets/images/add_icon.png')}
            />
            <Text style={styles.locationText}>Add new location</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.savedLocationText}>Saved Location</Text>
            <View style={{ maxHeight: hp('35%') }}>
              <FlatList
                data={addresses}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <AddressCard
                    item={item}
                    onSelect={onSelectAddress}
                    onThreeDots={onThreeDotsClicked}
                    onDelete={onDeleteClicked}
                    onCloseThreeDots={onCloseThreeDots}
                    navigation={navigation}
                    onClose={onClose}
                  />
                )}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  </Modal>
);

export default React.memo(AddressModal);

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
    fontFamily: FONTS.poppins.semiBold,
    fontSize: wp('4.5%'),
    color: '#000000',
  },
  closeIcon: {
    width: wp('6%'),
    height: wp('6%'),
    resizeMode: 'contain',
  },
  modalInnerView: {
    marginTop: hp('1%'),
  },
  chooseLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  locationIcon: {
    width: wp('5%'),
    height: wp('5%'),
    resizeMode: 'contain',
  },
  locationText: {
    fontFamily: FONTS.poppins.medium,
    fontSize: wp('4%'),
    color: '#F25000',
    marginLeft: wp('3%'),
  },
  savedLocationText: {
    fontFamily: FONTS.poppins.semiBold,
    fontSize: wp('4%'),
    color: '#000000',
    marginVertical: hp('1.5%'),
  },
  addressContainer: {
    borderWidth: 1,
    borderColor: '#F25000',
    borderRadius: 12,
    padding: wp('3%'),
    marginBottom: hp('1.5%'),
  },
  addressContainerTopView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addressContainerInnerView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  homeIcon: {
    width: wp('4%'),
    height: wp('4%'),
    resizeMode: 'contain',
  },
  addressTypeText: {
    fontFamily: FONTS.poppins.medium,
    fontSize: wp('3.5%'),
    color: '#000000',
    marginLeft: wp('2%'),
  },
  selectedView: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F25000',
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('0.3%'),
    borderRadius: 4,
    marginRight: wp('3%'),
  },
  tickImage: {
    width: wp('3%'),
    height: wp('3%'),
    resizeMode: 'contain',
    tintColor: '#FFFFFF',
  },
  selectedText: {
    fontFamily: FONTS.outfit.medium,
    fontSize: wp('3%'),
    color: '#FFFFFF',
    marginLeft: wp('1%'),
  },
  threeDotsIcon: {
    width: wp('1%'),
    height: wp('4%'),
    resizeMode: 'contain',
    tintColor: '#777777',
  },
  threeDotActionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: wp('22%'),
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('0.5%'),
    borderRadius: 8,
  },
  editIcon: {
    width: wp('6%'),
    height: wp('6%'),
    resizeMode: 'contain',
  },
  unSelectedAddressInnerContainer: {
    opacity: 0.5,
  },
  addressLine: {
    fontFamily: FONTS.outfit.regular,
    fontSize: wp('3.5%'),
    color: '#777777',
    marginTop: hp('0.5%'),
  },
  addressContainerBottomView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp('1%'),
  },
  addressBottomInnerView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phoneIcon: {
    width: wp('3.5%'),
    height: wp('3.5%'),
    resizeMode: 'contain',
    tintColor: '#777777',
    marginRight: wp('2%'),
  },
});
