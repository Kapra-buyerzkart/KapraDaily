import React from 'react';
import { Controller } from 'react-hook-form';

import AreaDropdown from './AreaDropdown';

const ControlledAreaDropdown = ({ control, name, rules, ...dropdownProps }) => (
  <Controller
    control={control}
    name={name}
    rules={rules}
    render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
      <AreaDropdown
        {...dropdownProps}
        value={value}
        setValue={next =>
          onChange(typeof next === 'function' ? next(value) : next)
        }
        onClose={onBlur}
        error={error?.message}
      />
    )}
  />
);

export default React.memo(ControlledAreaDropdown);
