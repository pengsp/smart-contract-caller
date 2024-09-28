
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useWeb3React } from "@web3-react/core";
import { useNetworkManager } from "@/hooks";

export default function Networks() {
    const { chainId } = useWeb3React()
    const t = useTranslations();
    const { getNetwork } = useNetworkManager()
    const network = getNetwork(chainId)

    return (<>
        <div className="flex gap-[4px] items-center h-[32px] border px-2 pr-3 rounded-md  "  >
            {(network && network.iconUrls && network.iconUrls[0])
                ? <Image src={network?.iconUrls[0]} width={20} height={20} alt={network.chainName} />
                : <Image width={20} height={20} alt='' src="/images/chains/none.svg" />
            }
            <span className="text-xs">{network?.chainName || `Unknow Network (ChainId: ${chainId})`}</span>
        </div>
    </>)
}

