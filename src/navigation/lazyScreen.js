import React from 'react';

/**
 * Defers a screen module's execution until that screen actually renders.
 *
 * Why this exists
 * ---------------
 * Metro already ships `inlineRequires: true`, which rewrites top-level imports
 * into requires placed at the point of first use. That normally makes a large
 * static import list free. It does NOT help a navigator, because
 *
 *     <Stack.Screen name="Foo" component={FooScreen} />
 *
 * dereferences `FooScreen` while building the element tree, which fires the
 * inlined require immediately. So on RootNavigator's very first render every
 * screen module in the app executes — every StyleSheet.create, every wp()/hp()
 * layout computation, and transitively every component, icon set and service
 * those screens import — even though exactly one route is on screen.
 *
 * Passing `lazyScreen(() => require('...'))` instead hands the navigator a
 * stable wrapper component whose module is required on first *render*.
 *
 * `require()` is synchronous in Metro, so unlike React.lazy there is no
 * promise, no Suspense boundary and no fallback frame: the screen mounts in the
 * same tick it always did. The module is cached by Metro after the first call,
 * so re-navigating costs nothing.
 *
 * @param {() => any} req - `() => require('../screens/Foo')`
 * @returns {React.ComponentType} stable component; safe as a `component` prop
 */
export default function lazyScreen(req) {
  let Resolved = null;

  function LazyScreen(props) {
    if (Resolved === null) {
      const mod = req();
      // Support both `export default` and CommonJS `module.exports =`.
      Resolved = mod && mod.__esModule ? mod.default : mod;
    }
    return <Resolved {...props} />;
  }

  return LazyScreen;
}

/**
 * Same as `lazyScreen`, for modules that expose the screen as a named export
 * (e.g. `export const Deals48Stack = ...`).
 */
export function lazyNamedScreen(req, exportName) {
  let Resolved = null;

  function LazyNamedScreen(props) {
    if (Resolved === null) Resolved = req()[exportName];
    return <Resolved {...props} />;
  }

  return LazyNamedScreen;
}
