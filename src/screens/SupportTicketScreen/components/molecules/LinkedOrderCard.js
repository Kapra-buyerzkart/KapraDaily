import { View, Text } from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { INK, MAX_FONT_SCALE } from '@/styles/homeTheme';
import { ICON, styles } from '../../styles';
import FieldLabel from '../atoms/FieldLabel';

function LinkedOrderCard({ orderNumber }) {
  return (
    <View style={styles.field}>
      <FieldLabel>Order Number</FieldLabel>

      <View style={styles.linkedOrderCard}>
        <View style={styles.linkedOrderWell}>
          <MaterialCommunityIcons
            name="receipt"
            size={ICON.well}
            color={INK.base}
          />
        </View>

        <View style={styles.linkedOrderCopy}>
          <Text
            style={styles.linkedOrderCaption}
            maxFontSizeMultiplier={MAX_FONT_SCALE}
          >
            Linked to your order
          </Text>
          <Text
            style={styles.linkedOrderValue}
            numberOfLines={1}
            maxFontSizeMultiplier={MAX_FONT_SCALE}
          >
            {orderNumber}
          </Text>
        </View>

        <MaterialCommunityIcons
          name="lock-outline"
          size={ICON.meta}
          color={INK.faint}
        />
      </View>
    </View>
  );
}

export default React.memo(LinkedOrderCard);
