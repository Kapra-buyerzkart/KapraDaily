import React from 'react';
import { Text, View } from 'react-native';
import { MAX_FONT_SCALE } from '@/styles/homeTheme';
import styles from '../styles';

const PriceSection = ({ price, mrp, isThreeColumn }) => {
  const hasMrp = !!mrp && mrp !== price;

  return (
    <View style={styles.priceRow}>
      <Text
        style={[styles.priceText, isThreeColumn && styles.priceTextSmall]}
        maxFontSizeMultiplier={MAX_FONT_SCALE}
      >
        ₹{price}
      </Text>

      {hasMrp && (
        <Text
          style={[styles.mrpText, isThreeColumn && styles.mrpTextSmall]}
          maxFontSizeMultiplier={MAX_FONT_SCALE}
        >
          ₹{mrp}
        </Text>
      )}
    </View>
  );
};

export default React.memo(PriceSection);
