import React from 'react';
import { Image, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ACCENT, MAX_FONT_SCALE } from '@/styles/homeTheme';
import PriceSection from './PriceSection';
import styles from '../styles';
import { NAME_LINES, UD_TOKEN_ICON } from '../constants';

/** Everything below the media well: token strip, rating/ETA, name, weight, price. */
const ProductInfo = ({
  name,
  weight,
  price,
  mrp,
  token,
  rating,
  deliveryEta,
  showToken,
  isThreeColumn,
}) => {
  const showMetaRow = !!rating || !!deliveryEta;

  return (
    <View style={[styles.info, isThreeColumn && styles.infoSmall]}>
      {showToken && (
        <View style={styles.tokenRow}>
          <Image source={UD_TOKEN_ICON} style={styles.tokenIcon} />
          <Text
            style={styles.tokenText}
            numberOfLines={1}
            maxFontSizeMultiplier={MAX_FONT_SCALE}
          >
            {token}
          </Text>
        </View>
      )}

      {showMetaRow && (
        <View style={styles.metaRow}>
          {!!rating && (
            <View style={styles.ratingPill}>
              <Ionicons name="star" size={9} color={ACCENT.successText} />
              <Text
                style={styles.ratingText}
                maxFontSizeMultiplier={MAX_FONT_SCALE}
              >
                {rating}
              </Text>
            </View>
          )}
          {!!deliveryEta && (
            <Text
              style={styles.deliveryText}
              numberOfLines={1}
              maxFontSizeMultiplier={MAX_FONT_SCALE}
            >
              {deliveryEta}
            </Text>
          )}
        </View>
      )}

      <Text
        numberOfLines={NAME_LINES}
        ellipsizeMode="tail"
        style={[styles.productName, isThreeColumn && styles.productNameSmall]}
        maxFontSizeMultiplier={MAX_FONT_SCALE}
      >
        {name}
      </Text>

      <Text
        numberOfLines={1}
        style={[
          styles.productWeight,
          isThreeColumn && styles.productWeightSmall,
        ]}
        maxFontSizeMultiplier={MAX_FONT_SCALE}
      >
        {weight}
      </Text>

      <PriceSection price={price} mrp={mrp} isThreeColumn={isThreeColumn} />
    </View>
  );
};

export default React.memo(ProductInfo);
