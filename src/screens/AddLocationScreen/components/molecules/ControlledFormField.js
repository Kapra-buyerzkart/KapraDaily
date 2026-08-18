import React from 'react';
import { Controller } from 'react-hook-form';

import FormField from './FormField';

const ControlledFormField = ({ control, name, rules, ...fieldProps }) => (
  <Controller
    control={control}
    name={name}
    rules={rules}
    render={({
      field: { onChange, onBlur, value, ref },
      fieldState: { error },
    }) => (
      <FormField
        {...fieldProps}
        ref={ref}
        value={value}
        onChangeText={onChange}
        onBlur={onBlur}
        error={error?.message}
      />
    )}
  />
);

export default React.memo(ControlledFormField);
