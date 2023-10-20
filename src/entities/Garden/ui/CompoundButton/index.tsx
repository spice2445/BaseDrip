import { Button } from "shared/ui/button";
import { margin_container } from "../Card/ui.module.scss";
import { useCompound } from "../../model/compound";
import { Address } from "viem";

type CompoundButtonProps = {
    gardenAddress: Address;
}

export const CompoundButton = ({ gardenAddress }: CompoundButtonProps) => {
    const { compound, loading } = useCompound(gardenAddress);
    return (
        <Button disabled={loading} onClick={compound} className={margin_container}>
            {!loading && 'Compound'}
            {loading && 'Compounding...'}
        </Button>
    );
};
