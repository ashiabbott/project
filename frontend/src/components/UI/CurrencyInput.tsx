import React from 'react';
import NumberFormat from 'react-number-format';

interface CurrencyInputProps {
  value: number;
  onChange: (value: number) => void;
  currencySymbol?: string;
  placeholder?: string;
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({
  value,
  onChange,
  currencySymbol = '$',
  placeholder = 'Enter amount',
}) => {
  return (
    <NumberFormat
      value={value}
      thousandSeparator
      prefix={currencySymbol}
      placeholder={placeholder}
      className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
      onValueChange={values => {
        onChange(values.floatValue || 0);
      }}
    />
  );
};

export default CurrencyInput;
