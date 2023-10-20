import { Address } from 'viem';

export const BDRIP = '0xe73C5bcF23a1A00B989c45f2B0049A70a39d5331';

export const Tokens: Address[] = [
  '0x823739eE606A8181C3Ce274323a114006F7DA8D4', // tt1
  '0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee', // tt2
  BDRIP // bDRIP
];

export const PRESALE_ADDRESS: Address = '0x6b1aFe1884f851d8D2BE6f31D9A226c2A89f4579';
export const TEAM_ADDRESS: Address = '0xCeD47C28849697C80E4b88E99a1FCAB71e0Fe994';
export const FAUCET_ADDRESS: Address = '0x343fa4cE45e1d3B618F6E10500A992D653aaBff5';
export const GARDEN_ADDRESS: Address = '0x43Dc6d0C1732DCF00dca367364c25a13B2697155';
export const FACTORY_ADDRESS: Address = '0xAa9d09bcB8dD33308db269Ab6B37c7A3089BD52D';
export const ROUTER_ADDRESS: Address = '0xd6594E0F24CfBcBa03DC9cfbE37fC05B517B32d0';

// TOKENS PRICE
export const WBASE: Address = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c';
export const USDC: Address = '0x8965349fb649a33a30cbfda057d8ec2c48abe2a2';

type Addresses = {
  tokenAddress: Address;
  gardenAddress: Address;
};
export const GARDEN: Addresses[] = [
  {
    tokenAddress: '0xB90ED3AdEf8c2B2721F9E6318acB362d982a1b4b',
    gardenAddress: '0x21d96f10AC7405f5bE0a4a4A2e4D50C4b5737341'
  } /* ,
  {
    tokenAddress: '0x4Cf4fc5507ca6644Ec7017cE63d5aA25a5E75e0e',
    gardenAddress: '0x919B8172f9B0010113eA9a52ad5439923B2a8490'
  },
  {
    tokenAddress: '0x7725ba13D25a715DfA021D71237cb6Aaa4eCD90E',
    gardenAddress: '0x3832D6ede46805A3a2A8680c14155641972882E2'
  } */
];
