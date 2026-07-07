import React from 'react';
import {
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import icons from '@/assets/icons';
import { styles } from '../styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type EditProfileHeaderProps = {
  onBack: () => void;
};

const EditProfileHeader = ({ onBack }: EditProfileHeaderProps) => {
  const insets = useSafeAreaInsets();
  return (
    <ImageBackground
      style={styles.backgroundImage}
      source={require('../../../assets/images/login_background_image.jpg')}
    >
      <View style={[styles.headerRow, { paddingTop: insets.top }]}>
        <TouchableOpacity hitSlop={40} onPress={onBack}>
          <Image source={icons.backArrowNew} style={styles.backArrow} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={styles.headerSpacer} />
      </View>
      <Image
        style={styles.kapraLogo}
        source={require('../../../assets/images/udendeal.png')}
      />
    </ImageBackground>
  );
};

export default EditProfileHeader;
