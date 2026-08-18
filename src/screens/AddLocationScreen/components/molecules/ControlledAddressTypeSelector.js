import React from 'react';
import { Controller } from 'react-hook-form';

import AddressTypeSelector from './AddressTypeSelector';

const ControlledAddressTypeSelector = ({ control, name, rules }) => (
  <Controller
    control={control}
    name={name}
    rules={rules}
    render={({ field: { onChange, value }, fieldState: { error } }) => (
      <AddressTypeSelector
        selected={value}
        onChange={onChange}
        error={error?.message}
      />
    )}
  />
);

export default React.memo(ControlledAddressTypeSelector);
