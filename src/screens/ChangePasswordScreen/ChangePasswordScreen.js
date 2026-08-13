import React from 'react';
import { View, StatusBar, Platform, ScrollView } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import StatusModal from '@/components/StatusModal';
import { entrance } from '@/styles/motion';
import { useChangePassword } from './useChangePassword';
import { styles } from './styles';
import ChangePasswordHeader from './organisms/ChangePasswordHeader';
import CurrentPasswordCard from './organisms/CurrentPasswordCard';
import NewPasswordCard from './organisms/NewPasswordCard';
import ChangePasswordActionBar from './organisms/ChangePasswordActionBar';

const ChangePasswordScreen = () => {
  const insets = useSafeAreaInsets();
  const {
    navigation,
    oldPassword,
    newPassword,
    confirmPassword,
    oldError,
    confirmError,
    reusedError,
    confirmMatches,
    checks,
    score,
    canSubmit,
    hint,
    newRef,
    confirmRef,
    statusConfig,
    setNewPassword,
    setConfirmPassword,
    handleChangeOld,
    handleUpdate,
    handleStatusClose,
  } = useChangePassword();

  return (
    <View style={styles.mainContainer}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <View style={[styles.topBar, { paddingTop: insets.top }]}>
        <ChangePasswordHeader onBack={() => navigation.goBack()} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View entering={entrance(0)}>
            <CurrentPasswordCard
              value={oldPassword}
              error={oldError}
              onChangeText={handleChangeOld}
              onSubmitEditing={() => newRef.current?.focus()}
            />
          </Animated.View>

          <Animated.View entering={entrance(1)}>
            <NewPasswordCard
              ref={newRef}
              confirmRef={confirmRef}
              newPassword={newPassword}
              confirmPassword={confirmPassword}
              reusedError={reusedError}
              confirmError={confirmError}
              confirmMatches={confirmMatches}
              checks={checks}
              score={score}
              onChangeNew={setNewPassword}
              onChangeConfirm={setConfirmPassword}
              onSubmitNew={() => confirmRef.current?.focus()}
              onSubmitConfirm={canSubmit ? handleUpdate : undefined}
            />
          </Animated.View>
        </ScrollView>

        <ChangePasswordActionBar
          enabled={canSubmit}
          label="Update Password"
          hint={hint}
          onPress={handleUpdate}
        />
      </KeyboardAvoidingView>

      <StatusModal
        visible={statusConfig.visible}
        onClose={handleStatusClose}
        type={statusConfig.type}
        title={statusConfig.title}
        message={statusConfig.message}
      />
    </View>
  );
};

export default ChangePasswordScreen;
