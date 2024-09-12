
"use client"
import { useWeb3React } from "@web3-react/core";
import { useAuth } from "@/hooks/useAuth";
import { useCallback, useEffect, useState } from "react";
import { Button, Dropdown, Modal, Spin } from "antd";
import type { MenuProps } from 'antd';

import { ApiOutlined, DownOutlined, GlobalOutlined, SwapOutlined } from '@ant-design/icons';
import { truncateAddress } from "@/utils";
import { Network, networks } from "@/configs";
import Image from "next/image";
import classes from "./nav.module.scss"
export default function Nav() {
    const { connect, disconnect } = useAuth()
    const { account, chainId, connector } = useWeb3React()
    const [isLogin, setIsLogin] = useState(false)
    const [networkChanging, setNetworkChanging] = useState(false)
    const login = useCallback(async () => {
        await connect();
    }, [connector])
    useEffect(() => {
        setIsLogin(account ? true : false)
    }, [account])
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setNetworkChanging(false);
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setNetworkChanging(false)
    };
    const switchNetwork = useCallback(async (network: Network) => {
        if (connector) {
            setNetworkChanging(true)
            try {
                //切换网络
                await connector.provider?.request({
                    method: "wallet_switchEthereumChain",
                    params: [{ chainId: network.chainId }],
                })
                setIsModalOpen(false);
            } catch (e: any) {
                if (e.code != 4001) {
                    await connector.provider?.request({
                        method: 'wallet_addEthereumChain',
                        params: [network]
                    })
                    setIsModalOpen(false);
                }

            } finally {
                setNetworkChanging(false)
            }
        }

    }, [connector])

    const items: MenuProps['items'] = [
        {
            key: 'disconnect',
            label: (
                <div className="flex items-center gap-1" onClick={disconnect}>
                    <ApiOutlined />
                    断开连接
                </div>
            ),
        },
    ];
    return (<>
        <div className=" sticky top-0 left-0 right-0 p-6  border-b">
            <div className="flex justify-between items-center">
                <div>
                    <div className="text-2xl">智能合约调试工具</div>
                    <p className="text-gray-400 mt-2">通过ABI直接调用合约方法，无需验证合约。</p>
                </div>
                {isLogin ?
                    <div className="flex items-center gap-4">
                        <ChainInfo chainId={chainId} showModal={showModal} />
                        <Dropdown menu={{ items }} placement="bottomRight" arrow>
                            <Button type="primary" icon={<DownOutlined />} iconPosition="end">{truncateAddress(account)}</Button>
                        </Dropdown>
                    </div>
                    : <Button onClick={login}>Connect MetaMask</Button>}
            </div>

        </div>
        <Modal title="选择网络" open={isModalOpen} onCancel={handleCancel} className={classes.modal_root} width={600} footer={null} maskClosable={false}>
            <Spin spinning={networkChanging} tip={<div className=" text-xl mt-7 font-bold">请在MetaMask中确认网络切换请求...</div>} size="large">
                <div className="my-4">请在下方列表中选择需要切换的网络</div>

                <div className={classes.networks_wrap}>
                    {networks.map((network: Network, index: number) => {
                        return <div key={index} className={Number(network.chainId) !== Number(chainId) ? classes.network_item : classes.network_current_item} onClick={() => switchNetwork(network)}>
                            {(network.iconUrls && network.iconUrls[0])
                                ? <Image src={network?.iconUrls[0]} width={30} height={30} style={{ maxHeight: "30px" }} alt={network.chainName} />
                                : <Image src="/images/other.svg" width={20} height={20} alt={network.chainName} />}
                            <div>
                                <div>{network.chainName}</div>
                                <div className={classes.chain_id}>Chain Id: {Number(network.chainId)}</div>
                            </div>
                        </div>
                    })}
                </div >
                <div className="text-right mt-4">
                    <Button onClick={handleCancel}>关闭</Button>
                </div>
            </Spin>
        </Modal>
    </>
    )
}

function ChainInfo({ chainId, showModal }: { chainId?: string | number, showModal: () => void }) {
    const network = networks.find(network => Number(network.chainId) == Number(chainId))
    return (<Button onClick={showModal} icon={<SwapOutlined />} iconPosition="end">
        <div className="flex gap-1 items-center py-2">
            {(network && network.iconUrls && network.iconUrls[0])
                ? <Image src={network?.iconUrls[0]} width={20} height={20} alt={network.chainName} />
                : <GlobalOutlined />}
            <span className="text-xs">{network?.chainName || `Unknow Network (ChainId: ${chainId})`}</span>
        </div>

    </Button>)
}