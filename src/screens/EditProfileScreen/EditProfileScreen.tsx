import React from 'react';
import { Platform, StatusBar, TextInput, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import StatusModal from '@/components/StatusModal';
import { useEditProfileScreen } from './useEditProfileScreen';
import { styles, BAR_REST, BAR_SOLID } from './styles';
import EditProfileHeader from './organisms/EditProfileHeader';
import IdentityCard from './organisms/IdentityCard';
import PersonalDetailsCard from './organisms/PersonalDetailsCard';
import ContactDetailsCard from './organisms/ContactDetailsCard';
import SaveBar from './organisms/SaveBar';
import { BAR_SOLID_AT, BORDER_FADE_RANGE, entrance } from './motion';

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
    isPrivileged,
    hasChanges,
    errors,
    statusModalVisible,
    statusType,
    statusTitle,
    statusMessage,
    handleModalClose,
    handleSave,
  } = useEditProfileScreen();

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

  const dobRef = React.useRef<TextInput>(null);
  const skIdRef = React.useRef<TextInput>(null);

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
              isPrivileged={isPrivileged}
              onMeasure={onHeroMeasure}
              entering={entrance(0)}
            />

            <Animated.View entering={entrance(1)}>
              <PersonalDetailsCard
                fullName={fullName}
                onChangeFullName={setFullName}
                dob={dob}
                onChangeDob={setDob}
                gender={gender}
                onChangeGender={setGender}
                skId={skId}
                onChangeSkId={setSkId}
                errors={errors}
                dobRef={dobRef}
                skIdRef={skIdRef}
              />
            </Animated.View>

            <Animated.View entering={entrance(2)}>
              <ContactDetailsCard email={email} phone={phone} />
            </Animated.View>
          </View>
        </Animated.ScrollView>

        <SaveBar enabled={hasChanges} onPress={handleSave} />
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
