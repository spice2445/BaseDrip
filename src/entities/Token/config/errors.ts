import { ERROR_REVERT } from 'shared/config/type';

export const NotWhitelisted: ERROR_REVERT = {
  revert: 'NotWhitelisted',
  message: "you're not on the whitelist!"
};

export const MinContributionNotReached: ERROR_REVERT = {
  revert: 'MinContributionNotReached',
  message: 'Too few tokens to purchase! Minimum purchase: 0.3 ETH.'
};

export const MaxContributionReached: ERROR_REVERT = {
  revert: 'MaxContributionReached',
  message: 'The token purchase limit has been exhausted!'
};

export const HardCapReached: ERROR_REVERT = {
  revert: 'HardCapReached',
  message: "We're out of tokens!"
};

export const PresaleNotStartedYet: ERROR_REVERT = {
  revert: 'PresaleNotStartedYet',
  message: "Presale hasn't started yet!"
};

export const PresaleEnded: ERROR_REVERT = {
  revert: 'PresaleEnded',
  message: 'Presale is already over!'
};

export const errors = [
  NotWhitelisted,
  MinContributionNotReached,
  MaxContributionReached,
  HardCapReached,
  PresaleNotStartedYet,
  PresaleEnded
];
