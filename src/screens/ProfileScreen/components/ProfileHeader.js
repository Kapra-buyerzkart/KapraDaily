import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { styles, INK } from '../styles';

export default function ProfileHeader({ onBack }) {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <AntDesign name={'arrowleft'} size={wp('4.5%')} color={INK} />
      </TouchableOpacity>
      <Text style={styles.profileHeaderText}>Profile</Text>
    </View>
  );
}
