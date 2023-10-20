import { Card } from 'shared/ui/card';
import { token_price } from './ui.module.scss';
import { useBdripPrice } from 'entities/Token/model';
import { formattedIntegers } from 'shared/lib/formatted-numbers';

export const BdripPrice = () => {
  // const price = useBdripPrice(1);
  return <Card className={token_price}>{1}$</Card>;
};
