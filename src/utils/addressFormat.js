const findComponent = (addressComponents, type) =>
  addressComponents?.find(c => c.types.includes(type))?.long_name;

export const getLocalityLine = geocodeResult => {
  const components = geocodeResult?.address_components;
  const sub2 = findComponent(components, 'sublocality_level_2');
  const sub1 = findComponent(components, 'sublocality_level_1');
  const sublocality = findComponent(components, 'sublocality');
  const locality = findComponent(components, 'locality');

  if (sub2 && sub1) {
    return `${sub2} : ${sub1}`;
  }
  return `${sublocality || ''} : ${locality || ''}`;
};

export const getStatePinLine = geocodeResult => {
  const components = geocodeResult?.address_components;
  const state = findComponent(components, 'administrative_area_level_1');
  const pin = findComponent(components, 'postal_code');
  return `${state || ''}  pin : ${pin || ''}`;
};
