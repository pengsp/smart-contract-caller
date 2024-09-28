"use client"
import { useRef } from "react";
import { Contract, ViaType } from "@/types";
import ContractList from "./ContractList";
import ContractInfo from "./ContractInfo";
import NoContractTip from "./Modals/NoContractTip";
import AddContractByUploadJSON from "./Modals/AddContractByUploadJSON";
import AddContractByPasteJSON from "./Modals/AddContractByPasteJSON";
import { useTranslations } from "next-intl";
import AddContractByForm from "./Modals/AddContractByForm";

export interface ContractModalRef {
    show: (contract?: Contract) => void;
}

export default function Contracts() {
    const addContractByFormRef = useRef<ContractModalRef>(null)
    const addContractByPasteJSONRef = useRef<ContractModalRef>(null)
    const addContractByUploadJSONRef = useRef<ContractModalRef>(null)
    const t = useTranslations();
    const actionAddContract = (via: ViaType) => {
        if (via == 'paste') {
            addContractByPasteJSONRef?.current?.show()
        } else if (via == 'form') {
            addContractByFormRef?.current?.show()
        } else if (via == 'upload') {
            addContractByUploadJSONRef?.current?.show()
        }
    };

    const actionEditContract = (contract: Contract) => {
        addContractByFormRef?.current?.show(contract)
    }
    return (<>
        <ContractList add={actionAddContract} />
        <ContractInfo action={actionEditContract} />
        <NoContractTip add={actionAddContract} />
        <AddContractByUploadJSON ref={addContractByUploadJSONRef} />
        <AddContractByPasteJSON ref={addContractByPasteJSONRef} />
        <AddContractByForm ref={addContractByFormRef} />
    </>)
}
