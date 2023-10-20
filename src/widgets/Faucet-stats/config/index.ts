import { useAvailableRewards, useTotalLocked, useDailyROI } from 'entities/Faucets';

export const cardsInfo = [
  { title: 'Available Rewards', useGetData: useAvailableRewards },
  { title: 'Total Locked', useGetData: useTotalLocked },
  { title: 'Daily ROI', useGetData: useDailyROI }
];
