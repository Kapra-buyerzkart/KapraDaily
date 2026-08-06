import { useEffect, useState } from 'react';
import { getPaymentModesApi } from '../api/configService';

export const usePaymentModes = () => {
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [paymentModes, setPaymentModes] = useState([]);

  useEffect(() => {
    const fetchPaymentModes = async () => {
      try {
        const response = await getPaymentModesApi();
        if (response?.success && response?.data) {
          let modes = [...response.data];
          if (
            !modes.some(m =>
              ['online', 'razorpay', 'upi'].includes(
                m.paymentModeName?.toLowerCase(),
              ),
            )
          ) {
            modes.push({
              paymentModeId: 'online_test',
              paymentModeName: 'Online',
              description: 'UPI, Cards, Net Banking',
            });
          }
          setPaymentModes(modes);
          const online = modes.find(m =>
            ['online', 'razorpay', 'upi'].includes(
              m.paymentModeName?.toLowerCase(),
            ),
          );
          if (online) setPaymentMethod(online.paymentModeName);
        }
      } catch (err) {
        console.error('Error fetching payment modes:', err);
      }
    };
    fetchPaymentModes();
  }, []);

  return { paymentModes, paymentMethod, setPaymentMethod };
};
