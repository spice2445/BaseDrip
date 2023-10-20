
import { Title } from 'shared/ui/typogragphy';
import { FaucetStats } from 'widgets/Faucet-stats';
import { FaucetsProfile } from 'widgets/Faucets-profile';

export const FaucetsPage = () => {
  return (
    <>
      <Title>FAUCET STATS</Title>
      <FaucetStats />

      <Title>FAUCETS</Title>
      <FaucetsProfile />
    </>
  );
};
