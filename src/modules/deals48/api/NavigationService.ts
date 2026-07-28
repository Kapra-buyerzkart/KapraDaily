// In the standalone 48hrs app this owned the navigation ref. Inside KapraDaily
// the ref belongs to the host's NavigationContainer (App.tsx), so this delegates
// rather than creating a second ref — a module-local ref would never be attached
// and every call through here would silently no-op.
export {
  navigationRef,
  navigate,
  reset,
  replace,
} from '../../../api/NavigationService';

// Where to land the user when their 48hrs session can't be refreshed. The
// module's own login flow is not ported yet, so fall back to the module root;
// point this at the 48hrs login route once that slice lands.
export const AUTH_FALLBACK_ROUTE = 'Deals48';
