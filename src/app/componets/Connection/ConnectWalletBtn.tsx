import { useAuth } from "@/hooks/useAuth";
import { useWeb3React } from "@web3-react/core";
import { Button, Modal } from "antd";
import { useCallback, useState } from "react";
import { IconMetaMask } from "./iconMetaMask";

export default function ConnectWalletBtn(props: { [propName: string]: any }) {
    const { connect, disconnect } = useAuth()
    const { account, chainId, connector } = useWeb3React()
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const login = useCallback(async () => {
        const res: any = await connect();
        if (res && res?.error == 'METAMASK_NOT_INSTALLED') {
            console.log(res)
            setIsModalOpen(true);
        }
    }, [connector])
    return (<>
        <Button onClick={login} type="primary" {...props} >Connect MetaMask</Button>
        <Modal title="" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={null}>
            <div className="flex flex-col justify-center items-center gap-6 my-6">
                <IconMetaMask className="w-28 h-28" />
                <div className="text-xl">请先安装 <a href="https://metamask.io/" target="_blank">MetaMask</a></div>
            </div>
        </Modal>
    </>)
}