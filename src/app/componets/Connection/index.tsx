"use client"

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Button, Divider, Dropdown, Modal, Spin } from "antd";
import type { MenuProps } from 'antd';
import { useWeb3React } from "@web3-react/core";
import { useAuth } from "@/hooks/useAuth";
import { ApiOutlined, DownOutlined, GithubOutlined, GlobalOutlined, SwapOutlined } from "@ant-design/icons";
import { truncateAddress } from "@/utils";
import { Network } from "@/types";
import { networks } from "@/configs";
import NetworkItem from "../NetworkItem";
import classes from "./connection.module.scss"
import ConnectWalletBtn from "./ConnectWalletBtn";

export default function Connection() {
    const [isLogin, setIsLogin] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [networkChanging, setNetworkChanging] = useState(false)
    const { disconnect } = useAuth()
    const { account, chainId, connector } = useWeb3React()

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

    useEffect(() => {
        setIsLogin(account ? true : false)
    }, [account])
    return (<>
        {isLogin ?
            <div className="flex items-center gap-4">
                <ChainInfo chainId={chainId} showModal={showModal} />
                <Dropdown menu={{ items }} placement="bottomRight" arrow>
                    <Button type="primary" icon={<DownOutlined />} iconPosition="end">{truncateAddress(account)}</Button>
                </Dropdown>
            </div>
            : <ConnectWalletBtn />}
        <Modal title="选择网络" open={isModalOpen} onCancel={handleCancel} className={classes.modal_root} width={600} footer={null} maskClosable={false}>
            <Spin spinning={networkChanging} tip={<div className=" text-xl mt-7 font-bold">请在MetaMask中确认网络切换请求...</div>} size="large">
                <div className="my-4">请在下方列表中选择需要切换的网络</div>

                <div className={classes.networks_wrap}>
                    {networks.map((network: Network) => {
                        return <div onClick={() => switchNetwork(network)} key={network.chainId} >
                            <NetworkItem network={network} selected={Number(network.chainId) == Number(chainId)} />
                        </div>
                    })}
                    <div className=""></div>
                </div >
                <Divider />
                {/* 
                <div className="">
                    <div>没有你需要的网络？</div>
                    <Button onClick={()=>{}}>新增网络</Button>
                </div> */}
                <div className="text-right mt-4">
                    <Button onClick={handleCancel}>关闭</Button>
                </div>
            </Spin>
        </Modal>
    </>)
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