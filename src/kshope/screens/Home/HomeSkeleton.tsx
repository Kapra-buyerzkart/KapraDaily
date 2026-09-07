import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Shimmer } from '../../components/atoms';
import { HEADER_BG } from '../../components/HomeHeader';
import { UI_COLORS, UI_RADIUS, UI_SPACING } from '../../theme/tokens';
import { colors } from '../../theme/colours';

const HEADER_ITEMS = [0, 1, 2, 3, 4];
const TABS = [64, 88, 72, 96];
const CARDS = [0, 1, 2, 3];
const GRID = [0, 1, 2, 3];

const HeaderSkeleton: React.FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
      <View style={styles.titleRow}>
        <View style={styles.titleBlock}>
          <Shimmer tone="dark" width={132} height={26} radius={UI_RADIUS.xs} />
          <Shimmer
            tone="dark"
            width={186}
            height={13}
            radius={UI_RADIUS.xs}
            style={styles.address}
          />
        </View>
        <Shimmer tone="dark" width={44} height={44} radius={22} />
      </View>

      <View style={styles.searchRow}>
        <Shimmer height={42} radius={10} style={styles.searchBar} />
        {[0, 1, 2].map(i => (
          <Shimmer
            key={i}
            tone="dark"
            width={23}
            height={23}
            radius={6}
            style={styles.headerIcon}
          />
        ))}
      </View>

      <View style={styles.tabsSection}>
        <View style={styles.tabsBaseline} />
        <View style={styles.tabsRow}>
          {TABS.map((width, i) => (
            <Shimmer
              key={i}
              tone="dark"
              width={width}
              height={15}
              radius={UI_RADIUS.xs}
              style={styles.tabLabel}
            />
          ))}
        </View>
      </View>

      <View style={styles.panel}>
        <View style={styles.itemsRow}>
          {HEADER_ITEMS.map(i => (
            <View key={i} style={styles.item}>
              <Shimmer width={62} height={62} radius={31} />
              <Shimmer
                width={58}
                height={12}
                radius={UI_RADIUS.xs}
                style={styles.itemLabel}
              />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const HomeSkeleton: React.FC = () => (
  <View style={styles.container}>
    <HeaderSkeleton />
    <ScrollView
      showsVerticalScrollIndicator={false}
      scrollEnabled={false}
      contentContainerStyle={styles.body}
    >
      <Shimmer height={168} radius={UI_RADIUS.card} style={styles.banner} />

      <View style={styles.sectionHeading}>
        <Shimmer width={152} height={18} radius={UI_RADIUS.xs} />
        <Shimmer width={64} height={14} radius={UI_RADIUS.xs} />
      </View>
      <View style={styles.cardRow}>
        {CARDS.map(i => (
          <View key={i} style={styles.card}>
            <Shimmer height={124} radius={UI_RADIUS.productCard} />
            <Shimmer height={13} radius={UI_RADIUS.xs} style={styles.line} />
            <Shimmer
              width="60%"
              height={13}
              radius={UI_RADIUS.xs}
              style={styles.line}
            />
          </View>
        ))}
      </View>

      <Shimmer height={120} radius={UI_RADIUS.card} style={styles.banner} />

      <View style={styles.sectionHeading}>
        <Shimmer width={128} height={18} radius={UI_RADIUS.xs} />
      </View>
      <View style={styles.grid}>
        {GRID.map(i => (
          <View key={i} style={styles.gridCell}>
            <Shimmer height={150} radius={UI_RADIUS.productCard} />
            <Shimmer height={13} radius={UI_RADIUS.xs} style={styles.line} />
            <Shimmer
              width="45%"
              height={13}
              radius={UI_RADIUS.xs}
              style={styles.line}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: UI_COLORS.canvas },
  header: { backgroundColor: HEADER_BG },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  titleBlock: { flex: 1, paddingRight: 12 },
  address: { marginTop: 6 },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginTop: 16,
  },
  searchBar: { flex: 1 },
  headerIcon: { marginLeft: 16 },
  tabsSection: { marginTop: 26, justifyContent: 'flex-end' },
  tabsBaseline: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 1.5,
    backgroundColor: colors.white,
  },
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    paddingHorizontal: 30,
  },
  tabLabel: { marginHorizontal: 20 },
  panel: { backgroundColor: HEADER_BG },
  itemsRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingTop: 14,
    paddingBottom: 10,
  },
  item: { width: 92, alignItems: 'center' },
  itemLabel: { marginTop: 8 },
  body: { padding: UI_SPACING.lg },
  banner: { marginBottom: UI_SPACING.xl },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: UI_SPACING.md,
  },
  cardRow: { flexDirection: 'row', marginBottom: UI_SPACING.xl },
  card: { width: 132, marginRight: UI_SPACING.md },
  line: { marginTop: UI_SPACING.sm },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6 },
  gridCell: { width: '50%', paddingHorizontal: 6, marginBottom: UI_SPACING.lg },
});

export default HomeSkeleton;
