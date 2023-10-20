import { Field } from '@radix-ui/react-form';

import { container, header_token, body_input, input_text_token } from './ui.module.scss';
import { text } from 'shared/ui/typogragphy';
import { MaxBalance } from './Max';
import { Balance } from './Balance';
import { InputBigInt } from 'shared/ui/form/input-bigint';
import { Address, useAccount } from 'wagmi';
import { useBalance } from 'shared/lib/use-balance';
import { useEffect } from 'react';
import { Skeleton } from 'shared/ui/Loading';

interface SingleTokenProps {
  name: 'first' | 'second';
  title: string;
  address: Address;
  decimals: number;
  symbol: string;
  amount: bigint | undefined;
  changeAmount: (value: bigint | undefined) => void;
}

export const Logic = ({ name, title, address, decimals, symbol, changeAmount, amount }: SingleTokenProps) => {
  const { balance, fetchBalance } = useBalance(address);

  useEffect(() => fetchBalance(), [address]);

  return (
    <Field name={`token-${name}`} className={container}>
      <div className={header_token}>
        <p className={text.text_sm}>{title}</p>

        {name === 'first' ? (
          <MaxBalance balance={balance} decimals={decimals} />
        ) : (
          <Balance balance={balance} decimals={decimals} />
        )}
      </div>

      <div className={body_input}>
        <InputBigInt
          max={name === 'first' ? (balance as bigint) : BigInt(1e59)}
          onChangeAmount={changeAmount}
          decimals={decimals}
          amount={amount}
        />
        <p className={input_text_token}>{symbol}</p>
      </div>
    </Field>
  );
};

export const SingleToken = ({ name, title, address, decimals, symbol, changeAmount, amount }: SingleTokenProps) => {
  const { isConnected } = useAccount();

  if (!isConnected) return <Skeleton />;

  return (
    <Logic
      name={name}
      title={title}
      address={address}
      decimals={decimals}
      symbol={symbol}
      changeAmount={changeAmount}
      amount={amount}
    />
  );
};
