import React from 'react';
import { StyleSheet, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { FieldLabel } from '../atoms';
import {
  COLORS,
  FIELD_HEIGHT,
  HAIRLINE,
  RADIUS,
  SPACING,
  TYPE,
  wp,
} from '../../theme';

const ArrowDown = () => (
  <Ionicons name="chevron-down" size={wp('4%')} color={COLORS.textMuted} />
);
const ArrowUp = () => (
  <Ionicons name="chevron-up" size={wp('4%')} color={COLORS.textPrimary} />
);
const Tick = () => (
  <Ionicons name="checkmark" size={wp('4%')} color={COLORS.textPrimary} />
);

const AreaDropdown = ({
  open,
  setOpen,
  value,
  setValue,
  items,
  setItems,
  isLoading,
  style,
}) => (
  <View style={[styles.wrap, style]}>
    <DropDownPicker
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      setItems={setItems}
      placeholder="PIN Code Area"
      listMode="SCROLLVIEW"
      loading={isLoading}
      style={styles.dropdown}
      textStyle={styles.text}
      placeholderStyle={styles.placeholder}
      dropDownContainerStyle={styles.container}
      listItemLabelStyle={styles.text}
      selectedItemLabelStyle={styles.selectedText}
      ArrowDownIconComponent={ArrowDown}
      ArrowUpIconComponent={ArrowUp}
      TickIconComponent={Tick}
    />
    <FieldLabel label="Area" required isActive={open} />
  </View>
);

export default React.memo(AreaDropdown);

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    marginBottom: SPACING.lg,
    position: 'relative',
  },
  dropdown: {
    minHeight: FIELD_HEIGHT,
    borderWidth: HAIRLINE,
    borderColor: COLORS.line,
    borderRadius: RADIUS.input,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.well,
  },
  container: {
    borderWidth: HAIRLINE,
    borderColor: COLORS.line,
    borderRadius: RADIUS.input,
    backgroundColor: COLORS.surface,
  },
  text: {
    ...TYPE.label,
    color: COLORS.textPrimary,
  },
  selectedText: {
    ...TYPE.labelStrong,
    color: COLORS.textPrimary,
  },
  placeholder: {
    ...TYPE.label,
    color: COLORS.textFaint,
  },
});
