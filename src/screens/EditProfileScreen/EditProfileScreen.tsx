import React from 'react';
import {
  Platform,
  ScrollView,
  TouchableOpacity,
  Text,
  View,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import StatusModal from '../../components/StatusModal';
import { useEditProfileScreen } from './useEditProfileScreen';
import { styles } from './styles';
import EditProfileHeader from './components/EditProfileHeader';
import ProfileTextField from './components/ProfileTextField';
import GenderSelector from './components/GenderSelector';

const EditProfileScreen = () => {
  const {
    navigation,
    fullName,
    setFullName,
    dob,
    setDob,
    gender,
    setGender,
    skId,
    setSkId,
    email,
    phone,
    hasChanges,
    statusModalVisible,
    statusType,
    statusTitle,
    statusMessage,
    handleModalClose,
    handleSave,
  } = useEditProfileScreen();

  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.mainContainer]}>
      <StatusBar barStyle={'light-content'} backgroundColor={'transparent'} />
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <EditProfileHeader onBack={() => navigation.goBack()} />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formContainer}>
            <ProfileTextField
              label="Full Name"
              placeholder="Enter your name"
              value={fullName}
              onChangeText={setFullName}
            />

            <ProfileTextField
              label="Date of Birth (YYYY-MM-DD)"
              placeholder="YYYY-MM-DD"
              value={dob}
              onChangeText={setDob}
            />

            <ProfileTextField
              label="SK Id"
              placeholder="Enter SK Id"
              value={skId}
              onChangeText={setSkId}
            />

            <GenderSelector value={gender} onChange={setGender} />

            <ProfileTextField
              label="Email ID (Update from Security)"
              value={email}
              editable={false}
            />

            <ProfileTextField
              label="Phone Number (Update from Security)"
              value={phone}
              editable={false}
            />

            <TouchableOpacity
              onPress={handleSave}
              style={[
                styles.saveButton,
                !hasChanges && styles.saveButtonDisabled,
              ]}
              disabled={!hasChanges}
            >
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <StatusModal
        visible={statusModalVisible}
        onClose={handleModalClose}
        type={statusType}
        title={statusTitle}
        message={statusMessage}
      />
    </View>
  );
};

export default EditProfileScreen;
