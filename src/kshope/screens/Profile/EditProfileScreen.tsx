import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  StyleSheet,
  Image,
  ImageBackground,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

import { colors, fontColors } from '../../theme/colours';
import { styles } from './styles';
import { AppIcons } from '../../assets/icons';
import InputField from '../../components/TextField';
import CustomGradientButton from '../../components/CustomGradientButton';

import { useUser } from '../../context/UserContext';
import StatusModal from '../../components/StatusModal';
import { updateProfilePatchApi } from '../../api/services/userService';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

const EditProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const { profile, loadProfile } = useUser();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    title: string;
    message: string;
    type: 'success' | 'error';
  }>({ title: '', message: '', type: 'success' });

  const showModal = (
    title: string,
    message: string,
    type: 'success' | 'error',
  ) => {
    setModalConfig({ title, message, type });
    setModalVisible(true);
  };

  const [fullName, setFullName] = useState(profile?.custName || '');
  const [pincode, setPincode] = useState(profile?.pincode?.toString() || '');
  const [gender, setGender] = useState(profile?.gender || '');
  const [dob, setDob] = useState(
    profile?.dob ? new Date(profile.dob) : new Date(2000, 0, 1),
  );
  const [tempDate, setTempDate] = useState(
    profile?.dob ? new Date(profile.dob) : new Date(2000, 0, 1),
  );
  const [showDatePicker, setShowDatePicker] = useState(false);

  const email = profile?.emailId || '';
  const phone = profile?.phoneNo || '';

  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const isNameChanged = fullName.trim() !== (profile?.custName || '');
    const isPincodeChanged =
      pincode.trim() !== (profile?.pincode?.toString() || '');
    const isGenderChanged = gender !== (profile?.gender || '');
    const isDobChanged = profile?.dob
      ? new Date(profile.dob).toDateString() !== dob.toDateString()
      : true;

    setHasChanges(
      isNameChanged || isPincodeChanged || isGenderChanged || isDobChanged,
    );
  }, [fullName, pincode, gender, dob, profile]);

  const handleSave = async () => {
    if (!fullName.trim()) {
      showModal('Error', 'Name is required', 'error');
      return;
    }

    try {
      setIsLoading(true);
      const payload = {
        fullName: fullName.trim(),
        pincode: pincode.trim(),
        gender: gender,
        dob: dob.toISOString().split('T')[0],
      };
      const response = await updateProfilePatchApi(payload);

      if (response?.success) {
        await loadProfile();
        showModal('Success', 'Profile updated successfully', 'success');
      } else {
        showModal(
          'Error',
          response?.message || 'Failed to update profile',
          'error',
        );
      }
    } catch (error: any) {
      console.error('Update Profile Error:', error);
      const errorMessage =
        typeof error === 'string'
          ? error
          : error?.message || error?.Message || 'An unexpected error occurred';
      showModal('Error', errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setTempDate(selectedDate);
    }
  };

  const renderGenderOption = (option: string) => (
    <TouchableOpacity
      key={option}
      style={[
        localStyles.genderOption,
        gender === option && localStyles.genderOptionSelected,
      ]}
      onPress={() => setGender(option)}
    >
      <Text
        style={[
          localStyles.genderText,
          gender === option && localStyles.genderTextSelected,
        ]}
      >
        {option}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../../assets/images/login/bg_test.png')}
      style={localStyles.backgroundImage}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        style={{ flex: 1, width: '100%' }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 10,
            width: '95%',
            alignSelf: 'center',
          }}
        >
          <View
            style={[
              styles.editProfileHeader,
              {
                backgroundColor: 'transparent',
                paddingTop: Platform.OS === 'ios' ? hp('5%') : hp('2%'),
              },
            ]}
          >
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <AppIcons.ArrowBack size={28} color={colors.black} />
            </TouchableOpacity>
            <Text style={styles.editProfileTitle}>Edit Profile</Text>
          </View>

          <Image
            source={require('../../assets/images/login/logo.png')}
            style={localStyles.logo}
          />

          <View style={styles.editProfileFormContainer}>
            <InputField
              label="Name"
              placeholder="Enter name"
              placeholderTextColor={colors.grey || '#DADADA'}
              value={fullName}
              onChangeText={setFullName}
            />

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Gender</Text>
              <View style={localStyles.genderContainer}>
                {['Male', 'Female', 'Other'].map(renderGenderOption)}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Date of Birth</Text>
              <TouchableOpacity
                style={styles.inputWrapper}
                onPress={() => {
                  setTempDate(dob);
                  setShowDatePicker(true);
                }}
              >
                <Text
                  style={[
                    styles.textInput,
                    {
                      textAlignVertical: 'center',
                      lineHeight: Platform.OS === 'ios' ? hp('5.8%') : hp('6%'),
                    },
                  ]}
                >
                  {dob.toLocaleDateString('en-GB')}
                </Text>
                <AppIcons.Calendar size={20} color={colors.themeTeal} />
              </TouchableOpacity>
            </View>

            <Modal
              visible={showDatePicker}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setShowDatePicker(false)}
            >
              <View style={localStyles.modalContainer}>
                <TouchableWithoutFeedback
                  onPress={() => setShowDatePicker(false)}
                >
                  <View style={localStyles.modalBackdrop} />
                </TouchableWithoutFeedback>
                <View style={localStyles.bottomSheetContainer}>
                  <View style={localStyles.bottomSheetHeader}>
                    <TouchableOpacity
                      onPress={() => setShowDatePicker(false)}
                      style={localStyles.bottomSheetCancelButton}
                    >
                      <Text style={localStyles.bottomSheetCancelText}>
                        Cancel
                      </Text>
                    </TouchableOpacity>
                    <Text style={localStyles.bottomSheetTitle}>
                      Select Date of Birth
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        setDob(tempDate);
                        setShowDatePicker(false);
                      }}
                      style={localStyles.bottomSheetDoneButton}
                    >
                      <Text style={localStyles.bottomSheetDoneText}>Done</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={localStyles.pickerContainer}>
                    <DateTimePicker
                      value={tempDate}
                      mode="date"
                      display="spinner"
                      maximumDate={new Date()}
                      onChange={onDateChange}
                      textColor="#000"
                    />
                  </View>
                </View>
              </View>
            </Modal>

            <InputField
              label="Pin code"
              placeholder="00 00 00"
              placeholderTextColor={colors.grey || '#DADADA'}
              keyboardType="numeric"
              maxLength={6}
              value={pincode}
              onChangeText={setPincode}
            />

            <View style={{ opacity: 0.6 }}>
              <InputField
                label="Email ID (Update from Security)"
                placeholder="Enter email"
                placeholderTextColor={colors.grey || '#DADADA'}
                value={email}
                editable={false}
              />
            </View>

            <View style={{ opacity: 0.6 }}>
              <InputField
                label="Phone Number (Update from Security)"
                placeholder="Enter phone"
                placeholderTextColor={colors.grey || '#DADADA'}
                value={phone}
                editable={false}
              />
            </View>

            <CustomGradientButton
              title="Save Changes"
              onPress={handleSave}
              disabled={!hasChanges || isLoading}
              loading={isLoading}
              style={{ marginTop: 30 }}
            />
          </View>
        </ScrollView>
        <StatusModal
          visible={modalVisible}
          type={modalConfig.type}
          title={modalConfig.title}
          message={modalConfig.message}
          onClose={() => setModalVisible(false)}
        />
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const localStyles = StyleSheet.create({
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp('0.5%'),
  },
  headerSection: {
    height: hp('20%'),
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  logo: {
    width: wp('30%'),
    height: hp('8%'),
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: hp('2.5%'),
    marginBottom: hp('2.5%'),
  },
  genderOption: {
    flex: 1,
    height: hp('5.5%'),
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: wp('6%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: wp('1%'),
    backgroundColor: colors.white,
  },
  genderOptionSelected: {
    backgroundColor: colors.themeTeal,
    borderColor: colors.themeTeal,
  },
  genderText: {
    fontSize: 14,
    color: '#616161',
    fontFamily: 'Gilroy-Medium',
  },
  genderTextSelected: {
    color: colors.white,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  bottomSheetContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: wp('8%'),
    borderTopRightRadius: wp('8%'),
    paddingBottom: Platform.OS === 'ios' ? hp('4%') : hp('2%'),
    overflow: 'hidden',
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp('5.8%'),
    paddingVertical: hp('2%'),
    borderBottomWidth: 1,
    borderColor: '#E5E5E5',
  },
  bottomSheetCancelButton: {
    paddingVertical: 5,
  },
  bottomSheetCancelText: {
    fontSize: wp('4%'),
    color: '#9E9E9E',
    fontFamily: 'Gilroy-Medium',
  },
  bottomSheetTitle: {
    fontSize: wp('4.5%'),
    color: fontColors.titleBlack,
    fontWeight: 'bold',
    fontFamily: 'Gilroy-Bold',
  },
  bottomSheetDoneButton: {
    paddingVertical: 5,
  },
  bottomSheetDoneText: {
    fontSize: wp('4%'),
    color: colors.themeTeal || '#F25000',
    fontWeight: 'bold',
    fontFamily: 'Gilroy-Bold',
  },
  pickerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp('2%'),
    backgroundColor: colors.white,
  },
});

export default EditProfileScreen;
