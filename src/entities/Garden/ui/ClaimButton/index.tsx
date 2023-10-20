import { Button } from "shared/ui/button";
import { margin_container } from "../Card/ui.module.scss";
import { useClaim } from "../../model/claim";
import { useCanClaim } from "../../model/can-claim";
import { Address, useAccount } from "wagmi";

type ClaimButton = {
    gardenAddress: Address
}
export const ClaimButton = ({ gardenAddress }: ClaimButton) => {
    const { isConnected } = useAccount();
    const { claim, loading } = useClaim(gardenAddress);

    const canClaim = useCanClaim(gardenAddress);

    if (!canClaim || !isConnected) return <Button className={margin_container} disabled>Claim</Button>;
    return (
        <Button disabled={loading} onClick={claim} className={margin_container}>
            {!loading && 'Claim'}
            {loading && 'Claiming...'}
        </Button>
    );
};
