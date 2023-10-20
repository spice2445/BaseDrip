import { Root } from '@radix-ui/react-form';
import { Card, CardTheme } from 'shared/ui/card';
import { SingleToken } from './single-token';
import { SwapPlaces } from './swap-places';
import { Column, Columns } from 'shared/ui/columns';
import { container_margin, container_exchange, title_small } from './ui.module.scss';
import { useUnit } from 'effector-react';
import { currentRoute } from '../model/swap-amounts';
import { getRate, useSwapRate } from '../model';
import { useEffect, useState } from 'react';
import { Address, useToken } from 'wagmi';
import { usePair } from '../lib';
import { ActionButton } from './action-button';
import { toDecimal } from 'shared/lib/to-decimal';
import { Title } from 'shared/ui/typogragphy';
import { isValidAddress } from 'shared/lib/is-valid-address';
import { reloadQueryWithDefaultValue } from '../model/reload-default';

export const Swap = () => {
  const { tokenFirst, tokenSecond } = useUnit(currentRoute.$query);
  const [rate, setRate] = useState(0);
  const { data: token1 } = useToken({ address: tokenFirst });
  const { data: token2 } = useToken({ address: tokenSecond });
  const {
    amount0,
    amount1,
    reset: resetAmounts,
    changeInputAmount,
    changeOutputAmount,
    changePair
  } = useSwapRate(token1?.address, token2?.address);

  const pair = usePair(token1?.address, token2?.address);

  useEffect(() => {
    if (!isValidAddress(tokenFirst) || !isValidAddress(tokenSecond)) reloadQueryWithDefaultValue();
  }, [tokenFirst, tokenSecond]);

  useEffect(() => {
    if (pair) changePair(pair as Address);
  }, [changePair, pair]);

  useEffect(() => {
    getRate([tokenFirst, tokenSecond]).then((rate) => setRate(rate));
  }, [tokenFirst, tokenSecond]);

  if (!token1 || !token2) return <Title className={title_small}>The link may be broken, there are no tokens</Title>;
  return (
    <Card theme={CardTheme.transparent}>
      <Card>
        <Root className="w_100">
          <SingleToken
            amount={amount0}
            changeAmount={changeInputAmount}
            name={'first'}
            title="From"
            decimals={token1.decimals}
            symbol={token1.symbol}
            address={tokenFirst}
          />
          <SwapPlaces />
          <SingleToken
            amount={amount1}
            changeAmount={changeOutputAmount}
            name={'second'}
            title="To"
            decimals={token1.decimals}
            symbol={token2.symbol}
            address={tokenSecond}
          />

          <div className={container_margin}>
            <Columns>
              <Column title="Price" info={`1 ${token1.symbol} = ${rate} ${token2.symbol}`} />
              <Column title="Auto Slippage" info="Active" />
              <Column
                title="Minimum Received"
                info={`${toDecimal(amount1 || BigInt(0), token1.decimals, 3)} ${token2.symbol}`}
              />
            </Columns>
          </div>

          <div className={container_exchange}>
            <ActionButton
              onSuccessSwap={resetAmounts}
              amount0={amount0}
              amount1={amount1}
              token0={token1}
              token1={token2}
              pair={pair}
            />
          </div>
        </Root>
      </Card>
    </Card>
  );
};
