"use client"
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Modal } from "antd";
import { useLocalStorageState } from "ahooks";
import { Contract } from "@/types";
import ContractEditor, { ContractEditorRef } from "../Contracts/ContractEditor";
import { LocalStorageContracts, LocalStorageCurrentContract } from "@/constants";
import ContractList from "./ContractList";
import ContractInfo from "./ContractInfo";
import { PlusOutlined, UngroupOutlined } from "@ant-design/icons";
import { internalTestContract } from "@/configs";


export default function Contracts() {
    const contractEditorRef = useRef<ContractEditorRef>(null)
    const [localContracts, setLocalContracts] = useLocalStorageState<Contract[]>(
        LocalStorageContracts,
        {
            defaultValue: [],
            listenStorageChange: true
        },
    );
    const [currentContractHash, setCurrentContractHash] = useLocalStorageState<string | undefined | null>(
        LocalStorageCurrentContract,
        {
            defaultValue: '',
            listenStorageChange: true
        },
    );

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const [contract, setContract] = useState<Contract | null>(null)

    const actionAddContract = () => {
        contractEditorRef?.current?.showContractEditor()
    };

    const actionEditContract = useCallback(() => {
        if (contract) {
            contractEditorRef?.current?.showContractEditor(contract)
        }
    }, [contract]);

    const initContract = () => {
        setLocalContracts([internalTestContract])
        setCurrentContractHash(internalTestContract.hash)
        setIsModalOpen(false);
    }

    useEffect(() => {
        if (currentContractHash && localContracts) {
            const target = localContracts.find(contract => contract.hash == currentContractHash);
            setContract(target || null)
        } else {
            setContract(null)
        }
    }, [localContracts, currentContractHash])

    useEffect(() => {
        setIsModalOpen(localContracts && localContracts.length > 0 ? false : true)
    }, [localContracts])

    return (<>
        <ContractList add={actionAddContract} />
        <ContractInfo edit={actionEditContract} />
        <ContractEditor ref={contractEditorRef} />
        <Modal title="" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={null} maskClosable={false} closable={false} centered zIndex={100}>
            <div className="h-52 flex flex-col justify-center text-center gap-6 w-60 mx-auto">
                <div className="text-orange-500 text-base">当前没有可用的智能合约</div>
                <Button icon={<UngroupOutlined />} onClick={initContract} size="large">使用系统内置测试合约</Button>
                <Button icon={<PlusOutlined />} type="primary" onClick={actionAddContract} size="large">新增合约</Button>
            </div>
        </Modal>
    </>)
}

