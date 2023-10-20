export { NetworksSetDefault } from './networks';
import { providersWeb3 } from './wagmi';
import { modal } from './modal';
import { withRouting } from './routings';

import compose from 'compose-function';

export const providersApp = compose(withRouting, providersWeb3, modal);
