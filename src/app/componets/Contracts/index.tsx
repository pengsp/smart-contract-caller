"use client"
import { useRef } from "react";
import { Contract } from "@/types";
import ContractList from "./ContractList";
import ContractInfo from "./ContractInfo";
import ContractModal, { ContractModalRef, ViaType } from "./ContractModal";

export default function Contracts() {
    const contractModalRef = useRef<ContractModalRef>(null)

    const actionAddContract = (via: ViaType) => {
        contractModalRef?.current?.showContractModal(via, undefined)
    };

    const actionEditContract = (contract: Contract) => {
        contractModalRef?.current?.showContractModal("form", contract)
    };

    return (<>
        <ContractList add={actionAddContract} />
        <ContractInfo edit={actionEditContract} />
        <ContractModal ref={contractModalRef} />
    </>)
}
