import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { HOME_ART } from '../assets';
import {
  CATEGORY_TABS,
  HEADER_CIRCLES,
  HEADER_CONTENT,
} from '../content';
import { HOME_COLORS, HOME_FONTS, fs, s } from '../theme';

type Props = {
  topInset: number;
  activeTab: string;
  onTabPress: (tab: string) => void;
  onSearchPress?: () => void;
  onProfilePress?: () => void;
  onCirclePress?: (id: string) => void;
};

const HeroHeader: React.FC<Props> = ({
  topInset,
  activeTab,
  onTabPress,
  onSearchPress,
  onProfilePress,
  onCirclePress,
}) => (
  <View style={[styles.wrap, { paddingTop: topInset + s(25) }]}>
    <View style={styles.topRow}>
      <View style={styles.topRowText}>
        <Text style={styles.title}>{HEADER_CONTENT.title}</Text>
        <Text style={styles.address} numberOfLines={2}>
          {HEADER_CONTENT.address}
        </Text>
      </View>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onProfilePress}
        style={styles.avatar}
      />
    </View>

    <View style={styles.searchRow}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onSearchPress}
        style={styles.searchField}
      >
        <Image
          source={HOME_ART.iconSearch}
          resizeMode="contain"
          style={styles.searchIcon}
        />
        <Text style={styles.searchPlaceholder} numberOfLines={1}>
          {HEADER_CONTENT.searchPlaceholder}
        </Text>
        <View style={styles.searchDivider} />
        <Image
          source={HOME_ART.iconMic}
          resizeMode="contain"
          style={styles.micIcon}
        />
      </TouchableOpacity>

      <View style={styles.headerIcons}>
        <Image
          source={HOME_ART.iconHeader1}
          resizeMode="contain"
          style={styles.headerIcon1}
        />
        <Image
          source={HOME_ART.iconHeader2}
          resizeMode="contain"
          style={styles.headerIcon2}
        />
        <Image
          source={HOME_ART.iconHeader3}
          resizeMode="contain"
          style={styles.headerIcon3}
        />
      </View>
    </View>

    <View style={styles.tabsBlock}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsContent}
      >
        {CATEGORY_TABS.map(tab => {
          const isActive = tab === activeTab;
          return (
            <TouchableOpacity
              key={tab}
              activeOpacity={0.8}
              onPress={() => onTabPress(tab)}
              style={[styles.tab, isActive && styles.tabActive]}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <View style={styles.tabRule} />
    </View>

    <View style={styles.circlesRow}>
      {HEADER_CIRCLES.map(item => (
        <TouchableOpacity
          key={item.id}
          activeOpacity={0.85}
          onPress={() => onCirclePress?.(item.id)}
          style={styles.circleItem}
        >
          <View style={styles.circle}>
            <Image
              source={item.image}
              resizeMode="cover"
              style={styles.circleImage}
            />
          </View>
          <Text style={styles.circleLabel} numberOfLines={1}>
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>

    <Image
      source={HOME_ART.bannerOnam}
      resizeMode="cover"
      style={styles.onamBanner}
    />
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: HOME_COLORS.headerBlue,
    borderBottomLeftRadius: s(10),
    borderBottomRightRadius: s(10),
    paddingBottom: s(14),
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: s(19),
  },
  topRowText: {
    flex: 1,
    paddingRight: s(12),
  },
  title: {
    fontFamily: HOME_FONTS.semiBold,
    fontSize: fs(16),
    lineHeight: fs(16) * 1.35,
    color: HOME_COLORS.white,
  },
  address: {
    fontFamily: HOME_FONTS.regular,
    fontSize: fs(10),
    lineHeight: fs(10) * 1.4,
    color: HOME_COLORS.white,
    marginTop: s(4),
  },
  avatar: {
    width: s(35),
    height: s(35),
    borderRadius: s(17.5),
    backgroundColor: HOME_COLORS.searchField,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(19),
    marginTop: s(14),
  },
  searchField: {
    flex: 1,
    height: s(35),
    borderRadius: s(10),
    backgroundColor: HOME_COLORS.searchField,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(10),
  },
  searchIcon: {
    width: s(16),
    height: s(16),
  },
  searchPlaceholder: {
    flex: 1,
    fontFamily: HOME_FONTS.regular,
    fontSize: fs(10),
    color: HOME_COLORS.placeholder,
    marginLeft: s(11),
  },
  searchDivider: {
    width: StyleSheet.hairlineWidth,
    height: s(24),
    backgroundColor: HOME_COLORS.searchDivider,
    marginRight: s(11),
  },
  micIcon: {
    width: s(24),
    height: s(24),
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: s(14),
  },
  headerIcon1: {
    width: s(28),
    height: s(26),
  },
  headerIcon2: {
    width: s(32),
    height: s(23),
    marginLeft: s(13),
  },
  headerIcon3: {
    width: s(20),
    height: s(21),
    marginLeft: s(13),
  },
  tabsBlock: {
    marginTop: s(28),
  },
  tabsContent: {
    paddingHorizontal: s(19),
    alignItems: 'flex-end',
  },
  tab: {
    paddingHorizontal: s(12),
    paddingBottom: s(8),
    justifyContent: 'flex-end',
  },
  tabActive: {
    borderTopLeftRadius: s(11),
    borderTopRightRadius: s(11),
    borderColor: HOME_COLORS.tabRule,
    borderWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: 0,
    paddingTop: s(6),
  },
  tabText: {
    fontFamily: HOME_FONTS.regular,
    fontSize: fs(12),
    color: HOME_COLORS.white,
  },
  tabTextActive: {
    fontFamily: HOME_FONTS.medium,
    fontSize: fs(13),
  },
  tabRule: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: HOME_COLORS.tabRule,
  },
  circlesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: s(19),
    marginTop: s(10),
  },
  circleItem: {
    alignItems: 'center',
    width: s(96),
  },
  circle: {
    width: s(52),
    height: s(52),
    borderRadius: s(26),
    backgroundColor: HOME_COLORS.white,
    overflow: 'hidden',
  },
  circleImage: {
    width: '100%',
    height: '100%',
  },
  circleLabel: {
    fontFamily: HOME_FONTS.regular,
    fontSize: fs(10),
    lineHeight: fs(10) * 1.4,
    color: HOME_COLORS.white,
    marginTop: s(5),
    textAlign: 'center',
  },
  onamBanner: {
    width: '100%',
    height: s(141),
    marginTop: s(8),
  },
});

export default HeroHeader;
