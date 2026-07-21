import React, { useCallback, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  StatusBar,
  ActivityIndicator,
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
import HtmlBody from '@/components/HtmlBody';
import { formatTime, formatPrice } from '@/screens/EventDetailsScreen/utils';
import useEventBookingDetailQuery from '@/queries/useEventBookingDetailQuery';
import logger from '@/utils/logger';
import styles from './styles';

const STATUS_COLORS = {
  confirmed: '#4CD98A',
  completed: '#4CD98A',
  paid: '#4CD98A',
  active: '#4CD98A',
  pending: '#FFC24B',
  cancelled: '#FF6B6B',
  failed: '#FF6B6B',
  expired: '#FF6B6B',
  refunded: '#FF6B6B',
};

const asArray = value => (Array.isArray(value) ? value : []);

const titleCase = value =>
  typeof value === 'string' && value.length
    ? value.charAt(0).toUpperCase() + value.slice(1)
    : '';

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

// Flattens the nested booking-detail response (booking / eventDetails / session
// / bookingItems / tickets / payment) into the shape the UI consumes. The list
// item passed on navigation is used as a fallback so the header/banner render
// instantly while the detail request is in flight.
const buildViewModel = (data, passed) => {
  const p = passed || {};
  const booking = data?.booking || {};
  const eventDetails = data?.eventDetails || {};
  const session = data?.session || {};
  const items = asArray(data?.bookingItems);
  const tickets = asArray(data?.tickets);
  const eventImages = asArray(data?.eventImages);
  const payment = data?.payment || null;

  const bannerImage =
    eventDetails.bannerImage ||
    eventImages.find(img => img?.imageType === 'banner')?.imageUrl ||
    eventImages[0]?.imageUrl ||
    eventDetails.thumbnailImage ||
    p.bannerImage ||
    p.thumbnailImage ||
    null;

  const ticketCount =
    tickets.length ||
    items.reduce((sum, item) => sum + (Number(item?.quantity) || 0), 0);

  return {
    eventId: eventDetails.eventId ?? session.eventId ?? p.eventId ?? null,
    eventName: eventDetails.eventName || p.eventName || '',
    sessionName: session.sessionName || p.sessionName || '',
    organizerName: eventDetails.organizerName || p.organizerName || '',
    bookingNumber: booking.bookingNumber || p.bookingNumber || '',
    statusKey: booking.statusKey || p.statusKey || '',
    paymentStatusKey: booking.paymentStatusKey || p.paymentStatusKey || '',
    startDateTime: session.startDateTime || p.startDateTime || null,
    endDateTime: session.endDateTime || p.endDateTime || null,
    venueName: eventDetails.venueName || p.venueName || '',
    city: eventDetails.city || p.city || '',
    state: eventDetails.state || '',
    language: eventDetails.language ?? p.language ?? null,
    ageLimit: eventDetails.ageLimit ?? p.ageLimit ?? null,
    bannerImage,
    subTotal: booking.subTotal,
    tax: booking.tax,
    bookingFee: booking.bookingFee,
    discount: Number(booking.discount) || 0,
    coinsUsed: Number(booking.coinsUsed) || 0,
    grandTotal: booking.grandTotal ?? p.grandTotal,
    bookedAt: booking.bookedAt || p.bookedAt || null,
    items,
    tickets,
    payment,
    ticketCount,
  };
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

const SummaryRow = ({ label, value, total, muted }) => {
  if (!value && value !== 0) return null;
  return (
    <View style={[styles.summaryRow, total && styles.summaryTotalRow]}>
      <Text style={total ? styles.summaryTotalLabel : styles.summaryLabel}>
        {label}
      </Text>
      <Text
        style={[
          total ? styles.summaryTotalValue : styles.summaryValue,
          muted && styles.summaryValueMuted,
        ]}
        numberOfLines={1}
      >
        {value}
      </Text>
    </View>
  );
};

const EventBookingDetailsScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const passed = route?.params?.booking ?? null;
  const bookingId =
    route?.params?.bookingId ?? passed?.bookingId ?? passed?.id ?? null;

  const { data, isLoading, isError, error, refetch } =
    useEventBookingDetailQuery(bookingId);

  const vm = useMemo(() => buildViewModel(data, passed), [data, passed]);

  useEffect(() => {
    if (data) {
      logger.log(
        '[EventBookingDetails] bookingId:',
        bookingId,
        'response:',
        data,
      );
    }
  }, [data, bookingId]);

  useEffect(() => {
    if (isError) {
      logger.error('[EventBookingDetails] fetch failed:', error?.message);
    }
  }, [isError, error]);

  // Artists + terms aren't part of the booking response, so keep pulling them
  // from the event-details endpoint using the resolved eventId.
  const detailRoute = useMemo(
    () => ({ params: { eventId: vm.eventId } }),
    [vm.eventId],
  );
  const { details } = useEventDetails(detailRoute);

  const eventName = vm.eventName || details?.name || 'Booking';
  const title = vm.sessionName || eventName;
  const subtitle =
    vm.eventName && vm.eventName !== title
      ? vm.eventName
      : vm.organizerName
      ? `by ${vm.organizerName}`
      : '';

  const daysLeft = getDaysLeft(vm.startDateTime);
  const dateText = formatFullDate(vm.startDateTime);
  const timeText = [formatTime(vm.startDateTime), formatTime(vm.endDateTime)]
    .filter(Boolean)
    .join(' - ');

  const location = [vm.venueName, vm.city, vm.state].filter(Boolean).join(', ');
  const language = Array.isArray(vm.language)
    ? vm.language.join(', ')
    : vm.language;
  const ageLimit =
    typeof vm.ageLimit === 'number' ? `${vm.ageLimit} years +` : vm.ageLimit;

  const statusColor =
    STATUS_COLORS[String(vm.statusKey).toLowerCase()] || '#C9A6FF';

  const bannerSource = resolveImage(vm.bannerImage);

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);

  const handleCopy = useCallback(() => {
    if (!vm.bookingNumber) return;
    Clipboard.setString(vm.bookingNumber);
    Toast.show('Booking number copied', Toast.SHORT);
  }, [vm.bookingNumber]);

  const handleViewTicket = useCallback(() => {
    navigation.navigate('ViewTicketScreen', {
      booking: {
        ...(passed || {}),
        bookingId,
        bookingNumber: vm.bookingNumber,
        eventName: vm.eventName,
        sessionName: vm.sessionName,
        startDateTime: vm.startDateTime,
        endDateTime: vm.endDateTime,
      },
      tickets: vm.tickets,
      bookingItems: vm.items,
    });
  }, [navigation, passed, bookingId, vm]);

  const hasPricing =
    vm.subTotal != null ||
    vm.tax != null ||
    vm.bookingFee != null ||
    vm.grandTotal != null;

  const renderHeader = () => (
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
  );

  // Edge case: navigated without an identifiable booking.
  if (!bookingId) {
    return (
      <View style={styles.container}>
        <StatusBar
          barStyle="light-content"
          translucent
          backgroundColor="transparent"
        />
        {renderHeader()}
        <View style={styles.stateWrap}>
          <Ionicons name="alert-circle-outline" size={40} color="#B98CFF" />
          <Text style={styles.stateText}>We couldn't find this booking.</Text>
        </View>
      </View>
    );
  }

  // Edge case: first load with nothing to show yet.
  if (isLoading && !data && !passed) {
    return (
      <View style={styles.container}>
        <StatusBar
          barStyle="light-content"
          translucent
          backgroundColor="transparent"
        />
        {renderHeader()}
        <View style={styles.stateWrap}>
          <ActivityIndicator size="large" color="#B98CFF" />
        </View>
      </View>
    );
  }

  // Edge case: request failed and there's no fallback data to fall back on.
  if (isError && !data && !passed) {
    return (
      <View style={styles.container}>
        <StatusBar
          barStyle="light-content"
          translucent
          backgroundColor="transparent"
        />
        {renderHeader()}
        <View style={styles.stateWrap}>
          <Ionicons name="cloud-offline-outline" size={40} color="#B98CFF" />
          <Text style={styles.stateText}>
            {error?.message || 'Failed to load booking details.'}
          </Text>
          <Pressable
            onPress={() => refetch()}
            style={styles.retryBtn}
            accessibilityRole="button"
            accessibilityLabel="Retry"
          >
            <Text style={styles.retryText}>Try again</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      {renderHeader()}

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
          {!!vm.statusKey && (
            <View style={[styles.statusChip, { borderColor: statusColor }]}>
              <Text style={[styles.statusChipText, { color: statusColor }]}>
                {titleCase(vm.statusKey)}
              </Text>
            </View>
          )}
        </View>

        {!!vm.bookingNumber && (
          <View style={styles.bookingPill}>
            <Text style={styles.bookingNumber} numberOfLines={1}>
              {vm.bookingNumber}
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
            <DetailRow
              icon="pricetag-outline"
              label="Booked on"
              value={formatFullDate(vm.bookedAt)}
            />
            {!!details?.detailsText && (
              <View style={styles.detailHtml}>
                <ScrollView
                  style={styles.detailHtmlScroll}
                  nestedScrollEnabled
                  showsVerticalScrollIndicator
                >
                  <HtmlBody html={details.detailsText} />
                </ScrollView>
              </View>
            )}
          </View>
        </AccordionSection>

        {vm.items.length > 0 && (
          <AccordionSection
            title={`Tickets${vm.ticketCount ? ` (${vm.ticketCount})` : ''}`}
            defaultOpen
          >
            <View>
              {vm.items.map((item, index) => (
                <View
                  key={item.bookingItemId ?? item.ticketCategoryId ?? index}
                  style={[styles.itemRow, index > 0 && styles.itemRowDivider]}
                >
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName} numberOfLines={1}>
                      {item.categoryName || 'Ticket'}
                    </Text>
                    <Text style={styles.itemMeta}>
                      {`${item.quantity || 1} × ${
                        formatPrice(item.unitPrice) || '—'
                      }`}
                    </Text>
                  </View>
                  <Text style={styles.itemPrice}>
                    {formatPrice(item.total ?? item.subTotal)}
                  </Text>
                </View>
              ))}

              {vm.tickets.length > 0 && (
                <View style={styles.ticketNumbers}>
                  {vm.tickets.map(ticket => (
                    <View key={ticket.ticketId} style={styles.ticketNumberRow}>
                      <Ionicons
                        name={
                          ticket.checkedInAt
                            ? 'checkmark-circle'
                            : 'ticket-outline'
                        }
                        size={14}
                        color={ticket.checkedInAt ? '#4CD98A' : '#B98CFF'}
                      />
                      <Text style={styles.ticketNumberText} numberOfLines={1}>
                        {ticket.ticketNumber}
                      </Text>
                      <Text style={styles.ticketNumberStatus}>
                        {ticket.checkedInAt
                          ? 'Checked in'
                          : titleCase(ticket.statusKey)}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </AccordionSection>
        )}

        {hasPricing && (
          <AccordionSection title="Payment summary">
            <View>
              <SummaryRow label="Subtotal" value={formatPrice(vm.subTotal)} />
              <SummaryRow label="Tax" value={formatPrice(vm.tax)} />
              <SummaryRow
                label="Booking fee"
                value={formatPrice(vm.bookingFee)}
              />
              {vm.discount > 0 && (
                <SummaryRow
                  label="Discount"
                  value={`- ${formatPrice(vm.discount)}`}
                  muted
                />
              )}
              {vm.coinsUsed > 0 && (
                <SummaryRow
                  label="Coins used"
                  value={`- ${formatPrice(vm.coinsUsed)}`}
                  muted
                />
              )}
              <SummaryRow
                label="Total paid"
                value={formatPrice(vm.grandTotal)}
                total
              />
              {!!vm.payment && (
                <View style={styles.paymentMeta}>
                  <SummaryRow
                    label="Method"
                    value={
                      vm.payment.paymentGateway?.toLowerCase() === 'razorpay'
                        ? 'Online'
                        : titleCase(vm.payment.paymentGateway)
                    }
                  />
                  <SummaryRow
                    label="Transaction"
                    value={vm.payment.transactionId}
                  />
                  <SummaryRow
                    label="Paid on"
                    value={formatFullDate(vm.payment.paidAt)}
                  />
                </View>
              )}
            </View>
          </AccordionSection>
        )}

        <ArtistList artists={details?.artists} />

        <AccordionSection
          title="Terms & Conditions"
          maxHeight={details?.terms ? 280 : undefined}
        >
          {details?.terms ? (
            <HtmlBody html={details.terms} />
          ) : (
            'Terms & conditions for this event will appear here.'
          )}
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
          accessibilityLabel="View ticket"
        >
          <Ionicons name="ticket-outline" size={20} color="#B98CFF" />
          <Text style={styles.viewTicketText}>View ticket</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default EventBookingDetailsScreen;
