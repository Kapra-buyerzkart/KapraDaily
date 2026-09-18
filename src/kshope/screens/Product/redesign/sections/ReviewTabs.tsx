import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { HOME_FONTS, fs, s } from '../../../Home/redesign/theme';
import { PDP_ART } from '../assets';
import {
  ChevronIcon,
  DimensionsIcon,
  DiamondIcon,
  InfoIcon,
  StarSpecIcon,
} from '../icons';
import { PDP_COLORS } from '../theme';
import type { ReviewEntry } from '../data/selectors';

type Spec = {
  id: string;
  label: string;
  value: string;
};

type Props = {
  average: string;
  total: number;
  bars: { star: number; percent: number }[];
  reviews: ReviewEntry[];
  hasRatings: boolean;
  specs: Spec[];
  warranty?: string;
  priceBreakup?: {
    price: string;
    mrp: string;
    saved: string;
    percent: number;
  };
};

const PREVIEW_COUNT = 2;

const Stars: React.FC<{ count: number; size: number }> = ({ count, size }) => {
  if (count <= 0) {
    return null;
  }
  return (
    <View style={styles.starsRow}>
      {Array.from({ length: Math.min(5, Math.round(count)) }).map(
        (_, index) => (
          <Image
            key={index}
            source={PDP_ART.ratingStar}
            resizeMode="contain"
            style={{ width: s(size), height: s(size) }}
          />
        ),
      )}
    </View>
  );
};

const ReviewPanel: React.FC<Props> = ({
  average,
  total,
  bars,
  reviews,
  hasRatings,
}) => {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? reviews : reviews.slice(0, PREVIEW_COUNT);

  if (!hasRatings) {
    return <Text style={styles.empty}>No reviews yet for this product.</Text>;
  }

  return (
    <View style={styles.reviewPanel}>
      <View style={styles.summaryRow}>
        <Text style={styles.average}>{average}</Text>
        <View style={styles.summaryRight}>
          <Text style={styles.ratingCount}>{`${total} Ratings`}</Text>
          <Stars count={Math.round(Number(average))} size={16} />
        </View>
      </View>

      <View style={styles.bars}>
        {bars.map(bar => (
          <View key={bar.star} style={styles.barRow}>
            <Text style={styles.barStar}>{bar.star}</Text>
            <Image
              source={PDP_ART.ratingStar}
              resizeMode="contain"
              style={styles.barStarIcon}
            />
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: `${bar.percent}%` }]} />
            </View>
            <Text style={styles.barPercent}>{`${bar.percent}%`}</Text>
          </View>
        ))}
      </View>

      {reviews.length > 0 ? (
        <>
          <Text style={styles.reviewCount}>{`${reviews.length} Reviews`}</Text>

          {visible.map(entry => (
            <View key={entry.id} style={styles.reviewRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {entry.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.reviewBody}>
                <View style={styles.reviewHead}>
                  <Text style={styles.reviewName}>{entry.name}</Text>
                  {entry.date ? (
                    <Text style={styles.reviewDate}>{entry.date}</Text>
                  ) : null}
                </View>
                <Stars count={entry.rating} size={9} />
                {entry.comment ? (
                  <Text style={styles.reviewText}>{entry.comment}</Text>
                ) : null}
              </View>
            </View>
          ))}

          {reviews.length > PREVIEW_COUNT ? (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setExpanded(current => !current)}
              style={styles.seeMore}
            >
              <Text style={styles.seeMoreText}>
                {expanded ? 'See Less' : 'See More'}
              </Text>
              <ChevronIcon
                width={8}
                height={14}
                style={{
                  transform: [{ rotate: expanded ? '-90deg' : '0deg' }],
                }}
              />
            </TouchableOpacity>
          ) : null}
        </>
      ) : null}
    </View>
  );
};

