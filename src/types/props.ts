export interface BaseSelectProps<T> {
  selectedValue: T | T[];
  label?: string;
  multiple?: boolean;
  clearable?: boolean;
  objectLabel?: string;
  options: T[];
}

export interface BaseSwitcherProps {
  modelValue: boolean;
}

export interface BaseButtonProps {
  name: string;
  disabled?: boolean;
}

export interface PollRowComponentProps {
  selectOptionsFirst: string[];
  selectOptionsSecond: string[];
  selectOptionsThird: string[];
}
