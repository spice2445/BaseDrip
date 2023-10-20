import clsx from 'clsx';
import { Title } from 'shared/ui/typogragphy';
import { title_mini } from './ui.module.scss';
import { GardenCard, addressesGarden } from 'entities/Garden';
import { NAME_BDRIP } from 'shared/config/constants';
import { GARDEN } from 'shared/config/blockchain';

export const GardenPage = () => {
  return (
    <>
      <Title>GARDEN</Title>
      <h3 className={clsx(title_mini)}>Deposit Fee is used to buyback {NAME_BDRIP}</h3>
      {GARDEN.map(({ gardenAddress, tokenAddress }, index) => (
        <GardenCard key={index} gardenAddress={gardenAddress} tokenAddress={tokenAddress} />
      ))}
    </>
  );
};
