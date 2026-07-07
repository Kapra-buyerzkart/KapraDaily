import { useContext, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { AppContext } from '../../context/appContext';
import { LoaderContext } from '../../context/loaderContext';
import { updateProfilePatchApi } from '../../api/userService';

export type StatusType = 'success' | 'error';

const DOB_REGEX = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

export const useEditProfileScreen = () => {
  const navigation = useNavigation();
  const { profile, loadProfile } = useContext(AppContext);
  const { showLoader } = useContext(LoaderContext);

  const [fullName, setFullName] = useState(profile?.custName || '');
  const [dob, setDob] = useState(profile?.dob || '');
  const [gender, setGender] = useState(profile?.gender || '');
  const [skId, setSkId] = useState(profile?.skId || '');

  const [hasChanges, setHasChanges] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [statusType, setStatusType] = useState<StatusType>('success');
  const [statusTitle, setStatusTitle] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const isNameChanged = fullName.trim() !== (profile?.custName || '');
    const isDobChanged = dob.trim() !== (profile?.dob || '');
    const isGenderChanged = gender !== (profile?.gender || '');
    const isSkIdChanged = skId.trim() !== (profile?.skId || '');
    setHasChanges(
      isNameChanged || isDobChanged || isGenderChanged || isSkIdChanged,
    );
  }, [fullName, dob, gender, skId, profile]);

  const handleModalClose = () => {
    setStatusModalVisible(false);
    // Removed auto-navigation back on success as per user request
  };

  const showStatus = (type: StatusType, title: string, message: string) => {
    setStatusType(type);
    setStatusTitle(title);
    setStatusMessage(message);
    setStatusModalVisible(true);
  };

  // Phone and Email are handled separately via OTP flow now
  const email = profile?.emailId || '';
  const phone = profile?.phoneNo || '';

  const handleSave = async () => {
    if (!fullName.trim()) {
      showStatus('error', 'Error', 'Full Name is required');
      return;
    }

    const dobValue = dob.trim();
    if (dobValue && !DOB_REGEX.test(dobValue)) {
      showStatus('error', 'Error', 'Date of Birth must be in YYYY-MM-DD format');
      return;
    }

    try {
      showLoader(true);
      const payload = {
        fullName: fullName.trim(),
        dob: dobValue ? dobValue : null,
        gender: gender,
        skId: skId.trim() || null,
      };
      const response: any = await updateProfilePatchApi(payload);
      if (response?.success) {
        await loadProfile(); // Refresh global profile state
        showStatus('success', 'Success', 'Profile updated successfully');
      } else {
        showStatus('error', 'Error', response?.message || 'Failed to update profile');
      }
    } catch (error: any) {
      console.error('Update Profile Error:', error);
      const errorMessage =
        typeof error === 'string'
          ? error
          : error?.message || error?.Message || 'An unexpected error occurred';
      showStatus('error', 'Error', errorMessage);
    } finally {
      showLoader(false);
    }
  };

  return {
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
  };
};
