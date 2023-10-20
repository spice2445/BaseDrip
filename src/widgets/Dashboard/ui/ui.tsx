import { Card, CardTheme } from 'shared/ui/card';
import { dashboard_card } from './ui.module.scss';
import { CardInfo } from './card-info';
import { useCirculatingSupply, useFaucetCount } from 'entities/Faucets';
import { useGardenTVL } from 'entities/Garden';
import { useBasePrice, useBdripPrice, useTotalSupply } from 'entities/Token';
import { NAME_BASE, NAME_BDRIP } from 'shared/config/constants';

export const Dashboard = () => {
  return (
    <Card theme={CardTheme.transparent} className={dashboard_card}>
      <CardInfo title={`$${NAME_BDRIP} Price`} useGetData={useBdripPrice} />
      <CardInfo title="Faucet Count" useGetData={useFaucetCount} />
      {/* <CardInfo title="Total Garden TVL" useGetData={useGardenTVL} /> */}

      <CardInfo title={`$${NAME_BASE} Price`} useGetData={useBasePrice} />
      <CardInfo title="Total Supply" useGetData={useTotalSupply} />
      {/* <CardInfo title="Circulating Supply" useGetData={useCirculatingSupply} /> */}
    </Card>
  );
};
