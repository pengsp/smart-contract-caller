"use client"
import { Contract } from "@/types";
import { useCallback, useEffect, useRef, useState } from "react";
import ContractEditor, { ContractEditorRef } from "../Contracts/ContractEditor";
import { useLocalStorageState } from "ahooks";
import { LocalStorageContracts, LocalStorageCurrentContract } from "@/constants";
import ContractList from "./ContractList";
import ContractInfo from "./ContractInfo";


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
    const [contract, setContract] = useState<Contract | null>(null)

    const actionAddContract = () => {
        contractEditorRef?.current?.showContractEditor()
    };

    const actionEditContract = useCallback(() => {
        if (contract) {
            contractEditorRef?.current?.showContractEditor(contract)
        }
    }, [contract]);

    useEffect(() => {
        if (currentContractHash && localContracts) {
            const target = localContracts.find(contract => contract.hash == currentContractHash);
            setContract(target || null)
        } else {
            setContract(null)
        }
    }, [localContracts, currentContractHash])

    return (<>
        <ContractList add={actionAddContract} />
        <ContractInfo edit={actionEditContract} />
        <ContractEditor ref={contractEditorRef} />
    </>)
}

