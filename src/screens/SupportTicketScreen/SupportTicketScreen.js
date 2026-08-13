import { View, StatusBar, Platform } from 'react-native';
import React from 'react';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import StatusModal from '@/components/StatusModal';
import { useSupportTicketForm } from './useSupportTicketForm';
import { styles } from './styles';
import { BORDER_FADE_RANGE } from './motion';
import SupportTopBar from './components/organisms/SupportTopBar';
import TicketForm from './components/organisms/TicketForm';
import SubmitBar from './components/organisms/SubmitBar';
import FormIntro from './components/molecules/FormIntro';
import PrivacyNote from './components/molecules/PrivacyNote';

export default function SupportTicketScreen() {
  const {
    navigation,
    profile,
    orderRef,
    messageRef,
    title,
    setTitle,
    message,
    setMessage,
    priority,
    setPriority,
    orderNumber,
    handleChangeOrderNumber,
    orderLocked,
    isComplete,
    hint,
    status,
    handleSubmit,
    handleStatusClose,
  } = useSupportTicketForm();

  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const topBarBorderStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      BORDER_FADE_RANGE,
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }));

  return (
    <View style={styles.screen}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          stickyHeaderIndices={[0]}
          keyboardShouldPersistTaps="handled"
        >
          <SupportTopBar
            title="Support ticket"
            onBack={() => navigation.goBack()}
            borderStyle={topBarBorderStyle}
          />

          <FormIntro />

          <TicketForm
            orderRef={orderRef}
            messageRef={messageRef}
            title={title}
            onChangeTitle={setTitle}
            orderNumber={orderNumber}
            onChangeOrderNumber={handleChangeOrderNumber}
            orderLocked={orderLocked}
            priority={priority}
            onChangePriority={setPriority}
            message={message}
            onChangeMessage={setMessage}
          />

          <PrivacyNote phone={profile?.phoneNo} />
        </Animated.ScrollView>

        <SubmitBar
          complete={isComplete}
          label="Submit Ticket"
          hint={hint}
          onPress={handleSubmit}
        />
      </KeyboardAvoidingView>

      <StatusModal
        visible={status.visible}
        onClose={handleStatusClose}
        type={status.type}
        title={status.title}
        message={status.message}
      />
    </View>
  );
}
