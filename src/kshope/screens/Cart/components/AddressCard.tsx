import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppText, Badge, IconDisc } from '../../../components/atoms';
import {
  UI_COLORS,
  UI_RADIUS,
  UI_SPACING,
  hp,
  wp,
} from '../../../theme/tokens';

interface AddressCardProps {
  addressType?: string;
  addressLine?: string;
  onChange: () => void;
}

const AddressCard: React.FC<AddressCardProps> = ({
  addressType,
  addressLine,
  onChange,
}) => (
  <View style={styles.card}>
    <IconDisc size={wp('9.5%')} tone="brand">
      <MaterialCommunityIcons
        name="map-marker-outline"
        size={wp('5%')}
        color={UI_COLORS.primary}
      />
    </IconDisc>

    <View style={styles.details}>
      <View style={styles.headingRow}>
        <AppText variant="micro" tone="muted">
          DELIVERING TO
        </AppText>
        <Badge tone="brand" label={(addressType || 'Home').toUpperCase()} />
      </View>
      <AppText variant="label" tone="secondary" numberOfLines={2}>
        {addressLine || 'No address selected'}
      </AppText>
    </View>

    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onChange}
      style={styles.changeButton}
      accessibilityRole="button"
      accessibilityLabel="Change delivery address"
    >
      <AppText variant="microStrong" tone="brand">
        Change
      </AppText>
    </TouchableOpacity>
  </View>
);

export default React.memo(AddressCard);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: UI_SPACING.md,
    marginHorizontal: UI_SPACING.lg,
    marginTop: hp('1.6%'),
    padding: UI_SPACING.md,
    borderRadius: UI_RADIUS.productCard,
    backgroundColor: UI_COLORS.well,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: UI_COLORS.border,
  },
  details: {
    flex: 1,
    gap: UI_SPACING.xs,
  },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: UI_SPACING.sm,
  },
  changeButton: {
    paddingHorizontal: UI_SPACING.md,
    paddingVertical: UI_SPACING.xs + 2,
    borderRadius: UI_RADIUS.pill,
    backgroundColor: UI_COLORS.primaryTint,
    borderWidth: 1,
    borderColor: UI_COLORS.primaryEdge,
  },
});
