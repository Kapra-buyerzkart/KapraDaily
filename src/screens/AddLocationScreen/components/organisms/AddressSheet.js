import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { GrabHandle } from '../atoms';
import { SheetHeader } from '../molecules';
import AddressForm from './AddressForm';
import { SHEET_TOP } from '../../constants';
import { COLORS, GUTTER, RADIUS, SHADOW, SPACING, hp } from '../../theme';

const AddressSheet = ({ isEditMode, form, area, status, onBack, onSave }) => (
  <KeyboardAvoidingView
    style={styles.flex}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  >
    <View style={styles.sheet}>
      <GrabHandle />
      <SheetHeader
        title={isEditMode ? 'Edit location' : 'Add location'}
        onBack={onBack}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <AddressForm
          form={form}
          area={area}
          status={status}
          isEditMode={isEditMode}
          onSave={onSave}
        />
      </ScrollView>
    </View>
  </KeyboardAvoidingView>
);

export default React.memo(AddressSheet);

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  sheet: {
    flex: 1,
    marginTop: SHEET_TOP,
    paddingTop: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.card,
    borderTopRightRadius: RADIUS.card,
    ...SHADOW.bar,
  },
  scroll: {
    flex: 1,
    paddingHorizontal: GUTTER,
  },
  content: {
    paddingBottom: hp('4%'),
  },
});
