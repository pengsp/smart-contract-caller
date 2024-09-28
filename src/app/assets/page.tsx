
import chains from "@/configs/chains.json"
import NetworkItem from "../componets/Networks/NetworkItem"
import { Network } from "@/types"

export default function Page() {
    return (<>
        {chains?.map((network: any, index: number) => {
            return <div key={network.chainId} className="relative">
                <span className="absolute top-1 left-1 z-10">{index}</span>
                <NetworkItem network={network} selected={false} />
            </div>
        })}
    </>)
}