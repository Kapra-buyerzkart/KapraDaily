import { useCallback, useContext, useMemo, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { LoaderContext } from '@/context/loaderContext';
import { changePasswordApi } from '@/api/userService';
import { METER_SEGMENTS, RULES } from './constants';

const scorePassword = value => {
  if (!value) return 0;
  let score = 0;
  if (value.length >= 8) score += 1;
  if (value.length >= 12) score += 1;
  if (/[A-Za-z]/.test(value) && /[0-9]/.test(value)) score += 1;
  if (
    /[^A-Za-z0-9]/.test(value) ||
    (/[a-z]/.test(value) && /[A-Z]/.test(value))
  )
    score += 1;
  return Math.min(score, METER_SEGMENTS);
};

export const useChangePassword = () => {
  const navigation = useNavigation();
  const { showLoader } = useContext(LoaderContext);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [oldError, setOldError] = useState('');

  const [statusConfig, setStatusConfig] = useState({
    visible: false,
    type: 'success',
    title: '',
    message: '',
  });
  const closeActionRef = useRef(null);

  const newRef = useRef(null);
  const confirmRef = useRef(null);

  const checks = useMemo(
    () => RULES.map(rule => ({ ...rule, passed: rule.test(newPassword) })),
    [newPassword],
  );
  const newValid = checks.every(check => check.passed);
  const score = useMemo(() => scorePassword(newPassword), [newPassword]);

  const confirmTouched = confirmPassword.length > 0;
  const confirmMatches = confirmTouched && confirmPassword === newPassword;
  const confirmError =
    confirmTouched && !confirmMatches ? 'Passwords don’t match' : '';
  const isReused = newValid && newPassword === oldPassword;

  const canSubmit =
    oldPassword.length > 0 && newValid && confirmMatches && !isReused;

  const hint = !oldPassword
    ? 'Enter your current password'
    : !newValid
    ? 'Choose a stronger new password'
    : isReused
    ? 'New password must be different'
    : 'Re-enter the new password to confirm';

  const showError = useCallback(message => {
    setStatusConfig({
      visible: true,
      type: 'error',
      title: 'Error',
      message,
    });
  }, []);

  const handleChangeOld = useCallback(text => {
    setOldError('');
    setOldPassword(text);
  }, []);

  const handleUpdate = useCallback(async () => {
    if (!canSubmit) return;

    try {
      showLoader(true);
      const response = await changePasswordApi({
        oldPassword,
        newPassword,
        confirmPassword,
      });

      if (response?.success) {
        closeActionRef.current = () => navigation.goBack();
        setStatusConfig({
          visible: true,
          type: 'success',
          title: 'Success',
          message: 'Password updated successfully',
        });
        return;
      }

      const message = response?.message || 'Failed to update password';
      if (/old|current|incorrect|wrong/i.test(message)) {
        setOldError(message);
      } else {
        showError(message);
      }
    } catch (error) {
      console.error('Change Password Error:', error);
      showError('An unexpected error occurred');
    } finally {
      showLoader(false);
    }
  }, [
    canSubmit,
    confirmPassword,
    navigation,
    newPassword,
    oldPassword,
    showError,
    showLoader,
  ]);

  const handleStatusClose = useCallback(() => {
    setStatusConfig(prev => ({ ...prev, visible: false }));
    const action = closeActionRef.current;
    closeActionRef.current = null;
    if (action) {
      action();
    }
  }, []);

  return {
    navigation,
    oldPassword,
    newPassword,
    confirmPassword,
    oldError,
    confirmError,
    reusedError: isReused ? 'Choose a password you aren’t using now' : '',
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
  };
};
