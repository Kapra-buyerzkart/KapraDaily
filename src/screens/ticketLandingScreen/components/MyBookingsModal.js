import React from 'react';
import {
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import VoucherGrid from './VoucherGrid';

const MyBookingsModal = ({
  visible,
  onClose,
  vouchers,
  loading,
  onVoucherPress,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="pageSheet"
    >
      <View style={[styles.container, { paddingTop: insets.top || 20 }]}>
        <View style={styles.header}>
          <Text style={styles.title}>My Bookings</Text>
          <TouchableOpacity
            onPress={onClose}
            hitSlop={16}
            style={styles.closeBtn}
          >
            <MaterialIcons name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        >
          <VoucherGrid
            vouchers={vouchers}
            loading={loading}
            onVoucherPress={onVoucherPress}
          />
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'Gilroy-Bold',
  },
  closeBtn: {
    padding: 4,
  },
});

export default MyBookingsModal;
