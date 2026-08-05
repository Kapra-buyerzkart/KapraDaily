import React from 'react';
import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import Animated from 'react-native-reanimated';
import Feather from 'react-native-vector-icons/Feather';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import icons from '@/assets/icons';
import { ACCENT, INK, MAX_FONT_SCALE, hitSlopTo } from '@/styles/homeTheme';
import styles from '../SearchScreen.styles';

// The screen's whole chrome: the title row and the field, as one block.
//
// They used to be two siblings with their own margins, and only the field
// carried the scroll treatment — a black drop shadow under a bar that had no
// page edge of its own. The theme is a flat white sheet (see homeTheme), so the
// block is separated from the list the way Profile and Edit Profile separate
// theirs: a hairline at its bottom edge that only exists once there is content
// scrolled underneath it. `ruleStyle` is that fade.
//
// The field is the same object the user pressed on Home to get here, so it
// keeps that bar's geometry — ~20pt corners, a glyph on the left and the
// clipboard on the right — and differs only where it has to: it is a live input
// on a white page, so it sits in the sunken surface rather than floating white
// on artwork.
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
        <Feather name="search" size={20} color={ACCENT.primary} />
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
