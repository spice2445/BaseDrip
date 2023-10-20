import { Button } from "shared/ui/button";
import { margin_container } from "../Card/ui.module.scss";
import { useDeposit } from "../../model/deposit";
import { Address } from "viem";

type DepositButtonProps = {
  amount: bigint;
  onSuccess: () => void;
  gardenAddress: Address;
};

export const DepositButton = ({ amount, onSuccess, gardenAddress }: DepositButtonProps) => {
  const { deposit, loading } = useDeposit({ amount, onSuccess, gardenAddress });

  return (
    <Button disabled={loading} className={margin_container} onClick={deposit}>
      {loading && 'Depositing...'}
      {!loading && 'Deposit'}
    </Button>
  );
};
