// Public surface of the 48hrs Deals module. The host app should import only
// from here — everything under this directory is internal to the module and
// wired to the kshopecore backend, not KapraDaily's.
export { default as Deals48Stack } from './navigation/Deals48Stack';
export { DEALS48_ROUTES } from './navigation/routes';
