import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-simple-toast';
import images from '@/assets/images';
import COLORS from '@/styles/colors';
import CONFIG from '@/globals/config';
import useEventDetails from '@/screens/EventDetailsScreen/hooks/useEventDetails';
import ArtistList from '@/screens/EventDetailsScreen/components/ArtistList';
import AccordionSection from '@/screens/EventDetailsScreen/components/AccordionSection';
import { formatTime } from '@/screens/EventDetailsScreen/utils';
import styles from './styles';

const resolveImage = value => {
  if (typeof value === 'string' && value.length > 0) {
    return {
      uri: /^https?:\/\//i.test(value) ? value : CONFIG.image_base_url + value,
    };
  }
  return images.fallback;
};

const getDaysLeft = start => {
  if (!start) return null;
  const startDate = new Date(start);
  if (Number.isNaN(startDate.getTime())) return null;
  const now = new Date();
  const startDay = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate(),
  );
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = Math.round((startDay - today) / 86400000);
  if (diff < 0) return 'Event ended';
  if (diff === 0) return 'Happening today';
  if (diff === 1) return 'Tomorrow';
  return `${diff} days left`;
};

const formatFullDate = value => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const DetailRow = ({ icon, label, value, first }) => {
  if (!value) return null;
  return (
    <View style={[styles.detailRow, !first && styles.detailRowDivider]}>
      <View style={styles.detailIconTile}>
        <Ionicons name={icon} size={18} color="#B98CFF" />
      </View>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailSeparator}>:</Text>
      <Text style={styles.detailValue} numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
};

const EventBookingDetailsScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const booking = route?.params?.booking ?? null;

  const detailRoute = useMemo(
    () => ({ params: { eventId: booking?.eventId } }),
    [booking?.eventId],
  );
  const { details } = useEventDetails(detailRoute);

  const eventName = booking?.eventName || details?.name || 'Booking';
  const title = booking?.sessionName || eventName;
  const subtitle =
    booking?.eventName && booking.eventName !== title
      ? booking.eventName
      : booking?.organizerName
      ? `by ${booking.organizerName}`
      : '';

  const daysLeft = getDaysLeft(booking?.startDateTime);
  const dateText = formatFullDate(booking?.startDateTime);
  const timeText = [
    formatTime(booking?.startDateTime),
    formatTime(booking?.endDateTime),
  ]
    .filter(Boolean)
    .join(' - ');

  const location = [details?.venue, details?.city].filter(Boolean).join(', ');
  const language = Array.isArray(details?.language)
    ? details.language.join(', ')
    : details?.language;
  const ageLimit =
    typeof details?.ageLimit === 'number'
      ? `${details.ageLimit} years +`
      : details?.ageLimit;

  const bannerSource = resolveImage(
    booking?.bannerImage || booking?.thumbnailImage || details?.bannerImage,
  );

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);

  const handleCopy = useCallback(() => {
    if (!booking?.bookingNumber) return;
    Clipboard.setString(booking.bookingNumber);
    Toast.show('Booking number copied', Toast.SHORT);
  }, [booking?.bookingNumber]);

  const handleViewTicket = useCallback(() => {
    Toast.show('Your e-ticket will be available soon', Toast.LONG);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      <View style={[styles.header, { paddingTop: (insets.top || 20) + 8 }]}>
        <Pressable
          onPress={handleBack}
          hitSlop={16}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {eventName}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: (insets.bottom || 12) + 96 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.banner}>
          <Image
            source={bannerSource}
            style={styles.bannerImage}
            resizeMode="cover"
          />
        </View>

        {!!daysLeft && (
          <View style={styles.daysPill}>
            <Text style={styles.daysPillText}>{daysLeft}</Text>
          </View>
        )}

        <View style={styles.titleBlock}>
          <Text style={styles.title}>{title}</Text>
          {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>

        {!!booking?.bookingNumber && (
          <View style={styles.bookingPill}>
            <Text style={styles.bookingNumber} numberOfLines={1}>
              {booking.bookingNumber}
            </Text>
            <Pressable
              onPress={handleCopy}
              hitSlop={10}
              style={styles.copyButton}
              accessibilityRole="button"
              accessibilityLabel="Copy booking number"
            >
              <Ionicons name="copy-outline" size={18} color="#B98CFF" />
            </Pressable>
          </View>
        )}

        <AccordionSection title="Details" defaultOpen>
          <View>
            <DetailRow
              icon="calendar-outline"
              label="Date"
              value={dateText}
              first
            />
            <DetailRow icon="time-outline" label="Time" value={timeText} />
            <DetailRow
              icon="location-outline"
              label="Location"
              value={location}
            />
            <DetailRow
              icon="language-outline"
              label="Language"
              value={language}
            />
            <DetailRow
              icon="people-outline"
              label="Age limit"
              value={ageLimit}
            />
          </View>
        </AccordionSection>

        <ArtistList artists={details?.artists} />

        <AccordionSection title="Terms & Conditions">
          {details?.terms ||
            'Terms & conditions for this event will appear here.'}
        </AccordionSection>
      </ScrollView>

      <View
        style={[
          styles.bottomBar,
          { paddingBottom: (insets.bottom || 12) + 12 },
        ]}
      >
        <Pressable
          onPress={handleViewTicket}
          style={({ pressed }) => [
            styles.viewTicketBtn,
            pressed && { opacity: 0.7 },
          ]}
          accessibilityRole="button"
          accessibilityLabel="View ticket, coming soon"
        >
          <Ionicons name="ticket-outline" size={20} color="#B98CFF" />
          <Text style={styles.viewTicketText}>View ticket</Text>
          <Text style={styles.viewTicketHint}>· Coming soon</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default EventBookingDetailsScreen;
