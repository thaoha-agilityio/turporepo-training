import { Typography } from '../Typography';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';

type DropdownOption = {
  label: string;
  value: string;
  icon?: string;
};

type DropdownProps = {
  options: DropdownOption[];
  disabled?: boolean;
  label?: string;
  selectedValue?: string;
  errorMessage?: string;
  placeholder?: string;
  extraStyle?: string;
  onSelect: (value: string) => void;
};

export const SelectDropdown = ({
  options,
  disabled = false,
  label,
  selectedValue,
  errorMessage,
  extraStyle,
  placeholder = 'Select an option',
  onSelect,
}: DropdownProps) => (
  <div className={extraStyle}>
    {label && (
      <label className="block text-sm font-medium text-secondary mb-2">
        {label}
      </label>
    )}

    <Select value={selectedValue} onValueChange={onSelect} disabled={disabled}>
      <SelectTrigger
        className={`w-full ${errorMessage ? 'border-destructive' : ''}`}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            <div className="flex items-center text-secondary">
              {option.icon && (
                <img
                  src={option.icon}
                  alt={option.label}
                  className="size-4 mr-2 inline-block"
                />
              )}
              {option.label}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>

    {errorMessage && (
      <Typography className="mt-1 text-sm text-destructive">
        {errorMessage}
      </Typography>
    )}
  </div>
);
