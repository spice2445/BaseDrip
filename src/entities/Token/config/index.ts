// export const USDC = '0xf50670efa48f8e0f01121c8ba1f6bb5162754ac1'; // BASE '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
// export const wBASE = '0xf50670efa48f8e0f01121c8ba1f6bb5162754ac1'; // BASE '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
// export const PRESALE_ADDRESS = '0x45cfB6331C236B64B195b111A944c23aE1F5aadc';

import PRESALE_ABI from 'shared/assets/abi/presale.json';
import { PRESALE_ADDRESS } from 'shared/config/blockchain';

export const BDRIP_COUNT = 5_000_000;
export const BDRIP_PRESALE_PRICE = 0.01;

export const defaultPresaleConfig = {
  address: PRESALE_ADDRESS,
  abi: PRESALE_ABI,
  watch: true
};

export * as success from './success';
export { errors as errorsPresale } from './errors';
