import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ServiceTile } from '../molecules';
import { SPACING, TILE_ART } from '../theme';

const ServiceGrid = ({
  sources,
  openKapra,
  openKshope,
  openTickets,
  openD2c,
}) => (
  <View style={styles.grid}>
    <Animated.View entering={FadeInDown.duration(360)}>
      <ServiceTile
        span="wide"
        source={sources.kapra}
        label="Uden Deal"
        caption="Groceries in 20 minutes"
        onPress={openKapra}
      />
    </Animated.View>

    <Animated.View entering={FadeInDown.delay(70).duration(360)}>
      <ServiceTile
        span="wide"
        source={sources.kshope}
        label="48 hrs deal"
        caption="Electronics and more"
        onPress={openKshope}
      />
    </Animated.View>

    <Animated.View
      entering={FadeInDown.delay(140).duration(360)}
      style={styles.splitRow}
    >
      <View style={styles.splitCell}>
        <ServiceTile
          span="half"
          art={TILE_ART.tickets}
          source={sources.tickets}
          label="Uden Tickets"
          caption="Movies and events"
          onPress={openTickets}
        />
      </View>

      <View style={styles.splitCell}>
        <ServiceTile
          span="half"
          art={TILE_ART.d2c}
          source={sources.d2c}
          label="D2C"
          caption="Premium brands"
          onPress={openD2c}
        />
      </View>
    </Animated.View>
  </View>
);

export default React.memo(ServiceGrid);

const styles = StyleSheet.create({
  grid: {
    width: '100%',
    paddingHorizontal: SPACING.xl,
    gap: SPACING.xl,
  },
  splitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.lg,
  },
  splitCell: {
    flex: 1,
  },
});
