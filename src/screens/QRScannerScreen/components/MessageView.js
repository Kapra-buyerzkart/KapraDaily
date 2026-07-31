import React from 'react';
import { StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import COLORS from '@/styles/colors';
import { styles } from '../styles';
import BrandLockup from './BrandLockup';

const MessageView = ({ header, title, message, actionLabel, onAction }) => (
  <SafeAreaView style={styles.container}>
    <StatusBar barStyle="light-content" backgroundColor={COLORS.black} />
    {header}

    <View style={styles.messageContainer}>
      <BrandLockup style={styles.messageBrand} />

      <View style={styles.messageIconRing}>
        <Ionicons name="camera-outline" color={COLORS.white} size={wp('11%')} />
      </View>

      <Text style={styles.messageTitle}>{title}</Text>
      <Text style={styles.messageText}>{message}</Text>

      {actionLabel ? (
        <TouchableOpacity style={styles.messageButton} onPress={onAction}>
          <Text style={styles.primaryButtonText}>{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  </SafeAreaView>
);

export default React.memo(MessageView);
