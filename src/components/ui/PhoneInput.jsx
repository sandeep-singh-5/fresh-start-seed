import React from 'react';
import InputMask from 'react-input-mask';
import { Input } from './input.jsx';

const PhoneInput = React.forwardRef(({ value, onChange, ...props }, ref) => {
  const handleChange = (event) => {
    if (onChange) {
      onChange(event.target.value); 
    }
  };

  return (
    <InputMask
      mask="(999) 999-9999"
      value={value}
      onChange={handleChange} 
      disabled={false}
      maskChar=" "
    >
      {(inputProps) => <Input {...inputProps} {...props} ref={ref} type="tel" placeholder="(555) 123-4567" />}
    </InputMask>
  );
});

PhoneInput.displayName = 'PhoneInput';

export default PhoneInput;