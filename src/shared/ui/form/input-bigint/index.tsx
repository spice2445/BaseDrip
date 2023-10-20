import { Control } from '@radix-ui/react-form';
import clsx from 'clsx';
import { input, error } from './ui.module.scss';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { toDecimal } from 'shared/lib/to-decimal';
import { useDebounce } from 'shared/lib/use-debounce';

export interface InputBigInt {
  decimals: number;
  amount?: bigint;
  onChangeAmount: (value?: bigint) => void;
  max: bigint;
}

export const InputBigInt = ({ decimals, amount, onChangeAmount, max }: InputBigInt) => {
  const [inputValue, setInputValue] = useState('');

  useDebounce(
    () => {
      if (!inputValue) return onChangeAmount(undefined);

      if (!inputValue.endsWith('.') && !inputValue.startsWith('.') && decimals) {
        const formattedOldValue = toDecimal(amount || BigInt(0), decimals, 3)
          .toString()
          .replace(',', '.');
        if (formattedOldValue !== inputValue) {
          onChangeAmount(BigInt(parseFloat(inputValue) * 10 ** decimals));
        }
      }
    },
    500,
    [inputValue]
  );

  useEffect(() => {
    if (amount !== undefined && !!decimals) {
      setInputValue(toDecimal(amount, decimals, 3).toString().replace(',', '.'));
    } else setInputValue('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount]);

  const changeValue = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.match(/^[0-9]*\.?[0-9]*$/)) setInputValue(e.target.value);
  }, []);

  if (!decimals) return 'loading...';

  return (
    <Control asChild>
      <input
        value={inputValue}
        onChange={changeValue}
        className={clsx(input, { [error]: (amount || BigInt(0)) > max }, 'w_100')}
        placeholder="0.0"
      />
    </Control>
  );
};
