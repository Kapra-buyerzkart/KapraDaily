import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ProfileAvatarBadge from '../../../components/ProfileAvatarBadge';
import { styles, ORANGE } from '../styles';

export default function ProfileUserInfo({
  profile,
  walletData,
  onEditProfile,
  onPressCoin,
}) {
  return (
    <View style={styles.userView}>
      <View style={styles.userAvatarContainer}>
        <ProfileAvatarBadge size={wp('13%')} isPrivileged={profile?.isPrivileged} />
      </View>
      <View style={styles.userNamePhoneView}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
          <Text style={styles.userNameText}>{profile.custName}</Text>
          <TouchableOpacity
            onPress={onEditProfile}
            style={{ marginLeft: wp('2%'), marginTop: hp('0.5%') }}
          >
            <MaterialIcons name="edit" size={wp('4%')} color={ORANGE} />
          </TouchableOpacity>
        </View>
        <Text style={styles.phoneNumberStyle}>{profile.phoneNo}</Text>
      </View>
      <TouchableOpacity onPress={onPressCoin} style={styles.tokenContainer}>
        <Image
          source={require('../../../assets/icons/udcoin.png')}
          style={{ width: wp('5%'), height: wp('5%') }}
          resizeMode="contain"
        />
        <Text style={styles.tokenText}>{walletData?.wallet?.bCoins || '0'}</Text>
      </TouchableOpacity>
    </View>
  );
}
