import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Button, message, Modal, Tabs } from "antd";
import type { TabsProps } from 'antd';
import { PlusOutlined, UngroupOutlined } from "@ant-design/icons";
import { Contract } from "@/types";
import { useContractManager } from "@/hooks";
import ContractEditor from "./ContractEditor";
import AddContractByPasteJSON from "./AddContractByPasteJSON";
import AddContractByUploadJSON from "./AddContractByUploadJSON";
import JSONDataFormatTips from "./JSONDataFormatTips";

type TabKeys = "manual" | "upload" | "paste";
export interface ContractModalRef {
    showContractModal: (key: TabKeys, contract?: Contract) => void;
}
const ContractModal = forwardRef(function ContractModal(props, ref) {
    const [isContractModalOpen, setIsContractModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<TabKeys>('manual')
    const [messageApi, contextHolder] = message.useMessage();
    const [isTipsModalOpen, setIsTipsModalOpen] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [contractEditing, setContractEditing] = useState<Contract | undefined>(undefined)
    const { contractsCount, batchAddContract } = useContractManager()

    useImperativeHandle(ref, () => {
        return {
            showContractModal: (key: TabKeys, contract?: Contract) => initContractModal(key, contract)
        }
    }, [])

    const initContractModal = (key: TabKeys, contract?: Contract) => {
        setActiveTab(key)
        setContractEditing(contract || undefined)
        setIsContractModalOpen(true)
    }
    const handleOk = () => {
        setIsContractModalOpen(false);
    };

    const handleCancel = () => {
        setActiveTab('manual')
        setIsContractModalOpen(false);

    };
    const addContractCallback = (count: number) => {
        messageApi.open({
            type: 'success',
            content: `成功增加${count}条记录`,
        });
        setIsContractModalOpen(false);
    };
    const items: TabsProps['items'] = [

        {
            key: 'manual',
            label: '手动录入',
            children: null,
        },
        {
            key: 'upload',
            label: '上传JSON文件',
            children: null,
        },
        {
            key: 'paste',
            label: '粘贴JSON数据',
            children: null,
        }
    ];
    const onTabChange = (key: any) => {
        setActiveTab(key)
    };
    const initContract = () => {
        setLoading(true)
        try {
            fetch('/init-contract.json').then(response => response.json()).then(initData => {
                batchAddContract(initData)
            })
        } catch (e) {
            console.log('initContract', e)
        } finally {
            setLoading(false)
        }
    }
    const actionAddContract = () => {
        setActiveTab('manual')
        setContractEditing(undefined)
        setIsContractModalOpen(true);
    }
    useEffect(() => {
        setIsTipsModalOpen(contractsCount > 0 ? false : true)
    }, [contractsCount])
    return (
        <>
            {contextHolder}
            <Modal title="" open={isTipsModalOpen} footer={null} maskClosable={false} closable={false} centered zIndex={100}>

                <div className="text-orange-500 text-base mt-2 mb-6">当前没有可用的智能合约,您可以选择以下操作：</div>

                <div className="flex gap-4">
                    <div className="border rounded basis-1/2 p-4 flex flex-col justify-between gap-6">
                        <div>系统内置了一个测试合约，方便你熟悉工具</div>
                        <Button icon={<UngroupOutlined />} onClick={initContract} loading={loading}>立即使用</Button>
                    </div>

                    <div className="border rounded basis-1/2 p-3 flex flex-col justify-between gap-4">
                        <div>提供合约地址和合约ABI等信息,新增合约</div>
                        <Button icon={<PlusOutlined />} type="primary" onClick={actionAddContract} disabled={loading}>新增合约</Button>
                    </div>
                </div>
            </Modal >
            <Modal title={contractEditing ? "编辑合约" : "新增合约"} open={isContractModalOpen} onOk={handleOk} onCancel={handleCancel} footer={null} maskClosable={false} width={800} centered zIndex={102}>
                {contractEditing ? <div className="h-6"></div> : <Tabs activeKey={activeTab} items={items} onChange={onTabChange} />}
                {activeTab == 'manual' ? <ContractEditor contract={contractEditing} callback={addContractCallback} handleCancel={handleCancel} /> : <JSONDataFormatTips />}
                {activeTab == 'upload' && <AddContractByUploadJSON callback={addContractCallback} handleCancel={handleCancel} />}
                {activeTab == 'paste' && <AddContractByPasteJSON callback={addContractCallback} handleCancel={handleCancel} />}
            </Modal>
        </>
    )
})

export default ContractModal