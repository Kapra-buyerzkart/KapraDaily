import React from 'react';
import { Text, View } from 'react-native';
import { MAX_FONT_SCALE, RADIUS } from '@/styles/homeTheme';
import styles from '../styles';
import { formatAmount, resolveAmount, resolveSavings } from '../utils';

/**
 * Green price pill with the struck-through MRP beside it, and the saving spelled
 * out underneath. Rupees off when an MRP is available, otherwise whatever
 * percentage the API sent, so a discount is never dropped silently.
 */
const PriceSection = ({ price, mrp, offer, isThreeColumn }) => {
  const amount = resolveAmount(price);
  const hasMrp = !!mrp && mrp !== price;
  const savings = resolveSavings(mrp, price);
  const savingsLabel = savings > 0 ? `₹${formatAmount(savings)} OFF` : offer;

  // A non-numeric amount formats to '' — show it verbatim rather than a bare ₹.
  const priceLabel = formatAmount(amount) || amount;
  const mrpLabel = formatAmount(mrp) || mrp;

  return (
    <>
      <View style={styles.priceRow}>
        <View
          style={{
            backgroundColor: 'black',
            borderRadius: RADIUS.xxs,
          }}
        >
          <View
            style={[styles.pricePill, isThreeColumn && styles.pricePillSmall]}
          >
            <Text
              style={[styles.priceText, isThreeColumn && styles.priceTextSmall]}
              maxFontSizeMultiplier={MAX_FONT_SCALE}
            >
              <Text
                style={[
                  styles.priceSymbol,
                  isThreeColumn && styles.priceSymbolSmall,
                ]}
              >
                ₹
              </Text>
              {priceLabel}
            </Text>
          </View>
        </View>

        {hasMrp && (
          <Text
            style={[styles.mrpText, isThreeColumn && styles.mrpTextSmall]}
            maxFontSizeMultiplier={MAX_FONT_SCALE}
          >
            ₹{mrpLabel}
          </Text>
        )}
      </View>

      <View style={styles.savingsRow}>
        {!!savingsLabel && (
          <>
            <Text
              style={styles.savingsText}
              maxFontSizeMultiplier={MAX_FONT_SCALE}
            >
              {savingsLabel}
            </Text>
            <View style={styles.savingsRuleClip}>
              <View style={styles.savingsRule} />
            </View>
          </>
        )}
      </View>
    </>
  );
};

export default React.memo(PriceSection);
