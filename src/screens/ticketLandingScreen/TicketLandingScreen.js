import React, { useState, useRef } from 'react';
import {
  Animated,
  StatusBar,
  View,
  ImageBackground,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from './styles';
import ScreenHeader from './components/ScreenHeader';
import CoinBar from './components/CoinBar';
import TabBar from './components/TabBar';
import CardCarousel from './components/CardCarousel';
import VoucherGrid from './components/VoucherGrid';
import UdenTicketModal from './components/UdenTicketModal';
import VoucherBottomSheet from './components/VoucherBottomSheet';

const AnimatedImageBackground =
  Animated.createAnimatedComponent(ImageBackground);

const TicketLandingScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [fadeAnim] = useState(() => new Animated.Value(0));
  const [imageOpacity] = useState(() => new Animated.Value(0));
  const [activeTab, setActiveTab] = useState(0);
  const tabAnim = useRef(new Animated.Value(1)).current;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  const handleImageLoad = () => {
    Animated.timing(imageOpacity, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleTabChange = index => {
    Animated.timing(tabAnim, {
      toValue: 0,
      duration: 120,
      useNativeDriver: true,
    }).start(() => {
      setActiveTab(index);
      Animated.spring(tabAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 80,
        friction: 10,
      }).start();
    });
  };

  const tabContentStyle = {
    opacity: tabAnim,
    transform: [
      {
        translateY: tabAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [10, 0],
        }),
      },
    ],
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <AnimatedImageBackground
        source={require('../../assets/images/movieTicket/ticketLandingBg.png')}
        style={[styles.imageBg, { opacity: imageOpacity }]}
        onLoad={handleImageLoad}
        resizeMode="cover"
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <ScreenHeader navigation={navigation} insets={insets} />
          <CoinBar />
          <View style={styles.tabSeparator} />
          <TabBar activeTab={activeTab} onTabChange={handleTabChange} />
          <Animated.View style={tabContentStyle}>
            {activeTab === 0 ? (
              <CardCarousel
                fadeAnim={fadeAnim}
                onClaim={() => setModalVisible(true)}
              />
            ) : (
              <VoucherGrid onVoucherPress={setSelectedVoucher} />
            )}
          </Animated.View>
        </ScrollView>
      </AnimatedImageBackground>

      <UdenTicketModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
      <VoucherBottomSheet
        visible={!!selectedVoucher}
        voucher={selectedVoucher}
        onClose={() => setSelectedVoucher(null)}
      />
    </View>
  );
};

export default TicketLandingScreen;
