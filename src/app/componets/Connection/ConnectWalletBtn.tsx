"use client"
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button, Modal } from "antd";
import { ExportOutlined } from "@ant-design/icons";
import { useAuth } from "@/hooks/useAuth";
import { IconMetaMask } from "../Icons";

export default function ConnectWalletBtn({ danger, type }: { danger?: boolean, type?: any }) {
    const t = useTranslations();
    const { connect } = useAuth()
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const login = async () => {
        const res: any = await connect();
        if (res && res?.error == 'METAMASK_NOT_INSTALLED') {
            setIsModalOpen(true);
        }
    }

    return (<>
        <Button onClick={login} danger={danger} type={type} ><IconMetaMask className="w-6 h-6" />{t('connect_metamask')}</Button>
        <Modal title="" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={null}>
            <div className="flex flex-col justify-center items-center gap-6 my-6">
                <IconMetaMask className="w-28 h-28" />
                <div className="text-orange-400">{t('metamask_not_install')}</div>
                <div className="text-xl">
                    <a href="https://metamask.io/" target="_blank">
                        <Button icon={<ExportOutlined />} iconPosition="end" type="primary">{t('install_metamask')}</Button>
                    </a>
                </div>
            </div>
        </Modal>
    </>)
}