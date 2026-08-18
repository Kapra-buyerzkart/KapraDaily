import React from 'react';
import { StyleSheet, View } from 'react-native';

import { SectionCard, SectionTitle } from '../atoms';
import {
  ControlledAddressTypeSelector,
  ControlledAreaDropdown,
  ControlledFormField,
  DeliveryNote,
  ResolvedAddressCard,
} from '../molecules';
import { ADDRESS_RULES } from '../../validationSchema';
import { SPACING, hp } from '../../theme';

const AddressForm = ({ form, area, status }) => (
  <>
    <ResolvedAddressCard
      line1={form.addLine1}
      line2={form.addLine2}
      isResolving={status.isGeocoding || status.isInitialLoading}
    />

    <SectionCard>
      <SectionTitle title="Save this address as" />
      <ControlledAddressTypeSelector
        control={form.control}
        name="addressType"
        rules={ADDRESS_RULES.addressType}
      />
    </SectionCard>

    <SectionCard>
      <SectionTitle
        title="Address details"
        hint="Used by the rider to reach your door"
      />

      <ControlledFormField
        control={form.control}
        name="addLine1"
        rules={ADDRESS_RULES.addLine1}
        label="Full Address House / Flat / Block no"
        required
      />

      <ControlledFormField
        control={form.control}
        name="addLine2"
        rules={ADDRESS_RULES.addLine2}
        label="Appartment / Road / Area"
      />

      <View style={styles.pincodeRow}>
        <ControlledFormField
          control={form.control}
          name="pincode"
          rules={ADDRESS_RULES.pincode}
          label="PIN Code"
          required
          wrapperStyle={styles.pincodeField}
          keyboardType="numeric"
          maxLength={6}
        />
        <ControlledAreaDropdown
          control={form.control}
          name="pincodeAreaId"
          rules={ADDRESS_RULES.pincodeAreaId}
          open={area.open}
          setOpen={area.setOpen}
          items={area.items}
          setItems={area.setItems}
          isLoading={area.isAreasLoading}
        />
      </View>

      <ControlledFormField
        control={form.control}
        name="landmark"
        rules={ADDRESS_RULES.landmark}
        label="Land mark / Delivery instruction"
        inputStyle={styles.landmarkInput}
        placeholder="eg. Near Lulu Mall"
        multiline
      />

      <DeliveryNote />
    </SectionCard>

    <SectionCard>
      <SectionTitle title="Contact details" />

      <ControlledFormField
        control={form.control}
        name="custName"
        rules={ADDRESS_RULES.custName}
        label="Customer name"
        required
      />

      <ControlledFormField
        control={form.control}
        name="phone"
        rules={ADDRESS_RULES.phone}
        label="Phone number"
        required
        placeholder="Enter mobile number"
        keyboardType="phone-pad"
        maxLength={10}
      />
    </SectionCard>
  </>
);

export default React.memo(AddressForm);

const styles = StyleSheet.create({
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
