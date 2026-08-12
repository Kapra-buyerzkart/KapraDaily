import React, { useCallback, useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import CustomModal, { MODAL_POSITION } from '../modal/CustomModal';
import { CART_COLORS, CART_SPACING, hp } from '@/styles/cartTheme';
import SheetGrabber from './components/atoms/SheetGrabber';
import SheetHeader from './components/molecules/SheetHeader';
import AddNewAddressRow from './components/molecules/AddNewAddressRow';
import SavedAddressList from './components/organisms/SavedAddressList';

const AddressModal = ({
  visible,
  onClose,
  addresses = [],
  onSelectAddress,
  onThreeDotsClicked,
  onDeleteClicked,
  onCloseThreeDots,
  navigation,
}) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (visible) {
      modalRef.current?.open();
    } else {
      modalRef.current?.close();
    }
  }, [visible]);

  const handleSelect = useCallback(
    id => {
      const item = addresses.find(address => address.id === id);
      if (item?.selected) {
        onClose?.();
      } else {
        onSelectAddress(id);
      }
    },
    [addresses, onClose, onSelectAddress],
  );

  const handleAddNew = useCallback(() => {
    onClose?.();
    navigation.navigate('AddLocationScreen');
  }, [navigation, onClose]);

  const handleEdit = useCallback(
    item => {
      onCloseThreeDots?.();
      onClose?.();
      navigation.navigate('AddLocationScreen', { address: item.raw });
    },
    [navigation, onClose, onCloseThreeDots],
  );

  return (
    <CustomModal
      ref={modalRef}
      position={MODAL_POSITION.BOTTOM}
      onClose={onClose}
      contentStyle={styles.sheet}
    >
      {/* <SheetGrabber /> */}

      <View style={styles.body}>
        <SheetHeader
          title="Select your address"
          subtitle="We'll deliver this order to the address you pick"
          onClose={onClose}
        />

        <View style={styles.cta}>
          <AddNewAddressRow onPress={handleAddNew} />
        </View>

        <SavedAddressList
          addresses={addresses}
          onSelect={handleSelect}
          onEdit={handleEdit}
          onDelete={onDeleteClicked}
          onOpenActions={onThreeDotsClicked}
          onCloseActions={onCloseThreeDots}
        />
      </View>
    </CustomModal>
  );
};

export default React.memo(AddressModal);

const styles = StyleSheet.create({
  sheet: {
    backgroundColor: CART_COLORS.card,
    paddingHorizontal: CART_SPACING.lg,
    paddingTop: hp('1.2%'),
    paddingBottom: hp('1.5%'),
  },
  body: {
    marginTop: hp('1.2%'),
  },
  cta: {
    marginTop: hp('2%'),
  },
});
