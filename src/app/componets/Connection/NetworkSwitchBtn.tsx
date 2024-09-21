import { networks } from "@/configs"
import { useWeb3React } from "@web3-react/core"
import { useCallback } from "react"
import NetworkItem from "../NetworkItem"
import { Network } from "@/types"
import classes from "./networkSwitchBtn.module.scss"

export default function NetworkSwitchBtn({ supportedChainids }: { supportedChainids: string[] }) {

    const { chainId, connector } = useWeb3React()

    const switchNetwork = useCallback(async (network: Network) => {
        if (connector) {
            try {
                //切换网络
                await connector.provider?.request({
                    method: "wallet_switchEthereumChain",
                    params: [{ chainId: network.chainId }],
                })
            } catch (e: any) {
                if (e.code != 4001) {
                    await connector.provider?.request({
                        method: 'wallet_addEthereumChain',
                        params: [network]
                    })
                }

            }
        }

    }, [connector])

    return (<div className={classes.root}>
        <div className="text-red-500">网络不正确,请在下面支持的网络列表中选择要切换的网络</div>
        <div className="mt-3">
            <div className={classes.networks_wrap}>
                {networks.map((network: Network) => {
                    if (supportedChainids.includes(network.chainId)) {
                        return <div onClick={() => switchNetwork(network)} key={network.chainId} >
                            <NetworkItem network={network} selected={Number(network.chainId) == Number(chainId)} />
                        </div>
                    }
                })}
            </div >
        </div>
    </div>)
}