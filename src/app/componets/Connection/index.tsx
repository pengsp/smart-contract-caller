'use client'
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Button, Dropdown, } from "antd";
import type { MenuProps } from 'antd';
import { useWeb3React } from "@web3-react/core";
import { useAuth } from "@/hooks/useAuth";
import { ApiOutlined, DownOutlined } from "@ant-design/icons";
import { truncateAddress } from "@/utils";

import ConnectWalletBtn from "./ConnectWalletBtn";
import Networks from "../Networks";

export default function Connection() {
    const [isLogin, setIsLogin] = useState(false)
    const { disconnect } = useAuth()
    const { account } = useWeb3React()
    const t = useTranslations();


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
                <Networks />
                <Dropdown menu={{ items }} placement="bottomRight" arrow>
                    <Button type="primary" icon={<DownOutlined />} iconPosition="end">{truncateAddress(account)}</Button>
                </Dropdown>
            </div>
            : <ConnectWalletBtn />}
    </>)
}

