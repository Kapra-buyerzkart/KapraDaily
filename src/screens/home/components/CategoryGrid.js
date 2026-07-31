import React from 'react';
import { View, StyleSheet } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ShimmerPlaceholder from '../../../components/ShimmerPlaceholder';
import CategoryItem from './CategoryItem';
import SectionHeader from './SectionHeader';
import categoryChipStyles from './categoryChipStyles';
import { GUTTER, SPACE } from '../homeTheme';

export const CategoryShimmer = () => (
  <View style={styles.section}>
    <SectionHeader
      title="Shop by"
      titleAccent="category"
      subtitle="Everyday essentials, delivered in minutes"
      style={styles.header}
    />
    <View style={styles.categoriesContainer}>
      {[1, 2, 3, 4, 5, 6, 7, 8].map((_, i) => (
        <View key={i} style={categoryChipStyles.item}>
          {/* Reuses the real tile's box so the shimmer occupies exactly the
              grid's geometry and nothing shifts when categories arrive. */}
          <View style={categoryChipStyles.categoryItemContainer}>
            <ShimmerPlaceholder style={styles.shimmerFill} />
          </View>
          <ShimmerPlaceholder style={styles.shimmerLabel} />
        </View>
      ))}
    </View>
  </View>
);

const CategoryGrid = ({ categories }) => (
  <View style={styles.section}>
    <SectionHeader
      title="Shop by"
      titleAccent="category"
      subtitle="Everyday essentials, delivered in minutes"
      style={styles.header}
    />
    <View style={styles.categoriesContainer}>
      {categories.map((item, index) => (
        <CategoryItem
          key={(item.catId || item.id || index).toString()}
          item={item}
          index={index}
        />
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  // Flat section on the page — spacing and the header's type hierarchy do the
  // separating, not a surface change.
  section: {
    paddingBottom: SPACE.sm,
  },
  header: {
    paddingHorizontal: GUTTER,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // flex-start, not space-between: a final row with 2 or 3 tiles must stay
    // left-aligned under the rows above it rather than spreading to the edges.
    // The cells divide this box exactly (see categoryChipStyles), so the grid
    // lines up with the header's gutter instead of drifting left.
    justifyContent: 'flex-start',
    paddingHorizontal: GUTTER,
  },
  shimmerFill: {
    width: '100%',
    height: '100%',
  },
  shimmerLabel: {
    marginTop: hp('0.9%'),
    width: '64%',
    height: hp('1.4%'),
    borderRadius: 4,
  },
});

export default CategoryGrid;
