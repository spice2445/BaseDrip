import { AirdropTeam } from 'features/team/airdrop';
import { ChangeBuddy } from 'features/team/change-buddy';
import { DirectAirDrop } from 'features/team/direct-airdrop';
import { RewardsWallet } from 'features/team/rewards-wallet';
import { Title } from 'shared/ui/typogragphy';

export const TeamPage = () => {
  return (
    <>
      <Title>TEAM</Title>
      <ChangeBuddy />

      <Title>REWARDS WALLET</Title>
      <RewardsWallet />

      <Title>TEAM AIRDROP</Title>
      <AirdropTeam />

      <Title>DIRECT AIRDROP</Title>
      <DirectAirDrop />
    </>
  );
};
