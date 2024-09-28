import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Button, message, Modal } from "antd";
import { UngroupOutlined } from "@ant-design/icons";
import { Contract, ViaType } from "@/types";
import { useContractManager } from "@/hooks";
import AddContractBtn from "../AddContractBtn";

export interface ContractModalRef {
    showContractModal: (via: ViaType, contract?: Contract) => void;
}
export default function NoContractTip({ add }: { add: (via: ViaType) => void }) {
    const [isTipsModalOpen, setIsTipsModalOpen] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const { contractsCount, batchAddContract } = useContractManager()
    const t = useTranslations();
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
        add(via)
    }
    useEffect(() => {
        setIsTipsModalOpen(contractsCount > 0 ? false : true)
    }, [contractsCount])
    return (
        <>
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
        </>
    )
}

