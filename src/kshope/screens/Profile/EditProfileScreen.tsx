import React from 'react';
import { Platform, StatusBar, TextInput, View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import { useUser } from '../../context/UserContext';
import StatusModal from '../../components/StatusModal';
import { updateProfilePatchApi } from '../../api/services/userService';
import { UI_COLORS, UI_SPACING, hp } from '../../theme/tokens';

import EditProfileHeader from './redesign/edit/sections/EditProfileHeader';
import IdentityCard from './redesign/edit/sections/IdentityCard';
import PersonalDetailsCard from './redesign/edit/sections/PersonalDetailsCard';
import ContactDetailsCard from './redesign/edit/sections/ContactDetailsCard';
import SaveBar from './redesign/edit/sections/SaveBar';
import DobSheet from './redesign/edit/sections/DobSheet';
import { BAR_SOLID_AT, BORDER_FADE_RANGE, entrance } from './redesign/motion';

const BAR_REST = UI_COLORS.background;
const BAR_SOLID = UI_COLORS.card;

const DEFAULT_DOB = new Date(2000, 0, 1);

const EditProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { profile, loadProfile } = useUser();

  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalConfig, setModalConfig] = React.useState<{
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

  const [fullName, setFullName] = React.useState(profile?.custName || '');
  const [pincode, setPincode] = React.useState(
    profile?.pincode?.toString() || '',
  );
  const [gender, setGender] = React.useState(profile?.gender || '');
  const [dob, setDob] = React.useState(
    profile?.dob ? new Date(profile.dob) : DEFAULT_DOB,
  );
  const [tempDate, setTempDate] = React.useState(dob);
  const [showDatePicker, setShowDatePicker] = React.useState(false);

  const email = profile?.emailId || '';
  const phone = profile?.phoneNo || '';

  const [errors, setErrors] = React.useState<{
    fullName?: string;
    pincode?: string;
  }>({});
  const [isLoading, setIsLoading] = React.useState(false);

  const hasChanges = React.useMemo(() => {
    const isNameChanged = fullName.trim() !== (profile?.custName || '');
    const isPincodeChanged =
      pincode.trim() !== (profile?.pincode?.toString() || '');
    const isGenderChanged = gender !== (profile?.gender || '');
    const isDobChanged = profile?.dob
      ? new Date(profile.dob).toDateString() !== dob.toDateString()
      : true;

    return (
      isNameChanged || isPincodeChanged || isGenderChanged || isDobChanged
    );
  }, [fullName, pincode, gender, dob, profile]);

  const pincodeRef = React.useRef<TextInput>(null);

  const scrollY = useSharedValue(0);
  const heroAnchor = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollY.value = event.contentOffset.y;
    },
  });
  const onHeroMeasure = React.useCallback(
    (bottom: number) => {
      heroAnchor.value = bottom;
    },
    [heroAnchor],
  );

  const topBarBorderStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      BORDER_FADE_RANGE,
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }));

  const topBarBackgroundStyle = useAnimatedStyle(() => {
    const anchor = heroAnchor.value;
    if (anchor <= 0) return { backgroundColor: BAR_REST };
    return {
      backgroundColor: interpolateColor(
        scrollY.value,
        [0, anchor * BAR_SOLID_AT],
        [BAR_REST, BAR_SOLID],
      ),
    };
  });

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleSave = async () => {
    const nextErrors: { fullName?: string; pincode?: string } = {};
    if (!fullName.trim()) nextErrors.fullName = 'Name is required';
    if (pincode.trim() && pincode.trim().length !== 6)
      nextErrors.pincode = 'Enter a valid 6 digit pin code';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    try {
      setIsLoading(true);
      const payload = {
        fullName: fullName.trim(),
        pincode: pincode.trim(),
        gender,
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

  return (
    <View style={styles.mainContainer}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          stickyHeaderIndices={[0]}
          keyboardShouldPersistTaps="handled"
        >
          <EditProfileHeader
            onBack={() => navigation.goBack()}
            backgroundStyle={topBarBackgroundStyle}
            borderStyle={topBarBorderStyle}
          />

          <View style={styles.body}>
            <IdentityCard
              name={fullName}
              phone={phone}
              onMeasure={onHeroMeasure}
              entering={entrance(0)}
            />

            <Animated.View entering={entrance(1)}>
              <PersonalDetailsCard
                fullName={fullName}
                onChangeFullName={setFullName}
                dob={dob}
                onPressDob={() => {
                  setTempDate(dob);
                  setShowDatePicker(true);
                }}
                gender={gender}
                onChangeGender={setGender}
                pincode={pincode}
                onChangePincode={setPincode}
                errors={errors}
                pincodeRef={pincodeRef}
              />
            </Animated.View>

            <Animated.View entering={entrance(2)}>
              <ContactDetailsCard
                email={email}
                phone={phone}
                onChangeEmail={() =>
                  navigation.navigate('KshopeUpdateContact', { type: 'email' })
                }
                onChangePhone={() =>
                  navigation.navigate('KshopeUpdateContact', { type: 'phone' })
                }
              />
            </Animated.View>
          </View>
        </Animated.ScrollView>

        <SaveBar
          enabled={hasChanges}
          loading={isLoading}
          onPress={handleSave}
        />
      </KeyboardAvoidingView>

      <DobSheet
        visible={showDatePicker}
        value={tempDate}
        onChange={setTempDate}
        onCancel={() => setShowDatePicker(false)}
        onConfirm={() => {
          setDob(tempDate);
          setShowDatePicker(false);
        }}
      />

      <StatusModal
        visible={modalVisible}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
        onClose={handleModalClose}
      />
    </View>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: UI_COLORS.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    backgroundColor: UI_COLORS.background,
  },
  scrollContent: {
    paddingBottom: hp('4%'),
  },
  body: {
    paddingTop: UI_SPACING.xs,
    gap: UI_SPACING.md,
  },
});
