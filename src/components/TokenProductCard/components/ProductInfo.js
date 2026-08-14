import React from 'react';
import { Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ACCENT, MAX_FONT_SCALE } from '@/styles/homeTheme';
import PriceSection from './PriceSection';
import styles from '../styles';
import {
  NAME_LINES,
  UD_TOKEN_ICON,
  UD_TOKEN_ICON_SIZE,
  UD_TOKEN_ICON_SIZE_SMALL,
} from '../constants';

/**
 * Everything below the media well: price and saving lead, then the UD token the
 * order earns, any rating/ETA the API sent, and finally the name and weight.
 */
const ProductInfo = ({
  name,
  weight,
  price,
  mrp,
  offer,
  token,
  rating,
  deliveryEta,
  showToken,
  isThreeColumn,
}) => {
  const showMetaRow = !!rating || !!deliveryEta;

  return (
    <View
      style={[styles.info, isThreeColumn && styles.infoSmall]}
      importantForAccessibility="no-hide-descendants"
    >
      <PriceSection
        price={price}
        mrp={mrp}
        offer={offer}
        isThreeColumn={isThreeColumn}
      />

      {showToken && (
        <View style={[styles.tokenRow, isThreeColumn && styles.tokenRowSmall]}>
          <MaterialCommunityIcons
            name={UD_TOKEN_ICON}
            size={isThreeColumn ? UD_TOKEN_ICON_SIZE_SMALL : UD_TOKEN_ICON_SIZE}
            color={ACCENT.action}
          />
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
        {weight || ''}
      </Text>
    </View>
  );
};

export default React.memo(ProductInfo);
