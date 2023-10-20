import { NAME_BDRIP } from 'shared/config/constants';
import { ColumnsI } from 'shared/ui/columns';

export const columns_info: ColumnsI[] = [
  { title: 'Total Comission', info: `0 ${NAME_BDRIP}` },
  { title: 'Claimed Comission', info: `0 ${NAME_BDRIP}` },
  { title: 'Available Comission', info: `0 ${NAME_BDRIP}` }
];

export { errors as errorsRewardsWallet } from './errors';
