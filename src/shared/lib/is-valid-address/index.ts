export function isValidAddress(inputString: string) {
  const cleanedString = inputString.replace(/^0x/, '');
  return cleanedString.length === 40;
}
