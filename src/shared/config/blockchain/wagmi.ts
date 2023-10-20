import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig } from 'wagmi';
// import { alchemyProvider } from 'wagmi/providers/alchemy';
// import { ALCHEMY_ID, IS_DEV } from '../constants';
import { publicProvider } from 'wagmi/providers/public';
import { WALLET_CONNECT_ID, NAME_BASE } from '../constants';
import { createPublicClient, createWalletClient, custom, http, parseEther } from 'viem';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { Chain } from 'wagmi';
import { bscTestnet } from 'viem/chains';

export type Token = {
  symbol: string;
  decimals: number;
  name: string;
  address: string;
};

const RPC = 'https://bsc-testnet.public.blastapi.io/'; // 'https://rpc.kkteam.net/basedrip/';

export const basedrip = {
  id: 12301,
  name: 'BASEDRIP',
  network: 'basedrip',
  nativeCurrency: {
    decimals: 18,
    name: 'BASEDRIP',
    symbol: 'BDRIPT'
  },
  rpcUrls: {
    public: { http: [RPC] },
    default: { http: [RPC] }
  },
  blockExplorers: {
    etherscan: { name: 'SnowTrace', url: 'https://snowtrace.io' },
    default: { name: 'SnowTrace', url: 'https://snowtrace.io' }
  }
} as const satisfies Chain;

export const currentChain = bscTestnet; // basedrip; // IS_DEV ? : base;

export const client = createPublicClient({
  chain: currentChain,
  transport: http(RPC)
});

export const walletClient = createWalletClient({
  chain: currentChain,
  // @ts-ignore
  transport: window.ethereum ? custom(window.ethereum) : http(RPC)
});

export const { chains, publicClient, webSocketPublicClient } = configureChains(
  [currentChain],
  [
    publicProvider(),
    jsonRpcProvider({
      rpc: () => ({
        http: RPC
      })
    })
    // jsonRpcProvider({
    //   rpc: () => ({
    //     http: 'https://bsc-testnet.public.blastapi.io'
    //   })
    // })
    // alchemyProvider({ apiKey: ALCHEMY_ID })
  ]
);

const { connectors } = getDefaultWallets({
  appName: `${NAME_BASE} Drip`,
  chains,
  projectId: WALLET_CONNECT_ID
});

export const configWagmi = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient
});

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
export const MAX_UINT = parseEther('1000000000000000000');
