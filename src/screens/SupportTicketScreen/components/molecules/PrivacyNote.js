import { View, Text } from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { MAX_FONT_SCALE } from '@/styles/homeTheme';
import { ICON, styles } from '../../styles';
import { LUXURY_COLORS } from '../../SupportTicketsListScreen/supportLuxuryTheme';

function PrivacyNote({ phone }) {
  return (
    <View style={styles.noteRow}>
      <MaterialCommunityIcons
        name="shield-check-outline"
        size={ICON.meta}
        color={LUXURY_COLORS.gold}
        style={styles.noteIcon}
      />
      <Text style={styles.noteText} maxFontSizeMultiplier={MAX_FONT_SCALE}>
        {phone
          ? `Our support team reviews every request and will contact you directly on ${phone}.`
          : 'Our support team reviews every request and will get back to you promptly.'}
      </Text>
    </View>
  );
}

export default React.memo(PrivacyNote);
