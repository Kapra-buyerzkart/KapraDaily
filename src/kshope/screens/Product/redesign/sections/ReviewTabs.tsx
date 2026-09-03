import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { HOME_FONTS, fs, s } from '../../../Home/redesign/theme';
import { PDP_ART } from '../assets';
import { ChevronIcon } from '../icons';
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
  warranty: string;
};

const TABS = ['Review', 'Specifications'];
// const TABS = ['Review', 'Specifications', 'Warranty'];

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
    <View>
      <View style={styles.summaryRow}>
        <Text style={styles.average}>{average}</Text>
        <View style={styles.summaryRight}>
          <Text style={styles.ratingCount}>{`${total} Ratings`}</Text>
          <Stars count={Math.round(Number(average))} size={20} />
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
              <View
                style={[styles.barFill, { width: `${bar.percent}%` }]}
              />
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

const SpecPanel: React.FC<{ specs: Spec[] }> = ({ specs }) => {
  if (specs.length === 0) {
    return <Text style={styles.empty}>No specifications available.</Text>;
  }

  return (
    <View style={styles.specs}>
      {specs.map(spec => (
        <View key={spec.id} style={styles.specRow}>
          <Text style={styles.specLabel}>{spec.label}</Text>
          <Text style={styles.specValue}>{spec.value}</Text>
        </View>
      ))}
    </View>
  );
};

const ReviewTabs: React.FC<Props> = props => {
  const [active, setActive] = useState(0);

  return (
    <View style={styles.wrap}>
      <View style={styles.tabRow}>
        {TABS.map((tab, index) => (
          <TouchableOpacity
            key={tab}
            activeOpacity={0.8}
            onPress={() => setActive(index)}
            style={styles.tab}
          >
            <Text
              style={[styles.tabText, active === index && styles.tabTextActive]}
            >
              {tab}
            </Text>
            <View
              style={[
                styles.tabBar,
                active === index && styles.tabBarActive,
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.panel}>
        {active === 0 ? <ReviewPanel {...props} /> : null}
        {active === 1 ? <SpecPanel specs={props.specs} /> : null}
        {/* {active === 2 ? (
          <Text style={styles.warranty}>{props.warranty}</Text>
        ) : null} */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    marginTop: s(28),
  },
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: s(11),
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  tabText: {
    fontFamily: HOME_FONTS.regular,
    fontSize: fs(14),
    lineHeight: fs(14) * 1.3,
    color: PDP_COLORS.black,
  },
  tabTextActive: {
    fontFamily: HOME_FONTS.medium,
  },
  tabBar: {
    marginTop: s(9),
    height: s(4),
    width: s(80),
    borderRadius: s(20),
    backgroundColor: 'transparent',
  },
  tabBarActive: {
    backgroundColor: PDP_COLORS.orange,
  },
  panel: {
    paddingHorizontal: s(26),
    paddingTop: s(24),
  },
  empty: {
    fontFamily: HOME_FONTS.regular,
    fontSize: fs(12),
    lineHeight: fs(12) * 1.4,
    color: PDP_COLORS.muted,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  average: {
    fontFamily: HOME_FONTS.medium,
    fontSize: fs(36),
    lineHeight: fs(36) * 1.2,
    color: PDP_COLORS.black,
  },
  summaryRight: {
    alignItems: 'flex-end',
    gap: s(6),
  },
  ratingCount: {
    fontFamily: HOME_FONTS.regular,
    fontSize: fs(12),
    color: PDP_COLORS.muted,
  },
  starsRow: {
    flexDirection: 'row',
    gap: s(7),
  },
  bars: {
    marginTop: s(18),
    gap: s(14),
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
  },
  barStar: {
    fontFamily: HOME_FONTS.regular,
    fontSize: fs(14),
    color: PDP_COLORS.black,
    width: s(12),
  },
  barStarIcon: {
    width: s(20),
    height: s(20),
  },
  barTrack: {
    flex: 1,
    height: s(5),
    borderRadius: s(20),
    overflow: 'hidden',
  },
  barFill: {
    height: s(5),
    borderRadius: s(20),
    backgroundColor: PDP_COLORS.black,
  },
  barPercent: {
    fontFamily: HOME_FONTS.regular,
    fontSize: fs(14),
    color: PDP_COLORS.black,
    width: s(38),
    textAlign: 'right',
  },
  reviewCount: {
    fontFamily: HOME_FONTS.regular,
    fontSize: fs(14),
    color: PDP_COLORS.black,
    marginTop: s(30),
  },
  reviewRow: {
    flexDirection: 'row',
    gap: s(12),
    marginTop: s(20),
  },
  avatar: {
    width: s(43),
    height: s(43),
    borderRadius: s(43) / 2,
    backgroundColor: PDP_COLORS.rule,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: HOME_FONTS.medium,
    fontSize: fs(16),
    color: PDP_COLORS.white,
  },
  reviewBody: {
    flex: 1,
    gap: s(5),
  },
  reviewHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reviewName: {
    fontFamily: HOME_FONTS.medium,
    fontSize: fs(14),
    color: PDP_COLORS.black,
  },
  reviewDate: {
    fontFamily: HOME_FONTS.regular,
    fontSize: fs(12),
    color: PDP_COLORS.muted,
  },
  reviewText: {
    fontFamily: HOME_FONTS.regular,
    fontSize: fs(12),
    lineHeight: fs(12) * 1.5,
    color: PDP_COLORS.muted,
  },
  seeMore: {
    alignSelf: 'center',
    marginTop: s(28),
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(10),
    height: s(36),
    paddingHorizontal: s(17),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: PDP_COLORS.cardBorder,
    borderRadius: s(10),
  },
  seeMoreText: {
    fontFamily: HOME_FONTS.regular,
    fontSize: fs(12),
    color: PDP_COLORS.black,
  },
  specs: {
    gap: s(12),
  },
  specRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: s(16),
  },
  specLabel: {
    flex: 1,
    fontFamily: HOME_FONTS.regular,
    fontSize: fs(12),
    lineHeight: fs(12) * 1.4,
    color: PDP_COLORS.muted,
  },
  specValue: {
    flex: 1,
    fontFamily: HOME_FONTS.medium,
    fontSize: fs(12),
    lineHeight: fs(12) * 1.4,
    color: PDP_COLORS.black,
    textAlign: 'right',
  },
  warranty: {
    fontFamily: HOME_FONTS.regular,
    fontSize: fs(12),
    lineHeight: fs(12) * 1.5,
    color: PDP_COLORS.muted,
  },
});

export default ReviewTabs;
