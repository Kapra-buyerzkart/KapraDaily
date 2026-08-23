import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { colors } from '../theme/colours';
import { fonts } from '../theme/typography';
import { Fonts } from '../theme/fonts';
import { AppIcons } from '../assets/icons';
import { useNavigation } from '@react-navigation/native';

interface HomeSearchBarProps {
  placeholder?: string;
  onPress?: () => void;
}

const HomeSearchBar: React.FC<HomeSearchBarProps> = ({
  placeholder = 'Search for Product...',
  onPress,
}) => {
  const navigation = useNavigation<any>();

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.searchBarContainer}
      onPress={onPress || (() => navigation.navigate('KshopeSearch' as never))}
    >
      <View style={styles.iconLeftContainer}>
        <AppIcons.Search color={colors.black} size={22} />
      </View>
      <View style={[styles.input, { justifyContent: 'center' }]}>
        <Text style={{ color: '#666', fontSize: 16 }}>{placeholder}</Text>
      </View>
      <View style={styles.micContainer}>
        <AppIcons.Microphone color={colors.black} size={22} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 24,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    height: 48,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 24,
    paddingHorizontal: 12,
    height: 45,
    width: wp('70%'),
  },
  kIcon: {
    width: 20,
    height: 17,
    resizeMode: 'contain',
  },
  iconLeftContainer: {
    marginRight: 8,
  },
  kIconText: {
    fontWeight: '800',
    fontSize: 20,
    color: '#F25000',
    fontFamily: fonts.h1.fontFamily,
  },
  input: {
    flex: 1,
    width: wp('60%'),
    fontFamily: Fonts.regular,
    fontSize: 16,
    color: colors.text,
    fontWeight: '400',
  },

  micContainer: {
    paddingLeft: 8,
  },
  micIconText: {
    fontSize: 12,
    color: colors.black,
  },
});

export default HomeSearchBar;
