import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useTranslations } from "next-intl";
import { Button, message, Modal } from "antd";
import { PlusOutlined, UngroupOutlined } from "@ant-design/icons";
import { Contract } from "@/types";
import { useContractManager } from "@/hooks";
import ContractEditor from "./ContractEditor";
import AddContractByPasteJSON from "./AddContractByPasteJSON";
import AddContractByUploadJSON from "./AddContractByUploadJSON";
import JSONDataFormatTips from "./JSONDataFormatTips";
import { AddContractBtn } from "./ContractList";

export type ViaType = "form" | "upload" | "paste";
export interface ContractModalRef {
    showContractModal: (via: ViaType, contract?: Contract) => void;
}
const ContractModal = forwardRef(function ContractModal(props, ref) {
    const [isContractModalOpen, setIsContractModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<ViaType>('form')
    const [messageApi, contextHolder] = message.useMessage();
    const [isTipsModalOpen, setIsTipsModalOpen] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [contractEditing, setContractEditing] = useState<Contract | undefined>(undefined)
    const { contractsCount, batchAddContract } = useContractManager()
    const t = useTranslations();

    useImperativeHandle(ref, () => {
        return {
            showContractModal: (via: ViaType, contract?: Contract) => initContractModal(via, contract)
        }
    }, [])

    const initContractModal = (via: ViaType, contract?: Contract) => {
        setActiveTab(via)
        setContractEditing(contract || undefined)
        setIsContractModalOpen(true)
    }
    const handleOk = () => {
        setIsContractModalOpen(false);
    };

    const handleCancel = () => {
        setActiveTab('form')
        setIsContractModalOpen(false);

    };
    const addContractCallback = (count: number) => {
        messageApi.open({
            type: 'success',
            content: t('successfully_added_records', { count }),
        });
        setIsContractModalOpen(false);
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
    const actionAddContract = (via: ViaType) => {
        setActiveTab(via)
        setContractEditing(undefined)
        setIsContractModalOpen(true);
    }
    useEffect(() => {
        setIsTipsModalOpen(contractsCount > 0 ? false : true)
    }, [contractsCount])
    return (
        <>
            {contextHolder}
            <Modal title={<div className="text-orange-500 text-base mt-2">{t('no_contract_found')}</div>} open={isTipsModalOpen} footer={null} maskClosable={false} closable={false} centered zIndex={100}>
                <div className=" text-base my-4">{t('you_can_choose')}</div>

                <div className="flex gap-4">
                    <div className="border rounded basis-1/2 p-4 flex flex-col justify-between gap-6">
                        <div>{t("choose_1")}</div>
                        <Button icon={<UngroupOutlined />} onClick={initContract} loading={loading}>{t('try_it')}</Button>
                    </div>

                    <div className="border rounded basis-1/2 p-3 flex flex-col justify-between gap-4">
                        <div>{t("choose_1")}</div>
                        <AddContractBtn action={actionAddContract} />
                    </div>
                </div>
            </Modal >
            <Modal title={contractEditing ? t('edit_contract') : t('add_contract')} open={isContractModalOpen} onOk={handleOk} onCancel={handleCancel} footer={null} maskClosable={false} width={800} zIndex={102}>
                {activeTab == 'form' ? <ContractEditor contract={contractEditing} callback={addContractCallback} handleCancel={handleCancel} /> : <JSONDataFormatTips />}
                {activeTab == 'upload' && <AddContractByUploadJSON callback={addContractCallback} handleCancel={handleCancel} />}
                {activeTab == 'paste' && <AddContractByPasteJSON callback={addContractCallback} handleCancel={handleCancel} />}
            </Modal>
        </>
    )
})

export default ContractModal