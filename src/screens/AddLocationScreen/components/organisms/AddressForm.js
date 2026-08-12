import React from 'react';
import { StyleSheet, View } from 'react-native';

import { AddrText } from '../atoms';
import {
  AddressTypeSelector,
  AreaDropdown,
  DeliveryNote,
  FormField,
  ResolvedAddressCard,
  SaveButton,
} from '../molecules';
import { SPACING, hp } from '../../theme';

const AddressForm = ({ form, area, status, isEditMode, onSave }) => (
  <>
    <ResolvedAddressCard
      line1={form.addLine1}
      line2={form.addLine2}
      isResolving={status.isGeocoding || status.isInitialLoading}
    />

    <DeliveryNote />

    <AddrText variant="labelStrong" tone="muted" style={styles.saveAs}>
      Save as
    </AddrText>
    <AddressTypeSelector
      selected={form.addressType}
      onChange={form.setAddressType}
    />

    <FormField
      label="Full Address House / Flat / Block no"
      required
      value={form.addLine1}
      onChangeText={form.setAddLine1}
    />

    <FormField
      label="Appartment / Road / Area"
      value={form.addLine2}
      onChangeText={form.setAddLine2}
    />

    <View style={styles.pincodeRow}>
      <FormField
        label="PIN Code"
        required
        wrapperStyle={styles.pincodeField}
        value={form.pincode}
        onChangeText={form.setPincode}
        keyboardType="numeric"
        maxLength={6}
      />
      <AreaDropdown
        open={area.open}
        setOpen={area.setOpen}
        value={area.pincodeAreaId}
        setValue={area.setPincodeAreaId}
        items={area.items}
        setItems={area.setItems}
        isLoading={area.isAreasLoading}
      />
    </View>

    <FormField
      label="Land mark / Delivery instruction"
      inputStyle={styles.landmarkInput}
      placeholder="eg. Near Lulu Mall"
      value={form.landmark}
      onChangeText={form.setLandmark}
      multiline
    />

    <FormField
      label="Customer name"
      required
      value={form.custName}
      onChangeText={form.setCustName}
    />

    <FormField
      label="Phone number"
      required
      placeholder="Enter mobile number"
      value={form.phone}
      onChangeText={form.setPhone}
      keyboardType="phone-pad"
      maxLength={10}
    />

    <SaveButton
      label={isEditMode ? 'Update address' : 'Save address'}
      isBusy={status.isLoading}
      onPress={onSave}
    />
  </>
);

export default React.memo(AddressForm);

const styles = StyleSheet.create({
  saveAs: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  pincodeRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    zIndex: 10,
  },
  pincodeField: {
    flex: 1,
  },
  landmarkInput: {
    minHeight: hp('8%'),
    textAlignVertical: 'top',
  },
});
