import { ERROR_REVERT } from 'shared/config/type';

export const WrongETHForReferralFee: ERROR_REVERT = {
  revert: 'WrongETHForReferralFee',
  message: `insufficient funds, a minimum of 0.05 is required`
};

export const errors: ERROR_REVERT[] = [WrongETHForReferralFee];
