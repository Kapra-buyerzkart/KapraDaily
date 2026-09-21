import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getTicketDetailsApi } from '../api/supportService';
import { LoaderContext } from '../context/loaderContext';
import StatusModal from '../components/StatusModal';
import {
  LUXURY_COLORS,
  LUXURY_FONTS,
} from './SupportTicketsListScreen/supportLuxuryTheme';

const TicketDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { ticketId } = route.params;
  const { showLoader } = useContext(LoaderContext);
  const [ticket, setTicket] = useState(null);
  const [statusModal, setStatusModal] = useState({
    visible: false,
    title: '',
    message: '',
  });

  const fetchDetails = async () => {
    try {
      showLoader(true);
      const response = await getTicketDetailsApi(ticketId);

      if (response && response.success && response.data) {
        const header = response.data.header;
        if (header && header.status === 'NOT_FOUND') {
          setStatusModal({
            visible: true,
            title: 'Ticket Not Found',
            message: 'The requested support ticket could not be located.',
          });
        } else {
          setTicket(header);
        }
      } else {
        setStatusModal({
          visible: true,
          title: 'Error',
          message: 'Failed to fetch ticket details. Please try again.',
        });
      }
    } catch (error) {
      console.error('Error fetching ticket details:', error);
      setStatusModal({
        visible: true,
        title: 'Error',
        message: 'Something went wrong while fetching ticket details.',
      });
    } finally {
      showLoader(false);
    }
  };

  useEffect(() => {
    fetchDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketId]);

  const getPriorityStyle = priority => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return {
          color: LUXURY_COLORS.danger,
          bg: LUXURY_COLORS.dangerTint,
          border: LUXURY_COLORS.dangerBorder,
        };
      case 'medium':
      case 'urgent':
        return {
          color: LUXURY_COLORS.gold,
          bg: LUXURY_COLORS.goldTint,
          border: LUXURY_COLORS.goldBorder,
        };
      case 'low':
      case 'normal':
        return {
          color: LUXURY_COLORS.emerald,
          bg: LUXURY_COLORS.emeraldTint,
          border: LUXURY_COLORS.emeraldBorder,
        };
      default:
        return {
          color: LUXURY_COLORS.emerald,
          bg: LUXURY_COLORS.emeraldTint,
          border: LUXURY_COLORS.emeraldBorder,
        };
    }
  };

  const getStatusStyle = status => {
    switch (status?.toLowerCase()) {
      case 'open':
        return {
          color: LUXURY_COLORS.emerald,
          bg: LUXURY_COLORS.emeraldTint,
          border: LUXURY_COLORS.emeraldBorder,
        };
      case 'closed':
      case 'resolved':
        return {
          color: '#2C5E43',
          bg: '#EAF4EE',
          border: '#C8E4D3',
        };
      case 'pending':
      case 'in progress':
        return {
          color: LUXURY_COLORS.gold,
          bg: LUXURY_COLORS.goldTint,
          border: LUXURY_COLORS.goldBorder,
        };
      default:
        return {
          color: LUXURY_COLORS.textSecondary,
          bg: LUXURY_COLORS.well,
          border: LUXURY_COLORS.border,
        };
    }
  };

  if (!ticket) return null;

  const priorityStyle = getPriorityStyle(ticket.priority);
  const statusStyle = getStatusStyle(ticket.status);

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Feather name="chevron-left" size={22} color={LUXURY_COLORS.emerald} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ticket Details</Text>
        <View style={{ width: wp('10%') }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topCard}>
          <View style={styles.row}>
            <View style={styles.idTag}>
              <Text style={styles.idTagText}>#{ticket.supportId}</Text>
            </View>
            <View
              style={[
                styles.badge,
                {
                  backgroundColor: statusStyle.bg,
                  borderColor: statusStyle.border,
                },
              ]}
            >
              <Text style={[styles.badgeText, { color: statusStyle.color }]}>
                {ticket.status || 'Open'}
              </Text>
            </View>
          </View>
          <Text style={styles.titleText}>{ticket.title}</Text>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Priority</Text>
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor: priorityStyle.bg,
                    borderColor: priorityStyle.border,
                  },
                ]}
              >
                <Text
                  style={[styles.badgeText, { color: priorityStyle.color }]}
                >
                  {ticket.priority
                    ? ticket.priority.charAt(0).toUpperCase() +
                      ticket.priority.slice(1)
                    : 'Normal'}
                </Text>
              </View>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Submitted On</Text>
              <Text style={styles.dateText}>
                {new Date(
                  ticket.createdOn || ticket.createdAt,
                ).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>

        {ticket.orderId > 0 && (
          <View style={styles.orderCard}>
            <View style={styles.orderIconWell}>
              <Feather
                name="shopping-bag"
                size={18}
                color={LUXURY_COLORS.gold}
              />
            </View>
            <View style={styles.orderCopy}>
              <Text style={styles.orderLabel}>Related Order</Text>
              <Text style={styles.orderText}>
                #{ticket.orderNumber || ticket.orderId}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.contentCard}>
          <Text style={styles.sectionTitle}>Your Message</Text>
          <Text style={styles.messageText}>{ticket.message}</Text>
        </View>

        {ticket.adminReply && (
          <View style={styles.replyCard}>
            <View style={styles.replyHeader}>
              <View style={styles.replyIconWell}>
                <MaterialCommunityIcons
                  name="face-agent"
                  size={18}
                  color={LUXURY_COLORS.gold}
                />
              </View>
              <Text style={styles.replySectionTitle}>Concierge Response</Text>
            </View>
            <Text style={styles.messageText}>{ticket.adminReply}</Text>
            {ticket.replyOn && (
              <Text style={styles.replyDate}>
                {new Date(ticket.replyOn).toLocaleDateString()}
              </Text>
            )}
          </View>
        )}
      </ScrollView>

      <StatusModal
        visible={statusModal.visible}
        type="error"
        title={statusModal.title}
        message={statusModal.message}
        onOk={() => {
          setStatusModal({ ...statusModal, visible: false });
          navigation.goBack();
        }}
      />
    </SafeAreaView>
  );
};

export default TicketDetailsScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: LUXURY_COLORS.canvas,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp('4.5%'),
    paddingVertical: hp('1.6%'),
    backgroundColor: LUXURY_COLORS.canvas,
    borderBottomWidth: 1,
    borderBottomColor: LUXURY_COLORS.border,
  },
  headerTitle: {
    fontFamily: LUXURY_FONTS.heading,
    fontSize: wp('5.6%'),
    color: LUXURY_COLORS.emerald,
  },
  backButton: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('5%'),
    backgroundColor: LUXURY_COLORS.card,
    borderWidth: 1,
    borderColor: LUXURY_COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 3,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  container: {
    paddingHorizontal: wp('4.5%'),
    paddingTop: hp('2%'),
    paddingBottom: hp('4%'),
  },
  topCard: {
    backgroundColor: LUXURY_COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: LUXURY_COLORS.border,
    padding: wp('4%'),
    marginBottom: hp('1.8%'),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
      },
      android: {
        elevation: 1.5,
      },
    }),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('1.2%'),
  },
  idTag: {
    backgroundColor: LUXURY_COLORS.goldTint,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: LUXURY_COLORS.goldBorder,
    paddingHorizontal: wp('2.5%'),
    paddingVertical: 3,
  },
  idTagText: {
    fontFamily: LUXURY_FONTS.bodySemiBold,
    fontSize: wp('3%'),
    color: LUXURY_COLORS.gold,
    letterSpacing: 0.3,
  },
  badge: {
    paddingHorizontal: wp('3%'),
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
  },
  badgeText: {
    fontFamily: LUXURY_FONTS.bodyMedium,
    fontSize: wp('2.8%'),
  },
  titleText: {
    fontFamily: LUXURY_FONTS.bodySemiBold,
    fontSize: wp('4.4%'),
    color: LUXURY_COLORS.textPrimary,
    lineHeight: wp('5.8%'),
    marginBottom: hp('1.6%'),
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: hp('1.2%'),
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: LUXURY_COLORS.borderLight,
  },
  metaItem: {
    flex: 1,
  },
  metaLabel: {
    fontFamily: LUXURY_FONTS.body,
    fontSize: wp('2.8%'),
    color: LUXURY_COLORS.textMuted,
    marginBottom: 4,
  },
  dateText: {
    fontFamily: LUXURY_FONTS.bodyMedium,
    fontSize: wp('3.2%'),
    color: LUXURY_COLORS.textPrimary,
  },
  orderCard: {
    backgroundColor: LUXURY_COLORS.card,
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp('3.5%'),
    borderRadius: 14,
    borderWidth: 1,
    borderColor: LUXURY_COLORS.border,
    marginBottom: hp('1.8%'),
  },
  orderIconWell: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: 10,
    backgroundColor: LUXURY_COLORS.goldTint,
    borderWidth: 1,
    borderColor: LUXURY_COLORS.goldBorder,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('3%'),
  },
  orderCopy: {
    flex: 1,
  },
  orderLabel: {
    fontFamily: LUXURY_FONTS.body,
    fontSize: wp('2.8%'),
    color: LUXURY_COLORS.textMuted,
  },
  orderText: {
    fontFamily: LUXURY_FONTS.bodySemiBold,
    fontSize: wp('3.4%'),
    color: LUXURY_COLORS.emerald,
    marginTop: 1,
  },
  contentCard: {
    backgroundColor: LUXURY_COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: LUXURY_COLORS.border,
    padding: wp('4%'),
    marginBottom: hp('1.8%'),
  },
  sectionTitle: {
    fontFamily: LUXURY_FONTS.bodySemiBold,
    fontSize: wp('3%'),
    color: LUXURY_COLORS.emerald,
    marginBottom: hp('0.8%'),
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  messageText: {
    fontFamily: LUXURY_FONTS.body,
    fontSize: wp('3.4%'),
    color: LUXURY_COLORS.textSecondary,
    lineHeight: wp('5%'),
  },
  replyCard: {
    backgroundColor: LUXURY_COLORS.goldTint,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: LUXURY_COLORS.goldBorder,
    padding: wp('4%'),
    marginBottom: hp('1.8%'),
  },
  replyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('1%'),
  },
  replyIconWell: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: LUXURY_COLORS.white,
    borderWidth: 1,
    borderColor: LUXURY_COLORS.goldBorder,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  replySectionTitle: {
    fontFamily: LUXURY_FONTS.bodySemiBold,
    fontSize: wp('3%'),
    color: LUXURY_COLORS.gold,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  replyDate: {
    fontFamily: LUXURY_FONTS.body,
    fontSize: wp('2.8%'),
    color: LUXURY_COLORS.textMuted,
    alignSelf: 'flex-end',
    marginTop: hp('1%'),
  },
});
