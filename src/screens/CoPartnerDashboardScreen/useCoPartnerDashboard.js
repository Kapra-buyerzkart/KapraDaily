import { useCallback, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  getCoPartnerAreasApi,
  getCoPartnerListApi,
  getCoPartnerSummaryApi,
  getCoPartnerCustomersApi,
  getCoPartnerOrdersApi,
  getCoPartnerPayoutsApi,
} from '@/api/userService';

const toList = response => {
  if (!response?.success || !response?.data) return [];
  return Array.isArray(response.data) ? response.data : response.data.items || [];
};

const today = new Date();
const pad = value => String(value).padStart(2, '0');

export const DEFAULT_TO_DATE = `${today.getFullYear()}-${pad(
  today.getMonth() + 1,
)}-${pad(today.getDate())}`;
export const DEFAULT_FROM_DATE = `${today.getFullYear()}-${pad(
  today.getMonth() + 1,
)}-01`;

export const useCoPartnerDashboard = () => {
  const navigation = useNavigation();

  const [areas, setAreas] = useState([]);
  const [activeArea, setActiveArea] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [summary, setSummary] = useState(null);
  const [copartners, setCopartners] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [payouts, setPayouts] = useState([]);

  const [fromDate, setFromDate] = useState(DEFAULT_FROM_DATE);
  const [toDate, setToDate] = useState(DEFAULT_TO_DATE);

  const fetchAreas = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getCoPartnerAreasApi();
      const fetchedAreas = toList(response);
      setAreas(fetchedAreas);
      if (fetchedAreas.length > 0) {
        setActiveArea(fetchedAreas[0]);
      }
    } catch (error) {
      console.error('Error fetching areas:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchAllData = useCallback(
    async areaId => {
      if (!areaId) return;
      try {
        setIsLoading(true);
        const params = { pincodeAreaId: areaId, fromDate, toDate };

        const [summaryRes, listRes, customersRes, ordersRes, payoutsRes] =
          await Promise.all([
            getCoPartnerSummaryApi(areaId),
            getCoPartnerListApi(areaId),
            getCoPartnerCustomersApi(params),
            getCoPartnerOrdersApi(params),
            getCoPartnerPayoutsApi(params),
          ]);

        setSummary(summaryRes?.success && summaryRes?.data ? summaryRes.data : null);
        setCopartners(toList(listRes));
        setCustomers(toList(customersRes));
        setOrders(toList(ordersRes));
        setPayouts(toList(payoutsRes));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [fromDate, toDate],
  );

  useEffect(() => {
    fetchAreas();
  }, [fetchAreas]);

  useEffect(() => {
    if (activeArea) {
      fetchAllData(activeArea.pincodeAreaId || activeArea.id);
    }
  }, [activeArea, fetchAllData]);

  const applyRange = useCallback((nextFrom, nextTo) => {
    setFromDate(nextFrom);
    setToDate(nextTo);
  }, []);

  return {
    navigation,
    areas,
    activeArea,
    setActiveArea,
    isLoading,
    summary,
    copartners,
    customers,
    orders,
    payouts,
    fromDate,
    toDate,
    applyRange,
  };
};
