import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { WagmiConfig } from 'wagmi';

import { chains, configWagmi } from 'shared/config/blockchain';

import { ReactNode } from 'react';

export const providersWeb3 = (component: () => ReactNode) => () => {
  return (
    <WagmiConfig config={configWagmi}>
      <RainbowKitProvider chains={chains}>{component()}</RainbowKitProvider>
    </WagmiConfig>
  );
};
