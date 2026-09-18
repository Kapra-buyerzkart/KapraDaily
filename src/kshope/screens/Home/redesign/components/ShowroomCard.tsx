import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { KAPRA_ART } from '../kapraAssets';
import { HOME_FONTS, s, fs } from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GUTTER = s(16);

interface ShowroomCardProps {
  locationName?: string;
  onSelectLocation?: () => void;
  onFindStorePress?: () => void;
}

const ShowroomCard: React.FC<ShowroomCardProps> = ({
  locationName = 'Kochi',
  onSelectLocation,
  onFindStorePress,
}) => {
  return (
    <View style={styles.wrap}>
      <View style={styles.card}>
        {/* Left Side: Showroom Photo */}
        <View style={styles.leftColumn}>
          <Image
            source={KAPRA_ART.showRoomInterior}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        {/* Right Side: Details & Actions */}
        <View style={styles.rightColumn}>
          <Text style={styles.title}>Visit Our Showroom</Text>
          <Text style={styles.description}>
            Experience our finest collections in person. Get expert guidance from
            our jewellery specialists.
          </Text>

          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.locationPill}
              activeOpacity={0.8}
              onPress={onSelectLocation}
            >
              <Ionicons name="location-sharp" size={12} color="#0C382E" />
              <Text style={styles.locationText} numberOfLines={1}>
                {locationName}
              </Text>
              <Ionicons name="chevron-down" size={12} color="#767676" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.findStoreBtn}
              activeOpacity={0.85}
              onPress={onFindStorePress}
            >
              <Text style={styles.findStoreText}>Find a Store →</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: GUTTER,
    marginVertical: s(16),
  },
  card: {
    backgroundColor: '#FFFDF9',
    borderWidth: 1,
    borderColor: '#EFE8DE',
    borderRadius: s(12),
    overflow: 'hidden',
    flexDirection: 'row',
  },
  leftColumn: {
    width: '42%',
    minHeight: s(160),
  },
  image: {
    width: '100%',
    height: '100%',
  },
  rightColumn: {
    flex: 1,
    padding: s(12),
    justifyContent: 'center',
  },
  title: {
    fontSize: fs(17),
    fontFamily: HOME_FONTS.bold,
    color: '#1A1A1A',
    lineHeight: fs(20),
    marginBottom: s(4),
  },
  description: {
    fontSize: fs(8.5),
    fontFamily: HOME_FONTS.regular,
    color: '#666666',
    lineHeight: fs(12),
    marginBottom: s(12),
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: s(6),
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0EBE1',
    paddingVertical: s(5),
    paddingHorizontal: s(8),
    borderRadius: s(6),
    gap: s(3),
  },
  locationText: {
    fontSize: fs(10),
    fontFamily: HOME_FONTS.semiBold,
    color: '#1A1A1A',
  },
  findStoreBtn: {
    backgroundColor: '#0C382E',
    paddingVertical: s(6),
    paddingHorizontal: s(10),
    borderRadius: s(6),
  },
  findStoreText: {
    fontSize: fs(9.5),
    fontFamily: HOME_FONTS.bold,
    color: '#FFFFFF',
  },
});

export default ShowroomCard;
