"use client"
import { LocalStorageContracts, LocalStorageCurrentContract } from "@/constants";
import { Contract } from "@/types";
import { useLocalStorageState } from "ahooks";
import { useCallback, useEffect, useState } from "react";
import Functions from "./components/Functions";
import Caller from "./components/Caller";
import Logs from "./components/Logs";
import { Spin } from "antd";

export default function OperationPanel() {
    const [pageLoading, setPageLoading] = useState(true)
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
    return (<>
        <div className="flex gap-4 h-full overflow-hidden">
            <Functions contract={contract} select={(functionItem) => setCurrentFunction(functionItem)} />
            <div className="grow flex flex-col gap-4">
                <div className="basis-1/2">
                    <Logs logs={logs} />
                </div>
                <div className="basis-1/2">
                    <Caller contract={contract} functionInfo={currentFunction} updateLogs={() => { }} />
                </div>
            </div>
        </div>
    </>)
}


