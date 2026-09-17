import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Fonts } from '../../../../theme/fonts';
import { pt } from '../../../../theme/tokens';
import { ORDER_COLORS } from './theme';

interface OrdersSummaryCardProps {
  totalCount: number;
  activeCount: number;
  deliveredCount: number;
}

const OrdersSummaryCard: React.FC<OrdersSummaryCardProps> = ({
  totalCount,
  activeCount,
  deliveredCount,
}) => {
  return (
    <View style={styles.card}>
      {/* 1: Total Orders */}
      <View style={styles.statItem}>
        <View style={styles.iconCircle}>
          <Ionicons name="bag-outline" size={19} color={ORDER_COLORS.ink} />
        </View>
        <View style={styles.textWrap}>
          <Text style={styles.countText}>{totalCount}</Text>
          <Text style={styles.labelText}>Total Orders</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* 2: Active Orders */}
      <View style={styles.statItem}>
        <View style={styles.iconCircle}>
          <Ionicons name="cube-outline" size={19} color={ORDER_COLORS.ink} />
        </View>
        <View style={styles.textWrap}>
          <Text style={styles.countText}>{activeCount}</Text>
          <Text style={styles.labelText}>Active Orders</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* 3: Delivered */}
      <View style={styles.statItem}>
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons
            name="compass-outline"
            size={20}
            color={ORDER_COLORS.ink}
          />
        </View>
        <View style={styles.textWrap}>
          <Text style={styles.countText}>{deliveredCount}</Text>
          <Text style={styles.labelText}>Delivered</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginTop: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F7F8F7',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: {
    flexShrink: 1,
  },
  countText: {
    fontFamily: Fonts.lexend.semiBold,
    fontSize: pt(17),
    lineHeight: pt(21),
    color: ORDER_COLORS.ink,
  },
  labelText: {
    fontFamily: Fonts.lexend.regular,
    fontSize: pt(9.5),
    lineHeight: pt(13),
    color: ORDER_COLORS.inkMuted,
    marginTop: 1,
  },
  divider: {
    width: 1,
    height: 34,
    backgroundColor: '#EDEDED',
    marginHorizontal: 8,
  },
});

export default OrdersSummaryCard;
