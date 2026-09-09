import React from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GrabHandle } from '../atoms';
import { SaveButton, SheetHeader } from '../molecules';
import AddressForm from './AddressForm';
import { SHEET_TOP } from '../../constants';
import { COLORS, GUTTER, HAIRLINE, RADIUS, SHADOW, SPACING } from '../../theme';

const AddressSheet = ({
  isEditMode,
  form,
  area,
  status,
  onSave,
  isExpanded,
}) => {
  const insets = useSafeAreaInsets();
  const sheetTop = Math.max(insets.top, SPACING.sm) + SPACING.sm;

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.sheet, isExpanded && { marginTop: sheetTop }]}>
        <GrabHandle />
        <SheetHeader
          title={isEditMode ? 'Edit location' : 'Confirm location'}
          subtitle="Drag the map above to fine-tune your spot"
        />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <AddressForm form={form} area={area} status={status} />
        </ScrollView>

        <View
          style={[
            styles.footer,
            { paddingBottom: Math.max(insets.bottom, SPACING.lg) },
          ]}
        >
          <SaveButton
            label={isEditMode ? 'Update address' : 'Save address'}
            isBusy={status.isLoading}
            isBlocked={!status.isValid}
            onPress={onSave}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default React.memo(AddressSheet);

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  sheet: {
    flex: 1,
    marginTop: SHEET_TOP,
    paddingTop: SPACING.md,
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADIUS.sheet,
    borderTopRightRadius: RADIUS.sheet,
    ...SHADOW.sheet,
  },
  scroll: {
    flex: 1,
    paddingHorizontal: GUTTER,
    backgroundColor: COLORS.canvas,
  },
  content: {
    paddingBottom: SPACING.xl,
  },
  footer: {
    paddingHorizontal: GUTTER,
    paddingTop: SPACING.md,
    borderTopWidth: HAIRLINE,
    borderTopColor: COLORS.line,
    backgroundColor: COLORS.surface,
  },
});
