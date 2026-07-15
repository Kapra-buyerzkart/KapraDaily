import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from './styles';
import COLORS from '@/styles/colors';
import useEventDetails from './hooks/useEventDetails';
import EventHero from './components/EventHero';
import ClaimBanner from './components/ClaimBanner';
import EventSummaryCard from './components/EventSummaryCard';
import MoreToKnow from './components/MoreToKnow';
import ArtistList from './components/ArtistList';
import EventAccordions from './components/EventAccordions';

const EventDetailsScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { event, loading, details, apiResponse } = useEventDetails(route);

  console.log(apiResponse, 'eventDetails api response========>');
  console.log(details, 'details========>');

  if (loading && !event) {
    return (
      <View style={styles.loader}>
        <StatusBar
          barStyle="light-content"
          translucent
          backgroundColor="transparent"
        />
        <ActivityIndicator color={COLORS.purple} size="large" />
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

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <EventHero
          event={event}
          insets={insets}
          onBack={() => navigation.goBack()}
        />
        <ClaimBanner />
        <EventSummaryCard
          name={details?.name}
          category={details?.category}
          organizer={details?.organizer}
          minPrice={details?.minPrice}
          dateText={details?.dateText}
          timeText={details?.timeText}
          venue={details?.venue}
          city={details?.city}
        />
        <MoreToKnow ageLimit={details?.ageLimit} language={details?.language} />
        <ArtistList artists={details?.artists} />
        <EventAccordions details={details.detailsText} terms={details.terms} />
      </ScrollView>

      <View style={[styles.claimWrap, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity activeOpacity={0.85} style={styles.claimButton}>
          <Text style={styles.claimText}>Claim</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EventDetailsScreen;
