import React from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';

import { AppText, Shimmer } from '../../../components/atoms';
import { hp } from '../../../theme/tokens';
import { SheetHeader } from '../molecules';
import { TREND_DOWN, TREND_UP } from '../constants';
import {
  RateItem,
  formatCurrency,
  formatShortDate,
  formatTime,
} from '../utils';
import { PALETTE, RADIUS, SPACING } from '../theme';
import BottomSheet from './BottomSheet';

const SKELETON_ROWS = [0, 1, 2, 3, 4];

interface RateHistorySheetProps {
  visible: boolean;
  onClose: () => void;
  items: RateItem[];
  isLoading: boolean;
}

const RateHistorySheet: React.FC<RateHistorySheetProps> = ({
  visible,
  onClose,
  items,
  isLoading,
}) => (
  <BottomSheet visible={visible} onClose={onClose} maxHeightPercent={75}>
    <SheetHeader
      title="UD Coin rate history"
      caption="How the coin value moved over time"
      onClose={onClose}
    />

    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.body}
      showsVerticalScrollIndicator={false}
    >
      {isLoading ? (
        SKELETON_ROWS.map(row => (
          <View key={row} style={styles.skeletonRow}>
            <View style={styles.skeletonCopy}>
              <Shimmer width="45%" height={11} radius={6} />
              <Shimmer width="30%" height={9} radius={5} />
            </View>
            <Shimmer width={84} height={30} radius={RADIUS.pill} />
          </View>
        ))
      ) : items && items.length > 0 ? (
        items.map((item, index) => {
          const isDown = item.changeType === 'down';
          return (
            <View key={item.id ?? index} style={styles.row}>
              <View style={styles.rowCopy}>
                <AppText variant="bodyStrong">
                  {formatShortDate(item.updatedOn)}
                </AppText>
                <AppText variant="caption" tone="muted" style={styles.time}>
                  {formatTime(item.updatedOn)}
                </AppText>
              </View>

              <View
                style={[
                  styles.ratePill,
                  {
                    backgroundColor: isDown
                      ? PALETTE.debitTint
                      : PALETTE.creditTint,
                  },
                ]}
              >
                <Image
                  source={isDown ? TREND_DOWN : TREND_UP}
                  style={styles.trend}
                />
                <AppText
                  variant="price"
                  tone={isDown ? PALETTE.debit : PALETTE.credit}
                >
                  {formatCurrency(
                    item.bCoinValue ?? item.newValue ?? item.value,
                  )}
                </AppText>
              </View>
            </View>
          );
        })
      ) : (
        <AppText variant="body" tone="muted" style={styles.empty}>
          No rate changes recorded yet
        </AppText>
      )}
    </ScrollView>
  </BottomSheet>
);

export default React.memo(RateHistorySheet);

const styles = StyleSheet.create({
  scroll: {
    maxHeight: hp('56%'),
  },
  body: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: PALETTE.line,
  },
  rowCopy: {
    flex: 1,
  },
  time: {
    marginTop: 2,
  },
  ratePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: SPACING.md,
    paddingVertical: 7,
    borderRadius: RADIUS.pill,
  },
  trend: {
    width: 10,
    height: 7,
    resizeMode: 'contain',
  },
  empty: {
    textAlign: 'center',
    paddingVertical: 40,
  },
  skeletonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.lg,
  },
  skeletonCopy: {
    flex: 1,
    gap: 7,
  },
});
