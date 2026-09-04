import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Surface, Divider, SectionHeading } from '../../../../../components/atoms';
import { UI_SPACING } from '../../../../../theme/tokens';
import { ContactField, CurrentContactRow, InfoNote } from '../fields';

interface Props {
  isPhone: boolean;
  value: string;
  originalValue?: string;
  error?: string | null;
  onChangeText: (text: string) => void;
  onSubmitEditing?: () => void;
}

const ContactStepCard: React.FC<Props> = ({
  isPhone,
  value,
  originalValue,
  error,
  onChangeText,
  onSubmitEditing,
}) => (
  <Surface style={styles.card}>
    <SectionHeading
      title={`New ${isPhone ? 'number' : 'email'}`}
      subtitle="We’ll send a one-time code to confirm it’s yours"
    />

    {!!originalValue && (
      <>
        <View style={styles.currentBlock}>
          <CurrentContactRow isPhone={isPhone} value={originalValue} />
        </View>
        <Divider />
      </>
    )}

    <View style={styles.fieldBlock}>
      <ContactField
        isPhone={isPhone}
        value={value}
        error={error}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
      />
    </View>

    <InfoNote>
      {isPhone
        ? 'Your new number becomes your login and where order updates are sent.'
        : 'Your new email becomes your login and where receipts are sent.'}
    </InfoNote>
  </Surface>
);

export default React.memo(ContactStepCard);

const styles = StyleSheet.create({
  card: {
    padding: UI_SPACING.lg,
    gap: UI_SPACING.lg,
  },
  currentBlock: {
    marginBottom: UI_SPACING.lg,
  },
  fieldBlock: {
    marginTop: UI_SPACING.xs,
  },
});
