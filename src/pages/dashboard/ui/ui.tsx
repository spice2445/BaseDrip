import { FaucetInfo } from 'features/search-faucet';
import { Title } from 'shared/ui/typogragphy';
import { Dashboard } from 'widgets/Dashboard';

export const DashBoardPage = () => {
  return (
    <>
      <Title>DASHBOARD</Title>
      <Dashboard />

      <Title>FAUCET LOOKUP</Title>
      <FaucetInfo />
    </>
  );
};
