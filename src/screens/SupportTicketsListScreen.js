import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import icons from '@/assets/icons';
import { useNavigation } from '@react-navigation/native';
import { FONTS } from '../styles/typography';
import { getSupportTicketsApi } from '../api/supportService';
import { LoaderContext } from '../context/loaderContext';

const SupportTicketsListScreen = () => {
  const navigation = useNavigation();
  const { showLoader } = useContext(LoaderContext);
  const [tickets, setTickets] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTickets = async (isRefreshing = false) => {
    try {
      if (!isRefreshing) showLoader(true);
      const response = await getSupportTicketsApi();
      if (response && response.data) {
        setTickets(Array.isArray(response.data) ? response.data : []);
      } else if (response && Array.isArray(response)) {
        setTickets(response);
      }
    } catch (error) {
      console.error('Error fetching support tickets:', error);
    } finally {
      showLoader(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTickets(true);
  };

  const getPriorityColor = priority => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return '#EB5757';
      case 'medium':
        return '#F2994A';
      case 'low':
        return '#27AE60';
      default:
        return '#6B7280';
    }
  };

  const getStatusColor = status => {
    switch (status?.toLowerCase()) {
      case 'open':
        return '#2F80ED';
      case 'closed':
        return '#27AE60';
      case 'pending':
        return '#F2C94C';
      default:
        return '#6B7280';
    }
  };

  const renderTicketItem = ({ item }) => (
    <TouchableOpacity
      style={styles.ticketCard}
      onPress={() =>
        navigation.navigate('TicketDetailsScreen', { ticketId: item.supportId })
      }
    >
      <View style={styles.cardHeader}>
        <Text style={styles.ticketId}>ID: Ticket #{item.supportId}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) + '15' },
          ]}
        >
          <Text
            style={[styles.statusText, { color: getStatusColor(item.status) }]}
          >
            {item.status || 'Open'}
          </Text>
        </View>
      </View>
      <View style={styles.titleRow}>
        <Text style={styles.ticketTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <View style={styles.viewHistoryContainer}>
          <Text style={styles.viewHistoryText}>View Details</Text>
          <AntDesign name="right" size={wp('3%')} color="#F25000" />
        </View>
      </View>
      {item?.message && (
        <Text style={styles.ticketMessage} numberOfLines={1}>
          {item.message}
        </Text>
      )}
      <View style={styles.cardFooter}>
        <View style={styles.priorityRow}>
          <View
            style={[
              styles.priorityDot,
              { backgroundColor: getPriorityColor(item.priority) },
            ]}
          />
          <Text style={styles.priorityText}>
            {item.priority?.charAt(0).toUpperCase() + item.priority?.slice(1)}
          </Text>
        </View>

        <Text style={styles.dateText}>
          {new Date(item.createdOn || item.createdAt).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.header}>
        <TouchableOpacity
          hitSlop={40}
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Image
            source={icons.backArrowNew}
            style={{
              resizeMode: 'contain',
              tintColor: '#000',
            }}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Support Tickets</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('SupportTicketScreen')}
          style={styles.addButton}
        >
          <AntDesign name="pluscircle" size={wp('7%')} color="#F25000" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={tickets}
        renderItem={renderTicketItem}
        keyExtractor={item => item.supportId.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Image
              source={require('../assets/images/head_phone.png')}
              style={styles.emptyImage}
            />
            <Text style={styles.emptyText}>No tickets found</Text>
            <TouchableOpacity
              style={styles.raiseButton}
              onPress={() => navigation.navigate('SupportTicketScreen')}
            >
              <Text style={styles.raiseButtonText}>Raise a Ticket</Text>
            </TouchableOpacity>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#F25000']}
          />
        }
      />
    </SafeAreaView>
  );
};

export default SupportTicketsListScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('2%'),
    backgroundColor: '#FFF',
  },
  headerTitle: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('5%'),
    color: '#000',
  },
  backButton: {
    padding: wp('1%'),
  },
  addButton: {
    padding: wp('1%'),
  },
  listContainer: {
    padding: wp('5%'),
    paddingBottom: hp('5%'),
  },
  ticketCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: wp('4%'),
    marginBottom: hp('1.5%'),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('1%'),
  },
  ticketId: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.2%'),
    color: '#7D7D7D',
  },
  statusBadge: {
    paddingHorizontal: wp('2.5%'),
    paddingVertical: hp('0.3%'),
    borderRadius: 20,
  },
  statusText: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('2.8%'),
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp('1%'),
    gap: wp('2%'),
  },
  ticketTitle: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3.8%'),
    color: '#000',
    flex: 1,
  },
  ticketMessage: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3.4%'),
    color: '#616161',
    marginBottom: hp('1.5%'),
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: hp('1%'),
  },
  priorityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityDot: {
    width: wp('2%'),
    height: wp('2%'),
    borderRadius: wp('1%'),
    marginRight: wp('1.5%'),
  },
  priorityText: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('3.2%'),
    color: '#4F4F4F',
  },
  dateText: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3%'),
    color: '#9E9E9E',
  },
  viewHistoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('1%'),
    backgroundColor: '#F2500010',
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('0.3%'),
    borderRadius: 4,
  },
  viewHistoryText: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('2.8%'),
    color: '#F25000',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp('20%'),
  },
  emptyImage: {
    width: wp('20%'),
    height: wp('20%'),
    opacity: 0.5,
    marginBottom: hp('2%'),
    tintColor: '#DADADA',
  },
  emptyText: {
    fontFamily: FONTS.gilroy.medium,
    fontSize: wp('4%'),
    color: '#7D7D7D',
    marginBottom: hp('3%'),
  },
  raiseButton: {
    backgroundColor: '#F25000',
    paddingHorizontal: wp('8%'),
    paddingVertical: hp('1.5%'),
    borderRadius: 10,
  },
  raiseButtonText: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: wp('3.8%'),
    color: '#FFF',
  },
});
