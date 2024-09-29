import { Network } from "@/types"
import { useWeb3React } from "@web3-react/core"
import { useCallback, useState } from "react"
import { notification } from 'antd';
import { useTranslations } from "next-intl";

export function useSwitchNetwork() {
    const { connector } = useWeb3React()
    const [loading, setLoading] = useState(false)
    const t = useTranslations();

    const switchNetwork = useCallback(async (network: Network) => {
        console.log(network)
        if (connector) {
            setLoading(true)
            try {
                await connector.provider?.request({
                    method: "wallet_switchEthereumChain",
                    params: [{ chainId: network.chainId }],
                })
            } catch (e: any) {
                if (network.rpcUrls.length == 0) {
                    notification.warning({
                        message: t('network_switch_failed'),
                        description: t('No_RPC_provided', { network: network.chainName }),
                    });
                }
                if (e.code != 4001) {
                    await connector.provider?.request({
                        method: 'wallet_addEthereumChain',
                        params: [network]
                    })
                }

            } finally {
                setLoading(false)
            }
        } else {
            notification.error({
                message: 'No provider found',
                description: 'Install MetaMask please!',
            });
        }

    }, [connector, t])


    return { loading, switchNetwork }
}