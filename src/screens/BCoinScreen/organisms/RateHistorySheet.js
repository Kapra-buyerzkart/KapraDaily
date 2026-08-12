import React, { useEffect, useRef } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import CustomModal, { MODAL_POSITION } from '@/components/modal/CustomModal';
import ShimmerPlaceholder from '@/components/ShimmerPlaceholder';
import { CART_SPACING } from '@/styles/cartTheme';
import { hp } from '@/utils/responsive';

import { CoinText } from '../atoms';
import { SheetHeader } from '../molecules';
import { TREND_DOWN, TREND_UP } from '../constants';
import { formatCurrency, formatShortDate, formatTime } from '../utils';
import { PALETTE, RADIUS } from '../theme';

const SKELETON_ROWS = [0, 1, 2, 3, 4];

const RateHistorySheet = ({ visible, onClose, items, isLoading }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (visible) {
      modalRef.current?.open();
    } else {
      modalRef.current?.close();
    }
  }, [visible]);

  return (
    <CustomModal
      ref={modalRef}
      position={MODAL_POSITION.BOTTOM}
      maxHeight={hp(75)}
      scrollable={false}
      onClose={onClose}
      contentStyle={styles.sheet}
    >
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
                <ShimmerPlaceholder style={styles.skeletonLineLong} />
                <ShimmerPlaceholder style={styles.skeletonLineShort} />
              </View>
              <ShimmerPlaceholder style={styles.skeletonPill} />
            </View>
          ))
        ) : items && items.length > 0 ? (
          items.map((item, index) => {
            const isDown = item.changeType === 'down';
            return (
              <View key={item.id ?? index} style={styles.row}>
                <View style={styles.rowCopy}>
                  <CoinText variant="bodyStrong">
                    {formatShortDate(item.updatedOn)}
                  </CoinText>
                  <CoinText variant="caption" tone="muted" style={styles.time}>
                    {formatTime(item.updatedOn)}
                  </CoinText>
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
                  <CoinText variant="price" tone={isDown ? 'debit' : 'credit'}>
                    {formatCurrency(
                      item.bCoinValue ?? item.newValue ?? item.value,
                    )}
                  </CoinText>
                </View>
              </View>
            );
          })
        ) : (
          <CoinText variant="body" tone="muted" style={styles.empty}>
            No rate changes recorded yet
          </CoinText>
        )}
      </ScrollView>
    </CustomModal>
  );
};

const styles = StyleSheet.create({
  sheet: {
    paddingTop: 6,
    paddingBottom: CART_SPACING.sm,
  },
  scroll: {
    maxHeight: hp(56),
  },
  body: {
    paddingHorizontal: CART_SPACING.xl,
    paddingTop: CART_SPACING.sm,
    paddingBottom: CART_SPACING.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: CART_SPACING.md,
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
    paddingHorizontal: CART_SPACING.md,
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
    paddingVertical: CART_SPACING.lg,
  },
  skeletonCopy: {
    flex: 1,
    gap: 7,
  },
  skeletonLineLong: {
    height: 11,
    width: '45%',
    borderRadius: 6,
  },
  skeletonLineShort: {
    height: 9,
    width: '30%',
    borderRadius: 5,
  },
  skeletonPill: {
    width: 84,
    height: 30,
    borderRadius: RADIUS.pill,
  },
});

export default React.memo(RateHistorySheet);
