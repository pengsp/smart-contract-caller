"use client"
import { LocalStorageContracts, LocalStorageCurrentContract } from "@/constants";
import { Contract } from "@/types";
import { useLocalStorageState } from "ahooks";
import { useCallback, useEffect, useState } from "react";
import Functions from "./components/Functions";
import Caller from "./components/Caller";
import Logs from "./components/Logs";

export default function OperationPanel() {
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
    const [currentFunction, setCurrentFunction] = useState<Record<string, any> | null>()
    const [logs, setLogs] = useState([])
    useEffect(() => {
        if (currentContractHash && localContracts) {
            const target = localContracts.find(contract => contract.hash == currentContractHash);
            setContract(target || null)
        } else {
            setContract(null)
        }
    }, [localContracts, currentContractHash])

    const updateLogs = useCallback(() => {

    }, [logs])
    const clearLogs = () => {
        setLogs([])
    }
    return (<div className="border  p-4 mt-4 rounded bg-white grow flex flex-col">
        <div className="border-l-2  pl-2 mb-4">操作面板</div>
        {contract
            ? <div className="flex gap-4 grow">
                <Functions contract={contract} select={(functionItem) => setCurrentFunction(functionItem)} />
                <div className="grow flex flex-col gap-4">
                    <div className="grow">
                        <Logs logs={logs} />
                    </div>
                    <Caller contract={contract} functionInfo={currentFunction} updateLogs={() => { }} />

                </div>
            </div>
            : "暂无数据"}
    </div>)
}


