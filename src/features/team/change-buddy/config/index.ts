import { ColumnsI } from 'shared/ui/columns';
import { useGetCommission } from '../model';

export const ADDRESS_BUDDY_DEFAULT = '0x180De5750C5Ca8d693B428edE02eaf48ccab85EA';

export const column_info: ColumnsI[] = [
  { title: 'Comission', useInfo: useGetCommission }
  // { title: 'Members in your team', info: '0', useInfo: useGetCountMembersTeam },
  // { title: 'Team members', info: 'No team members yet' }
];
