import { ERROR_REVERT } from 'shared/config/type';

export const WrongETHForReferralFee: ERROR_REVERT = {
  revert: 'WrongETHForReferralFee',
  message: 'Wrong ETH for referral fee!'
};

export const NotYourReferral: ERROR_REVERT = {
  revert: 'NotYourReferral',
  message: 'Not your referral!'
};

export const NothingToClaim: ERROR_REVERT = {
  revert: 'NothingToClaim',
  message: 'Nothing to claim!'
};

export const errors = [WrongETHForReferralFee, NotYourReferral, NothingToClaim];
