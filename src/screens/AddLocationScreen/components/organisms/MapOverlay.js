import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FloatingIconButton } from '../molecules';
import PlacesSearchBar from './PlacesSearchBar';
import { GUTTER, SPACING } from '../../theme';

const MapOverlay = ({
  searchRef,
  apiKey,
  onPlaceSelected,
  isBusy,
  onBack,
  isHidden,
  onSearchFocus,
  onSearchBlur,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.overlay,
        { top: Math.max(insets.top, SPACING.sm) + SPACING.sm },
        isHidden && styles.hidden,
      ]}
    >
      <View pointerEvents="box-none" style={styles.row}>
        <FloatingIconButton
          icon="arrow-back"
          accessibilityLabel="Go back"
          onPress={onBack}
        />
        <PlacesSearchBar
          searchRef={searchRef}
          apiKey={apiKey}
          onPlaceSelected={onPlaceSelected}
          isBusy={isBusy}
          onFocus={onSearchFocus}
          onBlur={onSearchBlur}
          style={styles.search}
        />
      </View>
    </View>
  );
};

export default React.memo(MapOverlay);

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: GUTTER,
    zIndex: 999,
    elevation: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  search: {
    marginLeft: SPACING.md,
  },
  hidden: {
    display: 'none',
  },
});
