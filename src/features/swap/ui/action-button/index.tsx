import { ROUTER_ADDRESS } from 'shared/config/blockchain';
import { button_exchange } from '../ui.module.scss';
import { useAllowance } from 'entities/Token';
import { useBalance } from 'shared/lib/use-balance';
import { Button } from 'shared/ui/button';
import { ApproveButton } from '../approve-button';
import { FetchTokenResult } from '@wagmi/core';
import { SwapButton } from '../swap-button';
import { useAccount } from 'wagmi';
import { toDecimal } from 'shared/lib/to-decimal';

type ActionButtonProps = {
  token0: FetchTokenResult | undefined;
  token1: FetchTokenResult | undefined;
  amount0: bigint | undefined;
  amount1: bigint | undefined;
  pair: string | undefined;
  onSuccessSwap: () => void;
};

const Actions = ({ token0, token1, amount0, amount1, pair, onSuccessSwap }: ActionButtonProps) => {
  const { allowance, loading: allowanceLoading } = useAllowance(token0?.address, ROUTER_ADDRESS);
  const { balance: balance0 } = useBalance(token0?.address);

  if (!token0 || !token1) {
    return (
      <Button disabled className={button_exchange}>
        Select Tokens
      </Button>
    );
  } else if (!pair) {
    return (
      <Button disabled className={button_exchange}>
        No pool avaliable
      </Button>
    );
  } else if (!amount0 || !amount1) {
    return (
      <Button disabled className={button_exchange}>
        Enter amounts
      </Button>
    );
  } else if (allowanceLoading || allowance === undefined) {
    return (
      <Button disabled className={button_exchange}>
        Checking allowance...
      </Button>
    );
  } else if (amount0 > (balance0 || BigInt(0))) {
    return (
      <Button disabled className={button_exchange}>
        Insufficient amount
      </Button>
    );
  } else if (allowance < amount0) {
    return (
      <>
        <ApproveButton token={token0} spender={ROUTER_ADDRESS} amount={amount0} />
      </>
    );
  }

  return (
    <SwapButton
      onSuccess={onSuccessSwap}
      token0={token0}
      token1={token1}
      ROUTER_ADDRESS={ROUTER_ADDRESS}
      amount0={amount0}
      amount1={amount1}
    />
  );
};

export const ActionButton = ({ token0, token1, amount0, amount1, pair, onSuccessSwap }: ActionButtonProps) => {
  const { isConnected } = useAccount();

  if (!isConnected)
    return (
      <Button disabled className={button_exchange}>
        Please, connect wallet
      </Button>
    );

  return (
    <Actions
      token0={token0}
      token1={token1}
      amount0={amount0}
      amount1={amount1}
      pair={pair}
      onSuccessSwap={onSuccessSwap}
    />
  );
};
