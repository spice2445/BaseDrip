import { toDecimal } from 'shared/lib/to-decimal';
import { contorl_balance, contorl_container } from '../ui.module.scss';

interface MaxBalanceProps {
  decimals: number;
  balance: bigint | undefined;
}

export const MaxBalance = ({ decimals, balance }: MaxBalanceProps) => {
  return (
    <div className={contorl_container}>
      <p>Max</p>
      <button className={contorl_balance}>
        {!balance ? 0 : toDecimal(balance, decimals, 3)}
      </button>
    </div>
  );
};
