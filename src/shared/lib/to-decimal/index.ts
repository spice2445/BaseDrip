export const toDecimal = (value: bigint, decimals: number, precision: number): number => {
  const power = Math.pow(10, precision || 0);
  return Math.floor((Number(value) / 10 ** decimals) * power) / power;
};
