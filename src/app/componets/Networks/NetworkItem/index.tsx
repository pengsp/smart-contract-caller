import Image from "next/image";
import classes from "./networkItem.module.scss"
import { Network } from "@/types";

export default function NetworkItem({ network, selected = false }: { network: Network, selected: boolean }) {
    return (<div className={selected ? classes.network_current_item : classes.network_item} >
        {(network.iconUrls && network.iconUrls[0])
            ? <Image src={network?.iconUrls[0]} width={30} height={30} style={{ maxHeight: "30px" }} alt={network.chainName} />
            : <Image src="/images/chains/none.svg" width={30} height={30} alt={network.chainName} />}
        <div>
            <div>{network.chainName}</div>
            <div className={classes.chain_id}>Chain Id: {Number(network.chainId)}</div>
        </div>

        <div className="absolute right-2 text-xl ">
            {selected ?
                <svg xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-blue-400"
                >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M9 11l3 3l8 -8" />
                    <path d="M20 12v6a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h9" />
                </svg>
                : <svg xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-300"
                >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M3 3m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" />
                </svg>
            }
        </div>

    </div>)
}