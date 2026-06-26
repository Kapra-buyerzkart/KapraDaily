import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { FONTS } from '../styles/typography';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { openExternalUrl } from '../utils/safeUrl';

const AppUpdateModal = ({ visible, updateInfo, onLater }) => {
  if (!updateInfo) return null;

  const { versionCode, redirectUrl, isCompulsory, releaseDate } = updateInfo;

  const handleUpdate = () => {
    if (redirectUrl) {
      openExternalUrl(redirectUrl);
    }
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={isCompulsory ? () => {} : onLater}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <MaterialIcons
                name="system-update"
                size={wp('10%')}
                color="#F25000"
              />
            </View>
          </View>

          <Text style={styles.title}>New Update Available!</Text>
          <Text style={styles.versionText}>Version {versionCode}</Text>

          <Text style={styles.message}>
            {isCompulsory
              ? 'A critical update is available. Please update the app to continue using Uden Deal'
              : "We've added new features and performance improvements. Update now for the best experience!"}
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.updateButton}
              onPress={handleUpdate}
            >
              <Text style={styles.updateButtonText}>Update Now</Text>
            </TouchableOpacity>

            {!isCompulsory && (
              <TouchableOpacity style={styles.laterButton} onPress={onLater}>
                <Text style={styles.laterButtonText}>Later</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: wp('85%'),
    backgroundColor: '#FFFFFF',
    borderRadius: wp('6%'),
    padding: wp('6%'),
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  header: {
    marginBottom: hp('2%'),
  },
  iconCircle: {
    width: wp('20%'),
    height: wp('20%'),
    borderRadius: wp('10%'),
    backgroundColor: '#FFF5F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: FONTS.poppins.bold,
    fontSize: wp('5%'),
    color: '#000000',
    textAlign: 'center',
  },
  versionText: {
    fontFamily: FONTS.poppins.medium,
    fontSize: wp('3.5%'),
    color: '#F25000',
    marginBottom: hp('1.5%'),
  },
  message: {
    fontFamily: FONTS.poppins.regular,
    fontSize: wp('3.8%'),
    color: '#616161',
    textAlign: 'center',
    marginBottom: hp('4%'),
    lineHeight: wp('5.5%'),
  },
  buttonContainer: {
    width: '100%',
    gap: hp('1%'),
  },
  updateButton: {
    backgroundColor: '#F25000',
    paddingVertical: hp('1.8%'),
    borderRadius: wp('3%'),
    alignItems: 'center',
    shadowColor: '#F25000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  updateButtonText: {
    fontFamily: FONTS.poppins.semiBold,
    fontSize: wp('4%'),
    color: '#FFFFFF',
  },
  laterButton: {
    paddingVertical: hp('1.5%'),
    alignItems: 'center',
  },
  laterButtonText: {
    fontFamily: FONTS.poppins.medium,
    fontSize: wp('3.5%'),
    color: '#9E9E9E',
  },
});

export default AppUpdateModal;
