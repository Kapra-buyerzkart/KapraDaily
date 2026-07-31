import { Platform, Vibration } from 'react-native';
import { FIELD_KEYS } from './constants';

export const pickField = (ticket, keys) => {
  if (!ticket || typeof ticket !== 'object') return null;
  const key = keys.find(
    k => ticket[k] !== undefined && ticket[k] !== null && ticket[k] !== '',
  );
  return key ? String(ticket[key]) : null;
};

export const formatClock = value => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const notifyVerdict = status => {
  if (status === 'valid') {
    Vibration.vibrate(45);
    return;
  }
  Vibration.vibrate(Platform.OS === 'ios' ? [0, 240] : [0, 180, 120, 180]);
};

export const buildTicketInfo = ticket => ({
  attendee: pickField(ticket, FIELD_KEYS.attendee),
  eventName: pickField(ticket, FIELD_KEYS.event),
  category: pickField(ticket, FIELD_KEYS.category),
  meta: [
    { label: 'Ticket No', value: pickField(ticket, FIELD_KEYS.ticketNo) },
    { label: 'Qty', value: pickField(ticket, FIELD_KEYS.quantity) },
    {
      label: 'Time',
      value: formatClock(pickField(ticket, FIELD_KEYS.checkedInAt)),
    },
  ].filter(cell => cell.value),
});
