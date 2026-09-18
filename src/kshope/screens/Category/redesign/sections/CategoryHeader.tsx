import React from 'react';
import {
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  HOME_COLORS,
  HOME_FONTS,
  RADIUS,
  fs,
  s,
} from '../../../Home/redesign/theme';
import { CATEGORY_ART } from '../categoryAssets';

type Props = {
  searchOpen: boolean;
  searchText: string;
  onToggleSearch: () => void;
  onChangeSearch: (text: string) => void;
  onClearSearch: () => void;
  onFilterPress?: () => void;
  filtersActive?: boolean;
  onWishlistPress?: () => void;
  onCartPress?: () => void;
  onBack?: () => void;
};

const CategoryHeader: React.FC<Props> = ({
  searchOpen,
  searchText,
  onToggleSearch,
  onChangeSearch,
  onClearSearch,
  onFilterPress,
  filtersActive,
  onWishlistPress,
  onCartPress,
  onBack,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingTop: insets.top + s(6) }]}>
      {/* Top Bar: Brand Lockup on Left, Action Icons on Right */}
      <View style={styles.topRow}>
        <View style={styles.brandRow}>
          {onBack ? (
            <TouchableOpacity
              testID="category-back-button"
              activeOpacity={0.7}
              onPress={onBack}
              style={styles.backButton}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="arrow-back" size={s(20)} color="#1A1A1A" />
            </TouchableOpacity>
          ) : null}

          <Image
            source={CATEGORY_ART.brandLogo}
            style={styles.brandLogo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            testID="category-search-toggle"
            activeOpacity={0.75}
            onPress={onToggleSearch}
            style={styles.iconButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name="search-outline"
              size={s(21)}
              color={searchOpen ? HOME_COLORS.darkEmerald : '#1A1A1A'}
            />
          </TouchableOpacity>

          {onFilterPress ? (
            <TouchableOpacity
              testID="category-filter-button"
              activeOpacity={0.75}
              onPress={onFilterPress}
              style={styles.iconButton}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons
                name="options-outline"
                size={s(20)}
                color={filtersActive ? HOME_COLORS.darkEmerald : '#1A1A1A'}
              />
              {filtersActive ? (
                <View testID="category-filter-dot" style={styles.filterDot} />
              ) : null}
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            testID="category-wishlist-button"
            activeOpacity={0.75}
            onPress={onWishlistPress}
            style={styles.iconButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="heart-outline" size={s(22)} color="#1A1A1A" />
          </TouchableOpacity>

          <TouchableOpacity
            testID="category-cart-button"
            activeOpacity={0.75}
            onPress={onCartPress}
            style={styles.iconButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="bag-outline" size={s(21)} color="#1A1A1A" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Expandable Search Input */}
      {searchOpen ? (
        <View style={styles.searchBar}>
          <Ionicons
            name="search-outline"
            size={s(16)}
            color="#8E8E8E"
            style={styles.searchIcon}
          />
          <TextInput
            testID="category-search-input"
            style={styles.searchInput}
            placeholder="Search jewellery, rings, gold..."
            placeholderTextColor="#8E8E8E"
            value={searchText}
            onChangeText={onChangeSearch}
            autoFocus
            returnKeyType="search"
            autoCorrect={false}
          />
          {searchText ? (
            <TouchableOpacity
              testID="category-search-clear"
              activeOpacity={0.7}
              onPress={onClearSearch}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={s(16)} color="#8E8E8E" />
            </TouchableOpacity>
          ) : null}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: s(16),
    paddingBottom: s(10),
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: s(40),
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: s(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandLogo: {
    width: s(120),
    height: s(50),
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(10),
  },
  iconButton: {
    width: s(32),
    height: s(32),
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  filterDot: {
    position: 'absolute',
    top: s(2),
    right: s(2),
    width: s(6),
    height: s(6),
    borderRadius: s(3),
    backgroundColor: '#0C382E',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: RADIUS.pill,
    paddingHorizontal: s(12),
    height: s(38),
    marginTop: s(8),
  },
  searchIcon: {
    marginRight: s(6),
  },
  searchInput: {
    flex: 1,
    fontFamily: HOME_FONTS.regular,
    fontSize: fs(13),
    color: '#1A1A1A',
    paddingVertical: 0,
  },
  clearButton: {
    padding: s(4),
  },
});

export default CategoryHeader;
