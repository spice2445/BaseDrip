import { Button } from 'shared/ui/button';
import { useSwap } from '../../model/use-swap';
import { button_exchange } from '../ui.module.scss';
import { Address, FetchTokenResult } from '@wagmi/core';

export type SwapButton = {
  token0: FetchTokenResult;
  token1: FetchTokenResult;
  amount0: bigint;
  amount1: bigint;
  ROUTER_ADDRESS: Address;
  onSuccess?: () => void;
};

export const SwapButton = ({ ROUTER_ADDRESS, token0, token1, amount0, amount1, onSuccess }: SwapButton) => {
  const { swap, loading } = useSwap(token0, token1, amount0, amount1, ROUTER_ADDRESS, onSuccess);
  return (
    <Button disabled={loading} onClick={swap} className={button_exchange}>
      {!loading && `Swap`}
      {loading && `Swapping..`}
    </Button>
  );
};
