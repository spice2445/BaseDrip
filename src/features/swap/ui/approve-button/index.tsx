import { useApprove } from 'entities/Token';
import { button_exchange } from '../ui.module.scss';
import { Button } from 'shared/ui/button';
import { Address, FetchTokenResult } from '@wagmi/core';

export type ApproveButton = {
  token: FetchTokenResult;
  spender: Address;
  amount: bigint;
};

export const ApproveButton = ({ token, spender, amount }: ApproveButton) => {
  const { approve, loading } = useApprove(token.address, spender, amount);
  return (
    <Button disabled={loading} onClick={approve} className={button_exchange}>
      {!loading && `Approve ${token.symbol}`}
      {loading && `Approving ${token.symbol}..`}
    </Button>
  );
};
