import { Control, Label } from '@radix-ui/react-form';
import clsx from 'clsx';
import { input } from './ui.module.scss';
import { text } from 'shared/ui/typogragphy';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  inputRef?: React.LegacyRef<HTMLInputElement>;
}

export const Input = ({
  className,
  type,
  required,
  placeholder,
  label,
  value,
  disabled,
  onChange,
  inputRef
}: InputProps) => {
  return (
    <div>
      <Label className={text.text_sm}>{label}</Label>
      <Control asChild>
        <input
          value={value}
          onChange={onChange}
          ref={inputRef}
          className={clsx(className, input, 'w_100')}
          type={type}
          required={required}
          placeholder={placeholder}
          disabled={disabled}
        />
      </Control>
    </div>
  );
};
