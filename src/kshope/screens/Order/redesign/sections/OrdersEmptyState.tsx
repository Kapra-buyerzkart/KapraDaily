import React from 'react';
import {
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import { Fonts } from '../../../../theme/fonts';
import { pt } from '../../../../theme/tokens';
import { ORDER_COLORS } from './theme';

interface OrdersEmptyStateProps {
  onExplore: () => void;
  onWishlist: () => void;
  onBookConsultation: () => void;
}

const OrdersEmptyState: React.FC<OrdersEmptyStateProps> = ({
  onExplore,
  onWishlist,
  onBookConsultation,
}) => {
  const handleChatWithUs = () => {
    const phone = '+919746300000';
    const text = encodeURIComponent(
      'Hi, I would like assistance with Kapra jewellery collection.',
    );
    Linking.openURL(`whatsapp://send?phone=${phone}&text=${text}`).catch(() => {
      Linking.openURL(`https://wa.me/${phone}?text=${text}`).catch(() => {});
    });
  };

  return (
    <View style={styles.container}>
      {/* ─── Main Hero Empty Card ─── */}
      <View style={styles.heroCard}>
        {/* Open velvet jewellery box image */}
        <View style={styles.imageContainer}>
          <Image
            source={require('../../../../assets/images/orders/empty_orders_box.jpg')}
            style={styles.heroImage}
            resizeMode="cover"
          />
        </View>

        {/* Title */}
        <Text style={styles.title}>No Orders Placed Yet</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Your jewellery box is currently awaiting its first precious treasure.
          Explore our handcrafted collections or book an exclusive salon
          consultation.
        </Text>

        {/* Primary CTA */}
        <TouchableOpacity
          testID="orders-empty-explore-btn"
          style={styles.primaryBtn}
          onPress={onExplore}
          activeOpacity={0.88}
        >
          <Text style={styles.primaryBtnText}>Start Exploring Collections</Text>
          <Feather
            name="arrow-right"
            size={16}
            color="#FFFFFF"
            style={styles.primaryBtnArrow}
          />
        </TouchableOpacity>

        {/* Secondary CTAs */}
        <View style={styles.secondaryRow}>
          <TouchableOpacity
            testID="orders-empty-wishlist-btn"
            style={styles.secondaryBtn}
            onPress={onWishlist}
            activeOpacity={0.82}
          >
            <Text style={styles.secondaryBtnText}>View My Wishlist</Text>
          </TouchableOpacity>

          <TouchableOpacity
            testID="orders-empty-consult-btn"
            style={[styles.secondaryBtn, styles.consultBtn]}
            onPress={onBookConsultation}
            activeOpacity={0.82}
          >
            <Text style={styles.secondaryBtnText}>Book Consultation</Text>
          </TouchableOpacity>
        </View>
      </View>


      {/* ─── Need Help finding something special? (Gemologist Banner) ─── */}
      <View style={styles.gemologistBanner}>
        <View style={styles.gemologistIconCircle}>
          <Ionicons
            name="diamond-outline"
            size={20}
            color={ORDER_COLORS.darkGreen}
          />
        </View>
        <View style={styles.gemologistTextWrap}>
          <Text style={styles.gemologistTitle}>
            Need help finding something special?
          </Text>
          <Text style={styles.gemologistSubtitle}>
            Our gemologists are here to assist you.
          </Text>
        </View>
        <TouchableOpacity
          testID="orders-empty-chat-btn"
          style={styles.chatBtn}
          onPress={handleChatWithUs}
          activeOpacity={0.85}
        >
          <Text style={styles.chatBtnText}>Chat with Us</Text>
          <Feather
            name="chevron-right"
            size={14}
            color={ORDER_COLORS.darkGreen}
          />
        </TouchableOpacity>
      </View>

      {/* ─── Trust Badges ─── */}
      <View style={styles.trustStrip}>
        <View style={styles.trustItem}>
          <Text style={styles.trustSparkle}>✦</Text>
          <Text style={styles.trustTitle}>100% BIS</Text>
          <Text style={styles.trustSubtitle}>Hallmarked</Text>
        </View>

        <View style={styles.trustDivider} />

        <View style={styles.trustItem}>
          <Ionicons
            name="shield-checkmark"
            size={13}
            color="#A83232"
            style={styles.trustIcon}
          />
          <Text style={styles.trustTitle}>Insured</Text>
          <Text style={styles.trustSubtitle}>Free Delivery</Text>
        </View>

        <View style={styles.trustDivider} />

        <View style={styles.trustItem}>
          <MaterialCommunityIcons
            name="infinity"
            size={16}
            color="#B59458"
            style={styles.trustIcon}
          />
          <Text style={styles.trustTitle}>Lifetime</Text>
          <Text style={styles.trustSubtitle}>Exchange</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 12,
    paddingBottom: 28,
  },
  /* ─── Hero Card ─── */
  heroCard: {
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#ECEAE5',
    paddingVertical: 26,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  imageContainer: {
    width: 156,
    height: 156,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#EFEAE1',
    overflow: 'hidden',
    backgroundColor: '#F9F7F3',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontFamily: Fonts.cormorantGaramond.semiBold,
    fontSize: pt(23),
    lineHeight: pt(29),
    color: ORDER_COLORS.darkGreen,
    letterSpacing: -0.3,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: Fonts.lexend.regular,
    fontSize: pt(12),
    lineHeight: pt(18),
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 10,
    marginBottom: 22,
  },
  primaryBtn: {
    width: '100%',
    height: 48,
    borderRadius: 24,
    backgroundColor: ORDER_COLORS.darkGreen,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: ORDER_COLORS.darkGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryBtnText: {
    fontFamily: Fonts.lexend.medium,
    fontSize: pt(13),
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  primaryBtnArrow: {
    marginLeft: 8,
  },
  secondaryRow: {
    width: '100%',
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  secondaryBtn: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2DDD5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  consultBtn: {
    borderColor: '#C5A869',
  },
  secondaryBtnText: {
    fontFamily: Fonts.lexend.medium,
    fontSize: pt(12),
    color: '#1B2A24',
  },



  /* ─── Gemologist Banner ─── */
  gemologistBanner: {
    marginHorizontal: 16,
    marginTop: 18,
    backgroundColor: '#EDF5EE',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#D7E7D9',
    paddingVertical: 14,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  gemologistIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D5E6D8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gemologistTextWrap: {
    flex: 1,
    marginHorizontal: 10,
  },
  gemologistTitle: {
    fontFamily: Fonts.cormorantGaramond.semiBold,
    fontSize: pt(15),
    lineHeight: pt(19),
    color: ORDER_COLORS.darkGreen,
    letterSpacing: -0.2,
  },
  gemologistSubtitle: {
    fontFamily: Fonts.lexend.regular,
    fontSize: pt(10),
    lineHeight: pt(14),
    color: '#4A695C',
    marginTop: 2,
  },
  chatBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D2E4D5',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
    gap: 2,
  },
  chatBtnText: {
    fontFamily: Fonts.lexend.medium,
    fontSize: pt(11),
    color: ORDER_COLORS.darkGreen,
  },

  /* ─── Trust Strip ─── */
  trustStrip: {
    marginHorizontal: 16,
    marginTop: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ECEAE5',
    paddingVertical: 14,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  trustItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  trustSparkle: {
    color: '#C5A869',
    fontSize: 12,
    marginBottom: 3,
  },
  trustIcon: {
    marginBottom: 3,
  },
  trustTitle: {
    fontFamily: Fonts.lexend.semiBold,
    fontSize: pt(10),
    lineHeight: pt(13),
    color: '#1A1A1A',
  },
  trustSubtitle: {
    fontFamily: Fonts.lexend.regular,
    fontSize: pt(9),
    lineHeight: pt(12),
    color: '#8A8D93',
    marginTop: 1,
  },
  trustDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#ECEAE5',
  },
});

export default React.memo(OrdersEmptyState);
