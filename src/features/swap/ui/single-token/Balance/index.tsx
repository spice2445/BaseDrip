import { contorl_balance, contorl_container } from '../ui.module.scss';
import { toDecimal } from 'shared/lib/to-decimal';

interface BalanceProps {
  decimals: number;
  balance: bigint | undefined;
}
export const Balance = ({ decimals, balance }: BalanceProps) => {
  return (
    <div className={contorl_container}>
      <p>Balance</p>
      <p className={contorl_balance}>
        {!balance ? 0 : toDecimal(balance, decimals, 3)}
      </p>
    </div>
  );
};
