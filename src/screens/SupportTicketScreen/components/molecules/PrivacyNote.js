import { View, Text } from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { INK, MAX_FONT_SCALE } from '@/styles/homeTheme';
import { ICON, styles } from '../../styles';

function PrivacyNote({ phone }) {
  return (
    <View style={styles.noteRow}>
      <MaterialCommunityIcons
        name="shield-check-outline"
        size={ICON.meta}
        color={INK.muted}
        style={styles.noteIcon}
      />
      <Text style={styles.noteText} maxFontSizeMultiplier={MAX_FONT_SCALE}>
        {phone
          ? `Our team reviews every ticket and will reach you on ${phone}.`
          : 'Our team reviews every ticket and will get back to you soon.'}
      </Text>
    </View>
  );
}

export default React.memo(PrivacyNote);
