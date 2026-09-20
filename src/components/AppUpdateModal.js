import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { openExternalUrl } from '../utils/safeUrl';

const AppUpdateModal = ({ visible, updateInfo, onLater }) => {
  if (!updateInfo) return null;

  const { versionCode, redirectUrl, isCompulsory } = updateInfo;

  const handleUpdate = () => {
    if (redirectUrl) {
      openExternalUrl(redirectUrl);
    }
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={isCompulsory ? () => {} : onLater}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <Ionicons
                name="sparkles-outline"
                size={wp('8%')}
                color="#0C382E"
              />
            </View>
          </View>

          <Text style={styles.title}>Update Available</Text>
          <Text style={styles.versionText}>Version {versionCode}</Text>

          <Text style={styles.message}>
            {isCompulsory
              ? 'A critical update is available. Please update the app to continue browsing Kapra Gold & Diamonds.'
              : "We've crafted new features and refinements. Update now for the finest jewellery shopping experience."}
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.updateButton}
              activeOpacity={0.88}
              onPress={handleUpdate}
            >
              <Text style={styles.updateButtonText}>Update Now</Text>
            </TouchableOpacity>

            {!isCompulsory && (
              <TouchableOpacity
                style={styles.laterButton}
                activeOpacity={0.7}
                onPress={onLater}
              >
                <Text style={styles.laterButtonText}>Maybe Later</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp('6%'),
  },
  modalContainer: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: hp('3.5%'),
    paddingHorizontal: wp('6%'),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ECE7DE',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 18,
  },
  header: {
    marginBottom: hp('1.5%'),
  },
  iconCircle: {
    width: wp('15%'),
    height: wp('15%'),
    borderRadius: wp('7.5%'),
    backgroundColor: '#E8F2EE',
    borderWidth: 1,
    borderColor: '#D1E6DD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'CormorantGaramond-SemiBold',
    fontSize: wp('5.8%'),
    color: '#12372A',
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  versionText: {
    fontFamily: 'Lexend-Medium',
    fontSize: wp('3.2%'),
    color: '#B68D40',
    marginTop: hp('0.3%'),
    marginBottom: hp('1.5%'),
    letterSpacing: 0.3,
  },
  message: {
    fontFamily: 'Lexend-Regular',
    fontSize: wp('3.4%'),
    color: '#666666',
    textAlign: 'center',
    marginBottom: hp('3%'),
    lineHeight: wp('5%'),
    paddingHorizontal: wp('1%'),
  },
  buttonContainer: {
    width: '100%',
    gap: hp('1.2%'),
  },
  updateButton: {
    backgroundColor: '#0C382E',
    height: hp('5.8%'),
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateButtonText: {
    fontFamily: 'Lexend-Medium',
    fontSize: wp('3.7%'),
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  laterButton: {
    height: hp('5%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  laterButtonText: {
    fontFamily: 'Lexend-Medium',
    fontSize: wp('3.4%'),
    color: '#888888',
  },
});

export default AppUpdateModal;
