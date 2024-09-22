import { networks } from "@/configs"
import { useWeb3React } from "@web3-react/core"
import { useCallback, useState } from "react"
import NetworkItem from "../NetworkItem"
import { Network } from "@/types"
import classes from "./networkSwitchBtn.module.scss"
import { Spin } from "antd"

export default function NetworkSwitchBtn({ supportedChainids }: { supportedChainids: string[] }) {
    const [networkChanging, setNetworkChanging] = useState(false)

    const { chainId, connector } = useWeb3React()

    const switchNetwork = useCallback(async (network: Network) => {
        if (connector) {
            setNetworkChanging(true)
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
            } finally {
                setNetworkChanging(false)
            }
        }

    }, [connector])

    return (<div className={classes.root}>
        <div className="text-white">网络不匹配！此合约部署在以下网络,请选择要切换的网络</div>
        <div className="mt-3">
            <Spin spinning={networkChanging} tip={<div className="  font-bold">请在MetaMask中确认网络切换请求...</div>} size="large">
                <div className={classes.networks_wrap}>
                    {networks.map((network: Network) => {
                        if (supportedChainids.includes(network.chainId)) {
                            return <div onClick={() => switchNetwork(network)} key={network.chainId} >
                                <NetworkItem network={network} selected={Number(network.chainId) == Number(chainId)} />
                            </div>
                        }
                    })}
                </div >
            </Spin>
        </div>
    </div>)
}