const ProductDetailsPanel: React.FC<{ specs: Spec[] }> = ({ specs }) => {
  if (!specs || specs.length === 0) {
    return <Text style={styles.empty}>No specifications available.</Text>;
  }

  // Find jewelry-related attributes if available
  const findAttr = (...terms: string[]) =>
    specs.find(s => {
      const lower = (s.label || '').toLowerCase();
      return terms.some(t => lower.includes(t.toLowerCase()));
    });

  const goldAttr = findAttr('gold', 'karat', 'kt', 'purity', 'metal');
  const weightAttr = findAttr('net wt', 'weight', 'gross wt');
  const colorAttr = findAttr('color', 'tone', 'finish');
  const dimAttr = findAttr('dimension', 'height', 'size', 'length');
  const diamondAttr = findAttr('diamond', 'clarity', 'carat', 'stone');
  const settingAttr = findAttr('setting', 'type', 'design');

  // Fallback to sequential spec items if specific keywords are not found
  const card1Title = goldAttr
    ? 'GOLD'
    : (specs[0]?.label || 'SPECIFICATION').toUpperCase();
  const card1Val = goldAttr?.value || specs[0]?.value || '';
  const card1Sub1 = colorAttr?.value || (goldAttr ? '' : specs[1]?.value || '');
  const card1Sub2 = weightAttr?.value || '';

  const card2Title = dimAttr
    ? 'DIMENSIONS'
    : (specs[1]?.label || 'DIMENSIONS').toUpperCase();
  const card2Val =
    dimAttr?.value ||
    (goldAttr ? specs[1]?.value : specs[2]?.value) ||
    'Standard';
  const card2Sub = weightAttr ? `${weightAttr.value} (Gross wt)` : '';

  const card3Title = diamondAttr
    ? 'DIAMOND'
    : (specs[2]?.label || 'DETAILS').toUpperCase();
  const card3Val = diamondAttr?.value || specs[2]?.value || 'Certified Quality';
  const card3Sub1 = diamondAttr ? 'Total wt' : specs[3]?.value || '';
  const card3Right1 = settingAttr?.value || (goldAttr ? 'Hand Crafted' : '');
  const card3Right2 = findAttr('count', 'stone count')?.value || '';

  return (
    <View style={styles.detailsContainer}>
      {/* 2-column top row */}
      <View style={styles.cardRow}>
        {/* Card 1: Gold / Primary */}
        <View style={styles.cardHalf}>
          <View style={[styles.cornerArc, { backgroundColor: '#FDF7EB' }]} />
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <StarSpecIcon width={12} height={12} color="#A27545" />
              <Text style={styles.cardHeaderText}>{card1Title}</Text>
            </View>
            <InfoIcon width={12} height={12} color="#A2A2A2" />
          </View>
          <Text style={styles.cardPrimaryVal} numberOfLines={1}>
            {card1Val || '18 KT'}
          </Text>
          {card1Sub1 ? (
            <Text style={styles.cardSubText} numberOfLines={1}>
              {card1Sub1}
            </Text>
          ) : null}
          {card1Sub2 ? (
            <Text style={styles.cardMetaText} numberOfLines={1}>
              {card1Sub2}
            </Text>
          ) : null}
        </View>

        {/* Card 2: Dimensions */}
        <View style={styles.cardHalf}>
          <View style={[styles.cornerArc, { backgroundColor: '#EDF5F1' }]} />
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <DimensionsIcon width={12} height={12} color="#0C382E" />
              <Text style={styles.cardHeaderText}>{card2Title}</Text>
            </View>
          </View>
          <Text style={styles.cardPrimaryVal} numberOfLines={1}>
            {card2Val}
          </Text>
          {card2Sub ? (
            <Text style={styles.cardMetaText} numberOfLines={1}>
              {card2Sub}
            </Text>
          ) : null}
        </View>
      </View>

      {/* Card 3: Diamond / Secondary Full Width */}
      <View style={styles.cardFull}>
        <View style={[styles.cornerArc, { backgroundColor: '#EAF6EF' }]} />
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <DiamondIcon width={13} height={13} color="#0C382E" />
            <Text style={styles.cardHeaderText}>{card3Title}</Text>
          </View>
          <InfoIcon width={12} height={12} color="#A2A2A2" />
        </View>

        <View style={styles.cardFullBody}>
          <View style={styles.cardFullLeft}>
            <Text style={styles.cardPrimaryVal} numberOfLines={1}>
              {card3Val}
            </Text>
            {card3Sub1 ? (
              <Text style={styles.cardMetaText} numberOfLines={1}>
                {card3Sub1}
              </Text>
            ) : null}
          </View>
          {card3Right1 || card3Right2 ? (
            <View style={styles.cardFullRight}>
              {card3Right1 ? (
                <Text style={styles.cardRightText}>{card3Right1}</Text>
              ) : null}
              {card3Right2 ? (
                <Text style={styles.cardRightText}>{card3Right2}</Text>
              ) : null}
            </View>
          ) : null}
        </View>
      </View>

      {/* Other specs if more than 3 */}
      {specs.length > 3 ? (
        <View style={styles.extraSpecs}>
          {specs.slice(3).map(spec => (
            <View key={spec.id} style={styles.specRow}>
              <Text style={styles.specLabel}>{spec.label}</Text>
              <Text style={styles.specValue}>{spec.value}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
};

const PriceBreakupPanel: React.FC<{
  priceBreakup?: { price: string; mrp: string; saved: string; percent: number };
}> = ({ priceBreakup }) => {
  if (!priceBreakup || !priceBreakup.price) {
    return <Text style={styles.empty}>Price breakup not available.</Text>;
  }

  return (
    <View style={styles.breakupContainer}>
      <View style={styles.breakupRow}>
        <Text style={styles.breakupLabel}>Selling Price</Text>
        <Text style={styles.breakupVal}>{priceBreakup.price}</Text>
      </View>

      {priceBreakup.mrp ? (
        <View style={styles.breakupRow}>
          <Text style={styles.breakupLabel}>Maximum Retail Price (MRP)</Text>
          <Text style={styles.breakupStrike}>{priceBreakup.mrp}</Text>
        </View>
      ) : null}

      {priceBreakup.saved ? (
        <View style={styles.breakupRow}>
          <Text style={styles.breakupLabelSavings}>Total Savings</Text>
          <Text style={styles.breakupValSavings}>
            - {priceBreakup.saved} ({priceBreakup.percent}% OFF)
          </Text>
        </View>
      ) : null}

      <View style={styles.breakupDivider} />

      <View style={styles.breakupRowTotal}>
        <Text style={styles.breakupLabelTotal}>Net Payable Amount</Text>
        <Text style={styles.breakupValTotal}>{priceBreakup.price}</Text>
      </View>
    </View>
  );
};

export const ReviewTabs: React.FC<Props> = props => {
  // Tabs: 'PRODUCT DETAILS', 'PRICE BREAKUP', and if ratings exist, 'REVIEWS'
  const tabs = ['PRODUCT DETAILS', 'PRICE BREAKUP'];
  if (props.hasRatings) {
    tabs.push('REVIEWS');
  }

  const [active, setActive] = useState(0);

  return (
    <View style={styles.wrap}>
      {/* Segmented Tab Buttons */}
      <View style={styles.tabBar}>
        {tabs.map((tab, index) => {
          const isSelected = active === index;
          return (
            <TouchableOpacity
              key={tab}
              activeOpacity={0.85}
              onPress={() => setActive(index)}
              style={[
                styles.tabButton,
                isSelected ? styles.tabButtonActive : styles.tabButtonInactive,
              ]}
            >
              <Text
                style={[
                  styles.tabButtonText,
                  isSelected
                    ? styles.tabButtonTextActive
                    : styles.tabButtonTextInactive,
                ]}
                numberOfLines={1}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Active Tab Panel */}
      <View style={styles.panelContent}>
        {active === 0 ? <ProductDetailsPanel specs={props.specs} /> : null}
        {active === 1 ? (
          <PriceBreakupPanel priceBreakup={props.priceBreakup} />
        ) : null}
        {active === 2 && props.hasRatings ? <ReviewPanel {...props} /> : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    marginTop: s(16),
    paddingHorizontal: s(16),
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: PDP_COLORS.tabInactiveBg,
    borderRadius: s(8),
    padding: s(3),
    gap: s(4),
  },
  tabButton: {
    flex: 1,
    paddingVertical: s(9),
    borderRadius: s(6),
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonActive: {
    backgroundColor: PDP_COLORS.tabActiveBg,
  },
  tabButtonInactive: {
    backgroundColor: 'transparent',
  },
  tabButtonText: {
    fontFamily: HOME_FONTS.lexendBold,
    fontSize: fs(10.5),
    letterSpacing: 0.5,
  },
  tabButtonTextActive: {
    color: PDP_COLORS.white,
  },
  tabButtonTextInactive: {
    color: '#4A6158',
  },
  panelContent: {
    paddingTop: s(14),
  },
  empty: {
    fontFamily: HOME_FONTS.lexend,
    fontSize: fs(12),
    color: PDP_COLORS.muted,
    paddingVertical: s(10),
  },

  // Details Cards
  detailsContainer: {
    gap: s(12),
  },
  cardRow: {
    flexDirection: 'row',
    gap: s(12),
  },
  cardHalf: {
    flex: 1,
    backgroundColor: PDP_COLORS.infoCardBg,
    borderWidth: 1,
    borderColor: PDP_COLORS.infoCardBorder,
    borderRadius: s(12),
    padding: s(14),
    position: 'relative',
    overflow: 'hidden',
    minHeight: s(100),
  },
  cardFull: {
    backgroundColor: PDP_COLORS.infoCardBg,
    borderWidth: 1,
    borderColor: PDP_COLORS.infoCardBorder,
    borderRadius: s(12),
    padding: s(14),
    position: 'relative',
    overflow: 'hidden',
  },
  cornerArc: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: s(50),
    height: s(50),
    borderBottomLeftRadius: s(38),
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: s(10),
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(5),
  },
  cardHeaderText: {
    fontFamily: HOME_FONTS.lexendBold,
    fontSize: fs(10),
    letterSpacing: 0.6,
    color: '#3B4843',
  },
  cardPrimaryVal: {
    fontFamily: HOME_FONTS.lexendBold,
    fontSize: fs(13.5),
    color: '#1A1A1A',
    marginBottom: s(3),
  },
  cardSubText: {
    fontFamily: HOME_FONTS.lexend,
    fontSize: fs(11),
    color: '#555555',
    marginBottom: s(2),
  },
  cardMetaText: {
    fontFamily: HOME_FONTS.lexend,
    fontSize: fs(10.5),
    color: '#777777',
  },
  cardFullBody: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  cardFullLeft: {
    flex: 1,
  },
  cardFullRight: {
    alignItems: 'flex-end',
    gap: s(2),
  },
  cardRightText: {
    fontFamily: HOME_FONTS.lexend,
    fontSize: fs(10.5),
    color: '#666666',
  },
  extraSpecs: {
    marginTop: s(10),
    paddingTop: s(10),
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#EBE6DF',
    gap: s(8),
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  specLabel: {
    fontFamily: HOME_FONTS.lexend,
    fontSize: fs(11.5),
    color: '#777777',
  },
  specValue: {
    fontFamily: HOME_FONTS.lexendMedium,
    fontSize: fs(11.5),
    color: '#1A1A1A',
  },

  // Breakup Panel
  breakupContainer: {
    backgroundColor: PDP_COLORS.infoCardBg,
    borderWidth: 1,
    borderColor: PDP_COLORS.infoCardBorder,
    borderRadius: s(12),
    padding: s(16),
    gap: s(10),
  },
  breakupRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakupLabel: {
    fontFamily: HOME_FONTS.lexend,
    fontSize: fs(12),
    color: '#555555',
  },
  breakupVal: {
    fontFamily: HOME_FONTS.lexendMedium,
    fontSize: fs(12.5),
    color: '#1A1A1A',
  },
  breakupStrike: {
    fontFamily: HOME_FONTS.lexend,
    fontSize: fs(12),
    color: '#8E8E8E',
    textDecorationLine: 'line-through',
  },
  breakupLabelSavings: {
    fontFamily: HOME_FONTS.lexendMedium,
    fontSize: fs(12),
    color: PDP_COLORS.savingsGreen,
  },
  breakupValSavings: {
    fontFamily: HOME_FONTS.lexendMedium,
    fontSize: fs(12),
    color: PDP_COLORS.savingsGreen,
  },
  breakupDivider: {
    height: 1,
    backgroundColor: '#E5DFD7',
    marginVertical: s(4),
  },
  breakupRowTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakupLabelTotal: {
    fontFamily: HOME_FONTS.lexendBold,
    fontSize: fs(13),
    color: '#1A1A1A',
  },
  breakupValTotal: {
    fontFamily: HOME_FONTS.lexendBold,
    fontSize: fs(14.5),
    color: PDP_COLORS.darkGreen,
  },

  // Review Panel
  reviewPanel: {
    paddingVertical: s(6),
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  average: {
    fontFamily: HOME_FONTS.lexendBold,
    fontSize: fs(32),
    lineHeight: fs(32) * 1.2,
    color: PDP_COLORS.black,
  },
  summaryRight: {
    alignItems: 'flex-end',
    gap: s(4),
  },
  ratingCount: {
    fontFamily: HOME_FONTS.lexend,
    fontSize: fs(11),
    color: PDP_COLORS.muted,
  },
  starsRow: {
    flexDirection: 'row',
    gap: s(5),
  },
  bars: {
    marginTop: s(14),
    gap: s(10),
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
  },
  barStar: {
    fontFamily: HOME_FONTS.lexend,
    fontSize: fs(12),
    color: PDP_COLORS.black,
    width: s(12),
  },
  barStarIcon: {
    width: s(16),
    height: s(16),
  },
  barTrack: {
    flex: 1,
    height: s(4),
    borderRadius: s(10),
    backgroundColor: '#EAEAEA',
    overflow: 'hidden',
  },
  barFill: {
    height: s(4),
    borderRadius: s(10),
    backgroundColor: PDP_COLORS.darkGreen,
  },
  barPercent: {
    fontFamily: HOME_FONTS.lexend,
    fontSize: fs(12),
    color: PDP_COLORS.black,
    width: s(36),
    textAlign: 'right',
  },
  reviewCount: {
    fontFamily: HOME_FONTS.lexendMedium,
    fontSize: fs(13),
    color: PDP_COLORS.black,
    marginTop: s(22),
  },
  reviewRow: {
    flexDirection: 'row',
    gap: s(12),
    marginTop: s(16),
  },
  avatar: {
    width: s(36),
    height: s(36),
    borderRadius: s(18),
    backgroundColor: PDP_COLORS.rule,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: HOME_FONTS.lexendBold,
    fontSize: fs(14),
    color: PDP_COLORS.white,
  },
  reviewBody: {
    flex: 1,
    gap: s(4),
  },
  reviewHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reviewName: {
    fontFamily: HOME_FONTS.lexendBold,
    fontSize: fs(13),
    color: PDP_COLORS.black,
  },
  reviewDate: {
    fontFamily: HOME_FONTS.lexend,
    fontSize: fs(11),
    color: PDP_COLORS.muted,
  },
  reviewText: {
    fontFamily: HOME_FONTS.lexend,
    fontSize: fs(11.5),
    lineHeight: fs(11.5) * 1.5,
    color: '#555555',
  },
  seeMore: {
    alignSelf: 'center',
    marginTop: s(20),
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
    height: s(34),
    paddingHorizontal: s(16),
    borderWidth: 1,
    borderColor: PDP_COLORS.cardBorder,
    borderRadius: s(8),
  },
  seeMoreText: {
    fontFamily: HOME_FONTS.lexendMedium,
    fontSize: fs(11.5),
    color: PDP_COLORS.black,
  },
});

export default ReviewTabs;
