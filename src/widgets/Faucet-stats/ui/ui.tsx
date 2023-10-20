import { Card, CardTheme } from 'shared/ui/card';
import { InfoCard } from './card';
import { cardsInfo } from '../config';
import { container_info } from './ui.module.scss';

export const FaucetStats = () => {
  return (
    <Card theme={CardTheme.transparent} className={container_info}>
      {cardsInfo.map((info) => (
        <InfoCard key={info.title} {...info} />
      ))}
    </Card>
  );
};
