import { View, Text } from 'react-native';
import React from 'react';
import { MAX_FONT_SCALE } from '@/styles/homeTheme';
import { styles } from '../../styles';

function FieldFooter({ helper, counter }) {
  if (!helper && !counter) return null;

  return (
    <View style={styles.fieldFooter}>
      <Text style={styles.fieldHelper} maxFontSizeMultiplier={MAX_FONT_SCALE}>
        {helper || ''}
      </Text>
      {counter ? (
        <Text
          style={styles.fieldCounter}
          maxFontSizeMultiplier={MAX_FONT_SCALE}
        >
          {counter}
        </Text>
      ) : null}
    </View>
  );
}

export default React.memo(FieldFooter);
