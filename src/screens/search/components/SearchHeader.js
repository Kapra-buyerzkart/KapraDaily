import React from 'react';
import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import Animated from 'react-native-reanimated';
import Feather from 'react-native-vector-icons/Feather';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import icons from '@/assets/icons';
import { ACCENT, INK, MAX_FONT_SCALE, hitSlopTo } from '@/styles/homeTheme';
import styles from '../SearchScreen.styles';

const HIT_SLOP_BACK = hitSlopTo(wp('6%'));
const HIT_SLOP_GLYPH = hitSlopTo(20);
const HIT_SLOP_CLEAR = hitSlopTo(22);

const SearchHeader = ({
  title,
  searchTerm,
  onChangeText,
  onSubmit,
  onClear,
  onBack,
  onFilter,
  ruleStyle,
}) => (
  <Animated.View style={styles.header}>
    <View style={styles.headerRow}>
      <TouchableOpacity
        hitSlop={HIT_SLOP_BACK}
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Image source={icons.backArrowNew} style={styles.backIcon} />
      </TouchableOpacity>

      <View style={styles.headerTitleSlot}>
        <Text
          style={styles.headerTitle}
          numberOfLines={1}
          maxFontSizeMultiplier={MAX_FONT_SCALE}
          accessibilityRole="header"
        >
          {title}
        </Text>
      </View>

      <TouchableOpacity
        onPress={onFilter}
        style={styles.filterButton}
        activeOpacity={0.75}
        accessibilityRole="button"
        accessibilityLabel="Filter and sort"
      >
        <Image source={icons.filter} style={styles.filterIcon} />
      </TouchableOpacity>
    </View>

    <View style={styles.searchField}>
      <TouchableOpacity
        hitSlop={HIT_SLOP_GLYPH}
        onPress={() => onSubmit()}
        accessibilityRole="button"
        accessibilityLabel="Search"
      >
        <Feather name="search" size={20} color={ACCENT.secondary} />
      </TouchableOpacity>

      <TextInput
        placeholder="Search for products"
        placeholderTextColor={INK.muted}
        style={styles.searchInput}
        value={searchTerm}
        onChangeText={onChangeText}
        autoFocus={true}
        returnKeyType="search"
        onSubmitEditing={() => onSubmit()}
        maxFontSizeMultiplier={MAX_FONT_SCALE}
        accessibilityLabel="Search for products"
      />

      {searchTerm.length > 0 && (
        <TouchableOpacity
          onPress={onClear}
          hitSlop={HIT_SLOP_CLEAR}
          style={styles.clearButton}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
        >
          <Feather name="x" size={13} color={INK.base} />
        </TouchableOpacity>
      )}

      <View style={styles.fieldRule} />
      <Feather
        name="clipboard"
        color={INK.muted}
        size={18}
        style={styles.clipboardIcon}
      />
    </View>

    <Animated.View
      pointerEvents="none"
      style={[styles.headerRule, ruleStyle]}
    />
  </Animated.View>
);

export default SearchHeader;
