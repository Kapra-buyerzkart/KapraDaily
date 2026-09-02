import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppIcons } from '../../../../assets/icons';
import {
  GUTTER,
  HOME_COLORS,
  HOME_FONTS,
  RADIUS,
  SPACE,
  fs,
  s,
} from '../../../Home/redesign/theme';

const SURFACE = {
  page: '#FFFFFF',
  control: '#F4F4F5',
  controlPressed: '#ECECEE',
  field: '#F4F4F5',
  ink: '#141414',
  inkMuted: '#7A7A7F',
  hairline: '#EDEDF0',
};

const CONTROL = s(38);

type IconButtonProps = {
  testID: string;
  onPress: () => void;
  active?: boolean;
  children: React.ReactNode;
  style?: object;
};

const IconButton: React.FC<IconButtonProps> = ({
  testID,
  onPress,
  active,
  children,
  style,
}) => (
  <TouchableOpacity
    testID={testID}
    activeOpacity={0.7}
    onPress={onPress}
    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    style={[styles.control, active && styles.controlActive, style]}
  >
    {children}
  </TouchableOpacity>
);

type Props = {
  title: string;
  subtitle?: string;
  searchOpen: boolean;
  searchText: string;
  onToggleSearch: () => void;
  onChangeSearch: (text: string) => void;
  onClearSearch: () => void;
  onFilterPress: () => void;
  onBack?: () => void;
  filtersActive?: boolean;
};

const CategoryHeader: React.FC<Props> = ({
  title,
  subtitle,
  searchOpen,
  searchText,
  onToggleSearch,
  onChangeSearch,
  onClearSearch,
  onFilterPress,
  onBack,
  filtersActive,
}) => {
  const { top } = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingTop: top + SPACE.sm }]}>
      <View style={styles.row}>
        {onBack ? (
          <IconButton testID="category-back-button" onPress={onBack}>
            <AppIcons.Back size={s(20)} color={SURFACE.ink} />
          </IconButton>
        ) : null}

        <View style={styles.titleBlock}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>

        <IconButton
          testID="category-search-toggle"
          onPress={onToggleSearch}
          active={searchOpen}
        >
          <AppIcons.Search size={s(19)} color={SURFACE.ink} />
        </IconButton>

        <IconButton
          testID="category-filter-button"
          onPress={onFilterPress}
          active={filtersActive}
          style={styles.controlGap}
        >
          <AppIcons.Filter size={s(19)} color={SURFACE.ink} />
          {filtersActive ? (
            <View testID="category-filter-dot" style={styles.dot} />
          ) : null}
        </IconButton>
      </View>

      {searchOpen ? (
        <View style={styles.field}>
          <AppIcons.Search size={s(17)} color={SURFACE.inkMuted} />
          <TextInput
            testID="category-search-input"
            style={styles.input}
            placeholder={`Search in ${title || 'products'}`}
            placeholderTextColor={SURFACE.inkMuted}
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
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={styles.clear}
            >
              <AppIcons.Close size={s(11)} color={HOME_COLORS.white} />
            </TouchableOpacity>
          ) : null}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: GUTTER,
    paddingBottom: SPACE.md,
    backgroundColor: SURFACE.page,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: SURFACE.hairline,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleBlock: {
    flex: 1,
    paddingHorizontal: SPACE.md,
  },
  title: {
    fontFamily: HOME_FONTS.semiBold,
    fontSize: fs(18),
    lineHeight: fs(18) * 1.25,
    letterSpacing: -0.2,
    color: SURFACE.ink,
  },
  subtitle: {
    fontFamily: HOME_FONTS.regular,
    fontSize: fs(11),
    lineHeight: fs(11) * 1.4,
    color: SURFACE.inkMuted,
    marginTop: SPACE.xxs / 2,
  },
  control: {
    width: CONTROL,
    height: CONTROL,
    borderRadius: RADIUS.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SURFACE.control,
  },
  controlActive: {
    backgroundColor: SURFACE.controlPressed,
  },
  controlGap: {
    marginLeft: SPACE.sm,
  },
  dot: {
    position: 'absolute',
    top: s(7),
    right: s(7),
    width: s(7),
    height: s(7),
    borderRadius: RADIUS.pill,
    borderWidth: s(1.5),
    borderColor: SURFACE.control,
    backgroundColor: HOME_COLORS.orange,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACE.md,
    paddingHorizontal: SPACE.lg,
    height: s(44),
    borderRadius: RADIUS.md,
    backgroundColor: SURFACE.field,
    gap: SPACE.sm,
  },
  input: {
    flex: 1,
    padding: 0,
    fontFamily: HOME_FONTS.regular,
    fontSize: fs(13),
    color: SURFACE.ink,
  },
  clear: {
    width: s(18),
    height: s(18),
    borderRadius: RADIUS.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SURFACE.inkMuted,
  },
});

export default CategoryHeader;
