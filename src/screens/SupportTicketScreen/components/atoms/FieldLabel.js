import { Text } from 'react-native';
import React from 'react';
import { MAX_FONT_SCALE } from '@/styles/homeTheme';
import { styles } from '../../styles';

function FieldLabel({ children }) {
  return (
    <Text style={styles.fieldLabel} maxFontSizeMultiplier={MAX_FONT_SCALE}>
      {children}
    </Text>
  );
}

export default React.memo(FieldLabel);
