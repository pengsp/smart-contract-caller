import Image from "next/image";
import classes from "./networkItem.module.scss"
import { Network } from "@/configs";

export default function NetworkItem({ network, selected = false }: { network: Network, selected: boolean }) {
    return (<div className={selected ? classes.network_current_item : classes.network_item} >
        {(network.iconUrls && network.iconUrls[0])
            ? <Image src={network?.iconUrls[0]} width={30} height={30} style={{ maxHeight: "30px" }} alt={network.chainName} />
            : <Image src="/images/other.svg" width={20} height={20} alt={network.chainName} />}
        <div>
            <div>{network.chainName}</div>
            <div className={classes.chain_id}>Chain Id: {Number(network.chainId)}</div>
        </div>
    </div>)
}