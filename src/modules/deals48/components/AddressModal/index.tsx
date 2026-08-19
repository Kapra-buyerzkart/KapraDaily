import { DEALS48_ROUTES } from '../../navigation/routes';
import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import { colors } from '../../assets/theme/colours';
import { Fonts } from '../../assets/theme/fonts';
import { AppIcons } from '../../assets/icons';
import { useNavigation } from '@react-navigation/native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface AddressModalProps {
  visible: boolean;
  onClose: () => void;
  addresses: any[];
  onSelectAddress: (
    addressId: string | number,
    showConfirmation: boolean,
  ) => void;
}

const AddressModal: React.FC<AddressModalProps> = ({
  visible,
  onClose,
  addresses,
  onSelectAddress,
}) => {
  const navigation = useNavigation<any>();

  const renderAddressItem = (item: any) => {
    const isSelected = item.selected;
    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.addressItem, isSelected && styles.addressItemActive]}
        onPress={() => {
          onSelectAddress(item.id, false);
          onClose();
        }}
      >
        <View style={styles.addressTypeHeader}>
          <View style={styles.typeRow}>
            <View
              style={[styles.typeIcon, isSelected && styles.typeIconActive]}
            >
              {item.type?.toLowerCase() === 'home' ? (
                <AppIcons.Home
                  color={isSelected ? colors.white : colors.themeTeal}
                  size={16}
                />
              ) : (
                <AppIcons.Person
                  color={isSelected ? colors.white : colors.themeTeal}
                  size={16}
                />
              )}
            </View>
            <Text style={styles.addressTypeText}>{item.type || 'Home'}</Text>
          </View>
          <View
            style={[styles.radioOuter, isSelected && styles.radioOuterActive]}
          >
            {isSelected && <View style={styles.radioInner} />}
          </View>
        </View>
        <Text style={styles.addressText} numberOfLines={2}>
          {item.address}
        </Text>
      </TouchableOpacity>
    );
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
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <Text style={styles.title}>Select Address</Text>
              <TouchableOpacity
                style={styles.addNewButton}
                onPress={() => {
                  navigation.navigate(DEALS48_ROUTES.ADD_LOCATION);
                  onClose();
                }}
              >
                <AppIcons.Add color={colors.themeTeal} size={18} />
                <Text style={styles.addNewText}>Add New </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <AppIcons.Close color={colors.black} size={24} />
              </TouchableOpacity>
            </View>
            {/* <TouchableOpacity
              style={styles.addNewButton}
              onPress={() => {
                navigation.navigate(DEALS48_ROUTES.ADD_LOCATION);
                onClose();
              }}
            >
              <AppIcons.Add color={colors.themeTeal} size={18} />
              <Text style={styles.addNewText}>Add New</Text>
            </TouchableOpacity> */}
          </View>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {addresses && addresses.length > 0 ? (
              addresses.map(renderAddressItem)
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No addresses found.</Text>
              </View>
            )}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.confirmButton} onPress={onClose}>
              <Text style={styles.confirmButtonText}>Deliver Here</Text>
            </TouchableOpacity>
          </View>
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
    maxHeight: SCREEN_HEIGHT * 0.8,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  header: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontFamily: Fonts.gilroyBold,
    color: colors.black,
  },
  closeButton: {
    padding: 4,
  },
  addNewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#',
    padding: 8,
    right: 40,
    position: 'absolute',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.themeTeal,
    borderStyle: 'dashed',
  },
  addNewText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: Fonts.gilroyMedium,
    color: colors.themeTeal,
  },
  scroll: {
    padding: 24,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  addressItem: {
    backgroundColor: '#F9F9F9',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: '#EEE',
  },
  addressItemActive: {
    backgroundColor: colors.figmaTeal,
    borderColor: colors.themeTeal,
  },
  addressTypeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.figmaTeal,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  typeIconActive: {
    backgroundColor: colors.themeTeal,
  },
  addressTypeText: {
    fontSize: 16,
    fontFamily: Fonts.gilroyBold,
    color: colors.black,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CCC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterActive: {
    borderColor: colors.themeTeal,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.themeTeal,
  },
  addressText: {
    fontSize: 14,
    fontFamily: Fonts.gilroyRegular,
    color: '#666',
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  confirmButton: {
    backgroundColor: colors.themeTeal,
    height: 54,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.themeTeal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  confirmButtonText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: Fonts.gilroyBold,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#999',
    fontFamily: Fonts.gilroyMedium,
  },
});

export default AddressModal;
