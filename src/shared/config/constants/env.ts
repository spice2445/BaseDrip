export const getEnvVar = (key: string) => {
  const env = import.meta.env[key];

  return env || '';
};

export const IS_DEV = getEnvVar('DEV');
export const WALLET_CONNECT_ID = getEnvVar('VITE_RAINBOW_PROJECT_ID');
export const ALCHEMY_ID = getEnvVar('VITE_ALCHEMY_ID');
export const NAME_BDRIP = 'BDRIP';
export const NAME_BASE = 'BASE';
export const NAME_ETH = 'ETH';
