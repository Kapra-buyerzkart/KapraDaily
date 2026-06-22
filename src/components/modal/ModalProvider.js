import React, { useEffect, useMemo, useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';

import { ModalManager } from './ModalManager';

/**
 * ModalProvider
 *
 * The Portal "host". Mount this exactly once, as close to the root of the
 * app as possible (above NavigationContainer is fine, it doesn't need to be
 * outside GestureHandlerRootView/SafeAreaProvider — just above everything
 * that a modal might need to render on top of).
 *
 * It does not know anything about individual modals — it simply asks
 * ModalManager for the current list of portal nodes and renders them in an
 * absolutely-positioned, full-screen View stacked above the rest of the
 * app via zIndex/elevation. Every <CustomModal /> in the tree pushes its
 * actual visual output here instead of rendering in place, which is what
 * makes "render globally above the entire app" work regardless of how
 * deeply nested the <CustomModal /> declaration is.
 */
function ModalProvider({ children }) {
  const [portals, setPortals] = useState(() => ModalManager.getSnapshot());

  useEffect(() => {
    // Subscribe once; ModalManager notifies us on every mount/unmount/
    // reorder so the host re-renders with the latest set of modal nodes.
    const unsubscribe = ModalManager.subscribe(setPortals);
    return unsubscribe;
  }, []);

  // `portals` is already sorted by zIndex (see ModalManager.getSnapshot),
  // so the last entry is the frontmost modal currently on screen.
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

      {/* RN's <StatusBar /> merges with whatever instance is already
          mounted higher up (App.tsx's theme-driven one) and automatically
          restores those props once this one unmounts — so tinting on open
          and "restoring" on close needs no manual bookkeeping here. This is
          also the only way to visually dim the status bar itself: Android
          renders it as a separate opaque OS layer above the app window, so
          no amount of in-JS absolute positioning can paint over it. */}
      {topmostMeta && (
        <StatusBar
          backgroundColor={topmostMeta.statusBarBackgroundColor}
          barStyle={topmostMeta.statusBarStyle}
          animated
        />
      )}

      {/* Portal host layer — sits above `children` (the rest of the app)
          but only intercepts touches where a modal actually renders content,
          since each portal entry controls its own pointerEvents. */}
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
