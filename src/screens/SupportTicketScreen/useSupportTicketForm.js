import { useCallback, useContext, useRef, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppContext } from '@/context/appContext';
import { LoaderContext } from '@/context/loaderContext';
import { createSupportTicketApi } from '@/api/supportService';
import { DEFAULT_PRIORITY } from './constants';

const readError = error => {
  if (typeof error === 'string') return error;
  return (
    error?.Message ||
    error?.message ||
    error?.response?.data?.Message ||
    error?.response?.data?.message ||
    'An unexpected error occurred'
  );
};

export const useSupportTicketForm = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { orderId: passedOrderId, orderNumber: passedOrderNumber } =
    route.params || {};
  const { profile } = useContext(AppContext);
  const { showLoader } = useContext(LoaderContext);

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState(DEFAULT_PRIORITY);
  const [orderNumber, setOrderNumber] = useState(
    passedOrderNumber || (passedOrderId ? passedOrderId.toString() : ''),
  );
  const [internalOrderId, setInternalOrderId] = useState(passedOrderId || 0);

  const [status, setStatus] = useState({
    visible: false,
    type: 'success',
    title: '',
    message: '',
  });

  const orderRef = useRef(null);
  const messageRef = useRef(null);

  const orderLocked = Boolean(passedOrderId || passedOrderNumber);
  const isComplete = Boolean(title.trim() && message.trim());

  const hint = !title.trim()
    ? 'Add a title to continue'
    : !message.trim()
    ? 'Describe your issue to continue'
    : 'Submit Ticket';

  const showStatus = useCallback(
    (type, statusTitle, statusMessage) =>
      setStatus({
        visible: true,
        type,
        title: statusTitle,
        message: statusMessage,
      }),
    [],
  );

  const handleChangeOrderNumber = useCallback(value => {
    setOrderNumber(value);
    setInternalOrderId(0);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!title.trim() || !message.trim()) {
      showStatus(
        'error',
        'Missing Information',
        'Please provide both a title and a message.',
      );
      return;
    }

    try {
      showLoader(true);
      const response = await createSupportTicketApi({
        title: title.trim(),
        message: message.trim(),
        priority,
        orderId:
          internalOrderId || (orderNumber ? parseInt(orderNumber, 10) : 0),
      });

      if (response?.success) {
        showStatus(
          'success',
          'Ticket Created',
          'Your support ticket has been created successfully. Our team will get back to you soon.',
        );
        setTitle('');
        setMessage('');
        setPriority(DEFAULT_PRIORITY);
        if (!orderLocked) {
          setOrderNumber('');
          setInternalOrderId(0);
        }
      } else {
        showStatus(
          'error',
          'Error',
          response?.message || 'Failed to create support ticket.',
        );
      }
    } catch (error) {
      console.error('Create Ticket Error Details:', error);
      showStatus('error', 'Error', readError(error));
    } finally {
      showLoader(false);
    }
  }, [
    title,
    message,
    priority,
    internalOrderId,
    orderNumber,
    orderLocked,
    showLoader,
    showStatus,
  ]);

  const handleStatusClose = useCallback(() => {
    setStatus(prev => ({ ...prev, visible: false }));
    if (status.type === 'success') {
      navigation.goBack();
    }
  }, [navigation, status.type]);

  return {
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
  };
};
