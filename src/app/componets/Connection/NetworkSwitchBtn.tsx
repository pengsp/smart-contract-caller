
import { useCallback, useState } from "react"
import { useTranslations } from "next-intl"
import { networks } from "@/configs"
import { useWeb3React } from "@web3-react/core"
import NetworkItem from "../NetworkItem"
import { Network } from "@/types"
import classes from "./networkSwitchBtn.module.scss"
import { Spin } from "antd"

export default function NetworkSwitchBtn({ supportedChainids }: { supportedChainids: string[] }) {
    const [networkChanging, setNetworkChanging] = useState(false)
    const t = useTranslations();
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
        <div className="text-white">{t('network_does_not_match')}</div>
        <div className="mt-3">
            <Spin spinning={networkChanging} tip={<div className="text-violet-500 font-medium">{t("switch_network_loading")}</div>} size="large">
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