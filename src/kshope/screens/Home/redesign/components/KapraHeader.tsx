import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { KAPRA_ART } from '../kapraAssets';
import { HOME_COLORS, HOME_FONTS, s, fs } from '../theme';

interface KapraHeaderProps {
  address?: string | null;
  onSearchPress?: () => void;
  onWishlistPress?: () => void;
  onProfilePress?: () => void;
  onAddressPress?: () => void;
}

const KapraHeader: React.FC<KapraHeaderProps> = ({
  address,
  onSearchPress,
  onWishlistPress,
  onProfilePress,
  onAddressPress,
}) => {
  const insets = useSafeAreaInsets();

  const displayLocation = React.useMemo(() => {
    if (!address) return 'Kochi';
    const parts = address
      .split('·')
      .map(p => p.trim())
      .filter(Boolean);
    const primary = parts[parts.length - 1] || parts[0] || 'Kochi';
    const firstWord = primary.split(',')[0]?.trim() || 'Kochi';
    return firstWord.length > 12 ? `${firstWord.slice(0, 11)}…` : firstWord;
  }, [address]);

  return (
    <View style={[styles.container, { paddingTop: insets.top + 6 }]}>
      {/* Top Brand Lockup + Right Actions */}
      <View style={styles.topRow}>
        <Image
          source={KAPRA_ART.brandLogo}
          style={styles.brandLogo}
          resizeMode="contain"
        />

        <View style={styles.rightActions}>
          <TouchableOpacity
            style={styles.locationPill}
            activeOpacity={0.85}
            onPress={onAddressPress}
          >
            <Ionicons name="location-sharp" size={13} color="#FFFFFF" />
            <Text style={styles.locationText} numberOfLines={1}>
              {displayLocation}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            activeOpacity={0.75}
            onPress={onWishlistPress}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="heart-outline" size={22} color="#1A1A1A" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            activeOpacity={0.75}
            onPress={onProfilePress}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="person-outline" size={20} color="#1A1A1A" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <TouchableOpacity
        style={styles.searchBar}
        activeOpacity={0.9}
        onPress={onSearchPress}
      >
        <Ionicons
          name="search-outline"
          size={18}
          color="#8E8E8E"
          style={styles.searchIcon}
        />
        <Text style={styles.searchPlaceholder} numberOfLines={1}>
          Search rings, earrings, gold...
        </Text>
      </TouchableOpacity>

      {/* Trust Badges Strip */}
      <View style={styles.trustStrip}>
        <View style={styles.trustItem}>
          <Ionicons name="diamond-outline" size={18} color="#0C382E" />
          <View style={styles.trustTextCol}>
            <Text style={styles.trustTitle}>Certified Jewellery</Text>
            <Text style={styles.trustSubtitle}>Trusted Quality</Text>
          </View>
        </View>

        <View style={styles.stripDivider} />

        <View style={styles.trustItem}>
          <Ionicons name="bag-check-outline" size={18} color="#0C382E" />
          <View style={styles.trustTextCol}>
            <Text style={styles.trustTitle}>Secure Shopping</Text>
            <Text style={styles.trustSubtitle}>100% safe and secure</Text>
          </View>
        </View>

        <View style={styles.stripDivider} />

        <View style={styles.trustItem}>
          <Ionicons name="headset-outline" size={18} color="#0C382E" />
          <View style={styles.trustTextCol}>
            <Text style={styles.trustTitle}>Easy Support</Text>
            <Text style={styles.trustSubtitle}>We're here for you</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: s(16),
    paddingBottom: s(10),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F0EBE1',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: s(12),
  },
  brandLogo: {
    width: s(120),
    height: s(50),
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(10),
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0C382E',
    paddingVertical: s(5),
    paddingHorizontal: s(10),
    borderRadius: s(16),
    gap: s(4),
  },
  locationText: {
    color: '#FFFFFF',
    fontSize: fs(11),
    fontFamily: HOME_FONTS.lexendMedium || HOME_FONTS.semiBold,
  },
  iconButton: {
    width: s(32),
    height: s(32),
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E3DC',
    borderRadius: s(24),
    paddingHorizontal: s(14),
    paddingVertical: Platform.OS === 'ios' ? s(9) : s(7),
    marginBottom: s(12),
  },
  searchIcon: {
    marginRight: s(8),
  },
  searchPlaceholder: {
    fontSize: fs(12.5),
    color: '#8E8E8E',
    fontFamily: HOME_FONTS.regular,
    flex: 1,
  },
  trustStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: s(4),
    paddingBottom: s(2),
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    gap: s(6),
  },
  trustTextCol: {
    flexShrink: 1,
  },
  trustTitle: {
    fontSize: fs(9.5),
    fontFamily: HOME_FONTS.bold,
    color: '#1A1A1A',
  },
  trustSubtitle: {
    fontSize: fs(7.8),
    fontFamily: HOME_FONTS.regular,
    color: '#767676',
  },
  stripDivider: {
    width: 1,
    height: s(20),
    backgroundColor: '#767676',
    marginHorizontal: s(4),
  },
});

export default KapraHeader;
