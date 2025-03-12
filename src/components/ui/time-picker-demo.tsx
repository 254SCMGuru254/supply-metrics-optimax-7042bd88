
import React from 'react';
import { Input } from './input';
import { Label } from './label';

export interface TimePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  className?: string;
}

export const TimePicker: React.FC<TimePickerProps> = ({
  value = '',
  onChange,
  label = 'Time',
  className = '',
}) => {
  return (
    <div className={className}>
      {label && <Label htmlFor="time-picker">{label}</Label>}
      <Input
        id="time-picker"
        type="time"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
};

export default TimePicker;
