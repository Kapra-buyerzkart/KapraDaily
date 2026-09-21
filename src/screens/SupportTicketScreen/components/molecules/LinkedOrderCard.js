import { View, Text } from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import { MAX_FONT_SCALE } from '@/styles/homeTheme';
import { ICON, styles } from '../../styles';
import { LUXURY_COLORS } from '../../SupportTicketsListScreen/supportLuxuryTheme';
import FieldLabel from '../atoms/FieldLabel';

function LinkedOrderCard({ orderNumber }) {
  return (
    <View style={styles.field}>
      <FieldLabel>Order Number</FieldLabel>

      <View style={styles.linkedOrderCard}>
        <View style={styles.linkedOrderWell}>
          <Feather
            name="shopping-bag"
            size={18}
            color={LUXURY_COLORS.gold}
          />
        </View>

        <View style={styles.linkedOrderCopy}>
          <Text
            style={styles.linkedOrderCaption}
            maxFontSizeMultiplier={MAX_FONT_SCALE}
          >
            Linked to order
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
          color={LUXURY_COLORS.textFaint}
        />
      </View>
    </View>
  );
}

export default React.memo(LinkedOrderCard);
