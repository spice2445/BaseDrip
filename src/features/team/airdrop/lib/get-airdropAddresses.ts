import { isAddress } from 'viem';

export const aidropAddresses = (addresses: string) => {
  let addressesArray = addresses.split('\n'); //splits addresses into array from string

  addressesArray = addressesArray.filter((x) => !/^\s*$/.test(x)).filter((x) => x !== ''); //убираем пустые строки и знак переноса

  addressesArray = Array.from(new Set(addressesArray)); //remove duplicates

  let isEthAddressValidationForAllAddressPassed = addressesArray.some((el) => isAddress(el));
  return [addressesArray, isEthAddressValidationForAllAddressPassed];
};
