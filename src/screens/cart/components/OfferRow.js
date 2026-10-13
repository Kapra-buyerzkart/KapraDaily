import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import { FONTS } from '@/styles/typography';
import { wp, hp } from '../../../styles/cartTheme';

const OfferRow = ({
  iconName,
  imageSource,
  title,
  appliedLabel,
  appliedSubtitle,
  subtitle,
  isApplied,
  onPress,
  onRemove,
  removeLabel = 'Remove',
}) => {
  const Wrapper = isApplied ? View : TouchableOpacity;
  const wrapperProps = isApplied
    ? {}
    : { activeOpacity: 0.75, onPress, accessibilityRole: 'button' };

  return (
    <Wrapper style={styles.row} {...wrapperProps}>
      <View style={styles.iconWrap}>
        {imageSource ? (
          <Image source={imageSource} style={styles.iconImage} />
        ) : (
          <MaterialCommunityIcons
            name={iconName || 'ticket-percent-outline'}
            size={wp('6%')}
            color="#FF6200"
          />
        )}
      </View>

      <View style={styles.details}>
        <Text style={styles.title}>{title}</Text>
        {isApplied ? (
          <View style={styles.appliedRow}>
            {appliedLabel ? (
              <View style={styles.labelBadge}>
                <Text style={styles.labelBadgeText}>{appliedLabel}</Text>
              </View>
            ) : null}
            <View style={styles.appliedBadge}>
              <Text style={styles.appliedBadgeText}>
                {appliedSubtitle || 'Applied'}
              </Text>
            </View>
          </View>
        ) : (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>

      {isApplied ? (
        <TouchableOpacity
          activeOpacity={0.75}
          style={styles.removeButton}
          onPress={onRemove}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <MaterialCommunityIcons name="close" size={14} color="#EF4444" />
          <Text style={styles.removeText}>{removeLabel}</Text>
        </TouchableOpacity>
      ) : (
        <Feather name="chevron-right" size={18} color="#9CA3AF" />
      )}
    </Wrapper>
  );
};

export default React.memo(OfferRow);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('3.5%'),
    paddingVertical: hp('1.4%'),
    paddingHorizontal: wp('4%'),
    backgroundColor: '#FFFFFF',
  },
  iconWrap: {
    width: wp('10%'),
    height: wp('10%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconImage: {
    width: wp('8%'),
    height: wp('8%'),
    resizeMode: 'contain',
  },
  details: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('3.7%'),
    color: '#000000',
  },
  subtitle: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3%'),
    color: '#71717A',
  },
  appliedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
    marginTop: 2,
  },
  labelBadge: {
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  labelBadgeText: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('2.8%'),
    color: '#374151',
  },
  appliedBadge: {
    backgroundColor: '#DCFCE7',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  appliedBadgeText: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('2.8%'),
    color: '#16A34A',
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    backgroundColor: '#FEF2F2',
  },
  removeText: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('2.8%'),
    color: '#EF4444',
  },
});
