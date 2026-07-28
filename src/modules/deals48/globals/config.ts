// 48hrs Deals runs against its own backend, separate from KapraDaily's
// core.kapradaily.com. Keep these values here — importing the host app's
// src/globals/config would silently point this module at the wrong API.
const CONFIG = {
  siteUrl: `https://kapradaily.com/`,
  base_url: `https://kshopecore.kapradaily.com/api/v1/`,
  image_base_url: `https://kshadmin.kapradaily.com/`,
  phone_length: 10,
  referalUrl: `https://kshonboarding.kapradaily.com/`,
};

export default CONFIG;
