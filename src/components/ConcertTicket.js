import React from 'react';
import { Image, ImageBackground, StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { wp, hp } from '../utils/responsive';
import COLORS from '@/styles/colors';

const ConcertTicket = ({
  eventImage = require('../assets/images/movieTicket/voucher.png'),
  eventTitle = 'PAPON LIVE CONCERT',
  eventCategory = 'Musical concert',
  location = 'Edapally , kochi ,kerala',
  date = 'July 25, monday',
  time = '5:30 pm',
  ticketType = 'Gold Chair',
  seatNo = 'S4',
  ticketId = 'SDFGDH2335BNN',
  qrCodeUri = null,
  qrValue = null,
  style,
}) => {
  const qrSize = wp(20);

  return (
    <View style={[styles.wrapper, style]}>
      <ImageBackground
        source={require('../assets/images/movieTicket/ticketbg.png')}
        style={styles.card}
        imageStyle={styles.cardImage}
        resizeMode="stretch"
      >
        {/* Event thumbnail + title */}
        <View style={styles.headerRow}>
          <Image source={eventImage} style={styles.eventImage} resizeMode="cover" />
          <View style={styles.headerText}>
            <Text style={styles.eventTitle} numberOfLines={2}>
              {eventTitle}
            </Text>
            <Text style={styles.eventCategory}>{eventCategory}</Text>
          </View>
        </View>

        {/* Location */}
        <View style={styles.fieldBlock}>
          <Text style={styles.label}>LOCATION</Text>
          <Text style={styles.value}>{location}</Text>
        </View>

        <View style={styles.divider} />

        {/* Date / Time */}
        <View style={styles.row}>
          <View style={styles.fieldBlock}>
            <Text style={styles.label}>DATE</Text>
            <Text style={styles.value}>{date}</Text>
          </View>
          <View style={styles.fieldBlock}>
            <Text style={styles.label}>TIME</Text>
            <Text style={styles.value}>{time}</Text>
          </View>
        </View>

        {/* Ticket type / Seat no */}
        <View style={styles.row}>
          <View style={styles.fieldBlock}>
            <Text style={styles.label}>TICKET TYPE</Text>
            <Text style={styles.value}>{ticketType}</Text>
          </View>
          <View style={styles.fieldBlock}>
            <Text style={styles.label}>SEAT NO</Text>
            <Text style={styles.value}>{seatNo}</Text>
          </View>
        </View>

        {/* Ticket id + QR */}
        <View style={[styles.row, styles.footerRow]}>
          <View style={styles.fieldBlock}>
            <Text style={styles.label}>TICKET ID</Text>
            <Text style={styles.value}>{ticketId}</Text>
          </View>
          {qrCodeUri ? (
            <Image
              source={{ uri: qrCodeUri }}
              style={{ width: qrSize, height: qrSize }}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.qrBox}>
              <QRCode value={qrValue || ticketId} size={qrSize} />
            </View>
          )}
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    paddingHorizontal: wp(5),
    paddingVertical: hp(2.5),
  },
  cardImage: {
    borderRadius: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  eventImage: {
    width: wp(16),
    height: wp(16),
    borderRadius: 10,
    marginRight: wp(3.5),
  },
  headerText: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontFamily: 'Gilroy-Bold',
    color: COLORS.textPrimary,
  },
  eventCategory: {
    fontSize: 13,
    fontFamily: 'Gilroy-Medium',
    color: COLORS.textMuted,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: hp(1.8),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(2),
  },
  footerRow: {
    alignItems: 'center',
    marginBottom: 0,
  },
  fieldBlock: {
    flex: 1,
  },
  label: {
    fontSize: 11,
    fontFamily: 'Gilroy-Medium',
    color: COLORS.textMuted,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    fontFamily: 'Gilroy-Bold',
    color: COLORS.textPrimary,
  },
  qrBox: {
    backgroundColor: COLORS.white,
    padding: 2,
    borderRadius: 4,
  },
});

export default ConcertTicket;
