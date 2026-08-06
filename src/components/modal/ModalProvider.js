import React, { useEffect, useMemo, useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';

import { ModalManager } from './ModalManager';

function ModalProvider({ children }) {
  const [portals, setPortals] = useState(() => ModalManager.getSnapshot());

  useEffect(() => {
    const unsubscribe = ModalManager.subscribe(setPortals);
    return unsubscribe;
  }, []);

  const topmostMeta = useMemo(() => {
    for (let i = portals.length - 1; i >= 0; i -= 1) {
      const meta = portals[i].meta;
      if (meta && !meta.disableStatusBarTint) return meta;
    }
    return null;
  }, [portals]);

  return (
    <View style={styles.root} collapsable={false}>
      {children}

      {}
      {topmostMeta && (
        <StatusBar
          backgroundColor={topmostMeta.statusBarBackgroundColor}
          barStyle={topmostMeta.statusBarStyle}
          animated
        />
      )}

      {}
      <View
        style={styles.portalHost}
        pointerEvents="box-none"
        collapsable={false}
      >
        {portals.map(({ id, render, zIndex }) => (
          <View
            key={id}
            style={[styles.portalSlot, { zIndex }]}
            pointerEvents="box-none"
          >
            {render()}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  portalHost: {
    ...StyleSheet.absoluteFillObject,
  },
  portalSlot: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default React.memo(ModalProvider);
