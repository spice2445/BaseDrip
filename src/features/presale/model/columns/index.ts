import { ColumnsI } from 'shared/ui/columns';
import { useIsUserWL } from './useIsUserWL';
import { useCountSpendEth } from './useCountSpendEth';
import { useContributionETH } from './useContribution-ETH';
import { useReceivedBDRIP } from './Received-BDRIP';
import { usePresaleStatus } from './presale-status';

export const columnsInfo: ColumnsI[] = [
  { title: 'Are you on the whitelist:', info: 'True', useInfo: useIsUserWL },
  { title: 'How much ETH you can spend:', info: '0.1', useInfo: useCountSpendEth },
  { title: 'Your contribution ETH:', info: '1', useInfo: useContributionETH },
  { title: 'Received tokens:', info: '100 $BDRIP', useInfo: useReceivedBDRIP },
  { title: 'Presale status:', info: 'Public.', useInfo: usePresaleStatus }
];

export { useCountSpendEth };
