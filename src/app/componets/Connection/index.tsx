'use client'
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button, Divider, Dropdown, Modal, Spin } from "antd";
import type { MenuProps } from 'antd';
import { useWeb3React } from "@web3-react/core";
import { useAuth } from "@/hooks/useAuth";
import { ApiOutlined, DownOutlined, GlobalOutlined, SwapOutlined } from "@ant-design/icons";
import { truncateAddress } from "@/utils";
import { Network } from "@/types";
import { networks } from "@/configs";
import NetworkItem from "../NetworkItem";
import classes from "./connection.module.scss"
import ConnectWalletBtn from "./ConnectWalletBtn";

export default function Connection() {
    const t = useTranslations();
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
                    {t('disconnect')}
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
        <Modal title={t("switch_network")} open={isModalOpen} onCancel={handleCancel} className={classes.modal_root} width={600} footer={null} maskClosable={false}>
            <Spin spinning={networkChanging} tip={<div className=" text-lg mt-6 p-2 rounded text-violet-500 font-medium">{t("switch_network_loading")}</div>} size="large">
                <div className="my-4">{t("switch_network_tips")}</div>

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
                    <Button onClick={handleCancel}>{t("close")}</Button>
                </div>
            </Spin>
        </Modal>
    </>)
}

function ChainInfo({ chainId, showModal }: { chainId?: string | number, showModal: () => void }) {
    const network = networks.find(network => Number(network.chainId) == Number(chainId))
    return (
        <div className="flex gap-[4px] items-center h-[32px] border px-2 rounded-md cursor-pointer hover:border-blue-500 hover:text-blue-500" onClick={showModal} >
            {(network && network.iconUrls && network.iconUrls[0])
                ? <Image src={network?.iconUrls[0]} width={20} height={20} alt={network.chainName} />
                : <GlobalOutlined />}
            <span className="text-xs">{network?.chainName || `Unknow Network (ChainId: ${chainId})`}</span>
            <SwapOutlined />
        </div>
    )
}