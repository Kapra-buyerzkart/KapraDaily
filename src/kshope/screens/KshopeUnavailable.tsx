import React, { useContext, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { AppContext } from '../../context/appContext';
import { Fonts } from '../theme/fonts';
import { s, fs, HOME_COLORS, RADIUS, SPACE } from './Home/redesign/theme';

const HEADER_ART = require('../../assets/images/modal/48hrImage.png');
const DEAL_ICON = require('../../assets/images/modal/48hrDealIcon.png');

const KshopeUnavailable: React.FC = () => {
  const { logout } = useContext(AppContext) || {};
  const forcedRef = useRef(false);

  useEffect(() => {
    if (forcedRef.current) return;
    forcedRef.current = true;
    logout?.(true);
  }, [logout]);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={HOME_COLORS.orange} />
      <LinearGradient
        colors={[HOME_COLORS.orange, HOME_COLORS.orangeSoft]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}>
        <Image source={HEADER_ART} style={styles.headerArt} resizeMode="contain" />
      </LinearGradient>

      <View style={styles.sheet}>
        <View style={styles.badge}>
          <Image source={DEAL_ICON} style={styles.badgeIcon} resizeMode="contain" />
        </View>

        <Text style={styles.title}>Session expired</Text>
        <Text style={styles.body}>
          Log in again to unlock 48hrs Deals{'\n'}and keep shopping at deal prices.
        </Text>

        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.button}
          onPress={() => logout?.(true)}>
          <Text style={styles.buttonLabel}>Log in again</Text>
        </TouchableOpacity>

        <Text style={styles.footnote}>Deals refresh every 48 hours</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: HOME_COLORS.white },
  header: {
    height: s(300),
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: s(36),
    borderBottomRightRadius: s(36),
    overflow: 'hidden',
  },
  headerArt: { width: '78%', height: '70%' },
  sheet: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: s(28),
    marginTop: -s(28),
    paddingTop: s(44),
    backgroundColor: HOME_COLORS.white,
    borderTopLeftRadius: s(28),
    borderTopRightRadius: s(28),
  },
  badge: {
    position: 'absolute',
    top: -s(28),
    width: s(56),
    height: s(56),
    borderRadius: s(28),
    backgroundColor: HOME_COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: HOME_COLORS.cardBorder,
  },
  badgeIcon: { width: s(30), height: s(30) },
  title: {
    fontFamily: Fonts.lexend.semiBold,
    fontSize: fs(22),
    color: HOME_COLORS.heading,
    marginBottom: SPACE.sm,
  },
  body: {
    fontFamily: Fonts.lexend.regular,
    fontSize: fs(14),
    lineHeight: fs(22),
    color: HOME_COLORS.muted,
    textAlign: 'center',
    marginBottom: s(28),
  },
  button: {
    alignSelf: 'stretch',
    height: s(52),
    borderRadius: RADIUS.pill,
    backgroundColor: HOME_COLORS.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLabel: {
    fontFamily: Fonts.lexend.semiBold,
    fontSize: fs(15),
    color: HOME_COLORS.white,
  },
  footnote: {
    fontFamily: Fonts.lexend.regular,
    fontSize: fs(12),
    color: HOME_COLORS.placeholder,
    marginTop: SPACE.lg,
  },
});

export default KshopeUnavailable;
