import React, { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { DatePicker } from 'react-datepicker';

const DateRangePicker = ({startDate, setStartDate, endDate, setEndDate}) => {

  const handleStartDateChange = (date) => {
    setStartDate(date);
    if (endDate && date > endDate) {
      setEndDate(date);
    }
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    if (startDate && date < startDate) {
      setStartDate(date);
    }
  };

  return (
    <div className="flex items-center">
      <DatePicker
        selected={startDate}
        onChange={handleStartDateChange}
        placeholderText="Start date"
        dateFormat="dd/MM/yyyy"
        className="mr-4"
      />
      <DatePicker
        selected={endDate}
        onChange={handleEndDateChange}
        placeholderText="End date"
        dateFormat="dd/MM/yyyy"
        minDate={startDate}
      />
    </div>
  );
};

export default DateRangePicker;