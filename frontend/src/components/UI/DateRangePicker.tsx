import React from 'react';
import { DateRangePicker as ReactDateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // Import default styles
import 'react-date-range/dist/theme/default.css'; // Import theme styles

interface DateRange {
  startDate: Date;
  endDate: Date;
}

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  value,
  onChange,
}) => {
  const handleSelect = (ranges: any) => {
    onChange({
      startDate: ranges.selection.startDate,
      endDate: ranges.selection.endDate,
    });
  };

  return (
    <ReactDateRangePicker
      ranges={[
        {
          startDate: value.startDate,
          endDate: value.endDate,
          key: 'selection',
        },
      ]}
      onChange={handleSelect}
      moveRangeOnFirstSelection={false}
    />
  );
};

export default DateRangePicker;
