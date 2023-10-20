import { Button } from 'shared/ui/button';
import { margin_container } from '../Card/ui.module.scss';
import { useAllowance, useApprove } from 'entities/Token';
import { DepositButton } from '../DepositButton';
import { Address } from 'viem';

type ActionButtonProps = {
  amount: bigint | undefined;
  max: bigint;
  token: Address;
  onSuccess: () => void;
  gardenAddress: Address;
};
export const ActionButton = ({ amount, max, token, onSuccess, gardenAddress }: ActionButtonProps) => {
  const { allowance, loading } = useAllowance(token, gardenAddress);
  const { approve } = useApprove(token, gardenAddress, amount);

  if (!amount)
    return (
      <Button disabled className={margin_container}>
        Enter amounts
      </Button>
    );
  else if (amount > max)
    return (
      <Button disabled className={margin_container}>
        Insufficient balance
      </Button>
    );
  else if (allowance === undefined || loading)
    return (
      <Button disabled className={margin_container}>
        Checking allowance...
      </Button>
    );
  else if (amount > allowance)
    return (
      <Button className={margin_container} onClick={approve}>
        Approve
      </Button>
    );

  return <DepositButton gardenAddress={gardenAddress} amount={amount} onSuccess={onSuccess} />;
};
