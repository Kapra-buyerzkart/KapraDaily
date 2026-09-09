const findComponent = (addressComponents, type) =>
  addressComponents?.find(c => c.types.includes(type))?.long_name;

const joinParts = (...parts) => parts.filter(Boolean).join(' : ');

const PLUS_CODE = /^[23456789CFGHJMPQRVWX]{4,8}\+[23456789CFGHJMPQRVWX]{2,3}\s*/i;

export const getAddressLine1 = geocodeResult => {
  const components = geocodeResult?.address_components;
  const street = [
    findComponent(components, 'street_number'),
    findComponent(components, 'route'),
  ]
    .filter(Boolean)
    .join(' ');
  if (street) {
    return street;
  }

  const named =
    findComponent(components, 'sublocality_level_2') ||
    findComponent(components, 'sublocality_level_1') ||
    findComponent(components, 'neighborhood') ||
    findComponent(components, 'locality') ||
    findComponent(components, 'administrative_area_level_2');
  if (named) {
    return named;
  }

  const lead = geocodeResult?.formatted_address?.split(',')[0] || '';
  return lead.replace(PLUS_CODE, '').trim();
};

export const getLocalityLine = geocodeResult => {
  const components = geocodeResult?.address_components;
  const sub2 = findComponent(components, 'sublocality_level_2');
  const sub1 = findComponent(components, 'sublocality_level_1');
  const sublocality = findComponent(components, 'sublocality');
  const locality = findComponent(components, 'locality');

  if (sub2 && sub1) {
    return joinParts(sub2, sub1);
  }
  return joinParts(sublocality, locality) || getAddressLine1(geocodeResult);
};

export const getStatePinLine = geocodeResult => {
  const components = geocodeResult?.address_components;
  const state = findComponent(components, 'administrative_area_level_1');
  const pin = findComponent(components, 'postal_code');
  return `${state || ''}  pin : ${pin || ''}`;
};
