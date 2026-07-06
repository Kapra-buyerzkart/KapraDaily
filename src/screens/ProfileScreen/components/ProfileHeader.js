import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';
import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import icons from '@/assets/icons';
import images from '@/assets/images';
import ProfileAvatarBadge from '../../../components/ProfileAvatarBadge';
import { styles, INK } from '../styles';

export default function ProfileHeader({ onBack, onEditProfile, isPrivileged }) {
  return (
    <ImageBackground
      source={icons.blurbg}
      style={styles.header}
      imageStyle={styles.headerImage}
    >
      <View style={styles.headerTopRow}>
        <TouchableOpacity
          hitSlop={40}
          style={styles.backButton}
          onPress={onBack}
          accessibilityLabel="Go back"
        >
          <Image
            source={icons.backArrowNew}
            style={{
              resizeMode: 'contain',
              tintColor: INK,
            }}
          />
        </TouchableOpacity>
        <Text style={styles.profileHeaderText}>Profile</Text>
      </View>

      <View style={styles.avatarWrapper}>
        <View style={styles.avatarInner}>
          <ProfileAvatarBadge size={wp('23%')} isPrivileged={isPrivileged} />
          <TouchableOpacity
            onPress={onEditProfile}
            style={styles.avatarEditBadge}
            hitSlop={12}
            accessibilityLabel="Edit profile"
          >
            <MaterialIcons name="edit" size={wp('3.4%')} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}
