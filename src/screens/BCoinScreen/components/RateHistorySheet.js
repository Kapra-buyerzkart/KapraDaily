import React, { useEffect, useRef } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import CustomModal, { MODAL_POSITION } from '@/components/modal/CustomModal';
import ShimmerPlaceholder from '@/components/ShimmerPlaceholder';
import { FONTS } from '@/styles/typography';
import { hp } from '@/utils/responsive';

import SheetHeader from './SheetHeader';
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
                  <Text style={styles.date}>
                    {formatShortDate(item.updatedOn)}
                  </Text>
                  <Text style={styles.time}>{formatTime(item.updatedOn)}</Text>
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
                  <Text
                    style={[
                      styles.rate,
                      { color: isDown ? PALETTE.debit : PALETTE.credit },
                    ]}
                  >
                    {formatCurrency(
                      item.bCoinValue ?? item.newValue ?? item.value,
                    )}
                  </Text>
                </View>
              </View>
            );
          })
        ) : (
          <Text style={styles.empty}>No rate changes recorded yet</Text>
        )}
      </ScrollView>
    </CustomModal>
  );
};

const styles = StyleSheet.create({
  sheet: {
    paddingTop: 6,
    paddingBottom: 8,
  },
  scroll: {
    maxHeight: hp(56),
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: PALETTE.line,
  },
  rowCopy: {
    flex: 1,
  },
  date: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: 13.5,
    color: PALETTE.textPrimary,
  },
  time: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: 11.5,
    color: PALETTE.textMuted,
    marginTop: 2,
  },
  ratePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: RADIUS.pill,
  },
  trend: {
    width: 10,
    height: 7,
    resizeMode: 'contain',
  },
  rate: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: 13.5,
  },
  empty: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: 13,
    color: PALETTE.textMuted,
    textAlign: 'center',
    paddingVertical: 40,
  },
  skeletonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
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
