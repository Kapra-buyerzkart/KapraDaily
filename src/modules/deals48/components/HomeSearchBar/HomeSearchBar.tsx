import React from 'react';
import { View, TouchableOpacity, Text, Image } from 'react-native';
import { styles } from './styles';
import { colors } from '../../assets/theme/colours';
import { AppIcons } from '../../assets/icons';
import { useNavigation } from '@react-navigation/native';
import { DEALS48_ROUTES } from '../../navigation/routes';

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
      onPress={onPress || (() => navigation.navigate(DEALS48_ROUTES.SEARCH))}
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

export default HomeSearchBar;
