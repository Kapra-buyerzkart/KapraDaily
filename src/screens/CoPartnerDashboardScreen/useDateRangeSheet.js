import { useCallback, useMemo, useState } from 'react';

const pad = value => String(value).padStart(2, '0');

const toDateStr = date =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const useDateRangeSheet = ({ fromDate, toDate, onApply }) => {
  const [visible, setVisible] = useState(false);
  const [tempFromDate, setTempFromDate] = useState(fromDate);
  const [tempToDate, setTempToDate] = useState(toDate);
  const [selectingField, setSelectingField] = useState('from');
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const open = useCallback(() => {
    setTempFromDate(fromDate);
    setTempToDate(toDate);
    setSelectingField('from');

    const start = new Date(fromDate);
    const anchor = isNaN(start) ? new Date() : start;
    setCurrentMonth(anchor.getMonth());
    setCurrentYear(anchor.getFullYear());

    setVisible(true);
  }, [fromDate, toDate]);

  const close = useCallback(() => setVisible(false), []);

  const selectPreset = useCallback(
    days => {
      const to = new Date();
      const from = new Date();
      if (days === 'month') {
        from.setDate(1);
      } else {
        from.setDate(to.getDate() - days);
      }

      const fromStr = toDateStr(from);
      const toStr = toDateStr(to);
      setTempFromDate(fromStr);
      setTempToDate(toStr);
      onApply(fromStr, toStr);
      setVisible(false);
    },
    [onApply],
  );

  const applyCustomRange = useCallback(() => {
    if (tempFromDate && tempToDate) {
      onApply(tempFromDate, tempToDate);
      setVisible(false);
    }
  }, [onApply, tempFromDate, tempToDate]);

  const goToPrevMonth = useCallback(() => {
    setCurrentMonth(prev => {
      if (prev === 0) {
        setCurrentYear(year => year - 1);
        return 11;
      }
      return prev - 1;
    });
  }, []);

  const goToNextMonth = useCallback(() => {
    setCurrentMonth(prev => {
      if (prev === 11) {
        setCurrentYear(year => year + 1);
        return 0;
      }
      return prev + 1;
    });
  }, []);

  const selectDay = useCallback(
    dateStr => {
      if (!dateStr) return;

      if (!tempFromDate || (tempFromDate && tempToDate)) {
        setTempFromDate(dateStr);
        setTempToDate(null);
        setSelectingField('to');
        return;
      }

      const start = new Date(tempFromDate);
      const end = new Date(dateStr);
      if (end < start) {
        setTempFromDate(dateStr);
        setTempToDate(null);
        setSelectingField('to');
      } else {
        setTempToDate(dateStr);
        setSelectingField('from');
      }
    },
    [tempFromDate, tempToDate],
  );

  const days = useMemo(() => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const list = [];

    for (let index = 0; index < firstDay; index++) {
      list.push({ key: `empty-${index}`, day: null, dateStr: null });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${pad(currentMonth + 1)}-${pad(day)}`;
      list.push({ key: dateStr, day, dateStr });
    }

    return list;
  }, [currentMonth, currentYear]);

  const getDayState = useCallback(
    dateStr => {
      if (!dateStr) return 'blank';
      if (dateStr === tempFromDate || dateStr === tempToDate) return 'edge';

      if (tempFromDate && tempToDate) {
        const current = new Date(dateStr);
        if (
          current > new Date(tempFromDate) &&
          current < new Date(tempToDate)
        ) {
          return 'inRange';
        }
      }

      return 'idle';
    },
    [tempFromDate, tempToDate],
  );

  return {
    visible,
    open,
    close,
    tempFromDate,
    tempToDate,
    selectingField,
    setSelectingField,
    currentMonth,
    currentYear,
    days,
    getDayState,
    goToPrevMonth,
    goToNextMonth,
    selectDay,
    selectPreset,
    applyCustomRange,
    canApply: !!(tempFromDate && tempToDate),
  };
};
