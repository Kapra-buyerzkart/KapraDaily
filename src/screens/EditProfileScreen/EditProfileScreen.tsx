import React from 'react';
import { Platform, StatusBar, TextInput, Text, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import StatusModal from '../../components/StatusModal';
import SectionHeader from '../home/components/SectionHeader';
import { useEditProfileScreen } from './useEditProfileScreen';
import { styles } from './styles';
import EditProfileHeader from './components/EditProfileHeader';
import EditProfileHero from './components/EditProfileHero';
import ProfileTextField from './components/ProfileTextField';
import DateOfBirthField from './components/DateOfBirthField';
import GenderSelector from './components/GenderSelector';
import SaveBar from './components/SaveBar';
import {
  CANVAS,
  HERO_GRADIENT,
  HERO_TOP,
  INK,
  MAX_FONT_SCALE,
} from '@/styles/homeTheme';
import { BAR_SOLID_AT, BORDER_FADE_RANGE, entrance } from '@/styles/motion';

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
    if (anchor <= 0) return { backgroundColor: HERO_TOP };
    return {
      backgroundColor: interpolateColor(
        scrollY.value,
        [0, anchor * BAR_SOLID_AT],
        [HERO_TOP, CANVAS],
      ),
    };
  });

  return (
    <View style={styles.mainContainer}>
      {}
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

          {}
          <LinearGradient colors={HERO_GRADIENT} style={styles.hero}>
            <EditProfileHero
              name={fullName}
              phone={phone}
              onMeasure={onHeroMeasure}
              entering={entrance(0)}
            />
          </LinearGradient>

          <Animated.View entering={entrance(1)}>
            <SectionHeader title="Personal details" variant="screen" />
            <View style={styles.fieldGroup}>
              <ProfileTextField
                label="Full Name"
                icon="account-outline"
                placeholder="Enter your name"
                value={fullName}
                onChangeText={setFullName}
                error={errors.fullName}
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={() => dobRef.current?.focus()}
              />

              <DateOfBirthField
                ref={dobRef}
                value={dob}
                onChange={setDob}
                error={errors.dob}
              />

              <GenderSelector value={gender} onChange={setGender} />

              <ProfileTextField
                ref={skIdRef}
                label="SK Id"
                icon="card-account-details-outline"
                optional
                placeholder="Enter SK Id"
                value={skId}
                onChangeText={setSkId}
                autoCapitalize="characters"
                returnKeyType="done"
              />
            </View>
          </Animated.View>

          <Animated.View entering={entrance(2)}>
            <SectionHeader title="Contact details" variant="screen" />
            <View style={styles.fieldGroup}>
              {}
              <ProfileTextField
                label="Email ID"
                icon="email-outline"
                placeholder="Not added yet"
                value={email}
                editable={false}
                verified={!!email}
              />

              <ProfileTextField
                label="Phone Number"
                icon="phone-outline"
                placeholder="Not added yet"
                value={phone}
                editable={false}
                verified={!!phone}
              />
            </View>

            <View style={styles.noteRow}>
              <MaterialCommunityIcons
                name="shield-check-outline"
                size={wp('4%')}
                color={INK.muted}
              />
              <Text
                style={styles.noteText}
                maxFontSizeMultiplier={MAX_FONT_SCALE}
              >
                Your email and phone are verified. Change them from Security
                settings so we can confirm it's you.
              </Text>
            </View>
          </Animated.View>
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
