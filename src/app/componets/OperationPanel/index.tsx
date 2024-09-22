"use client"
import { LocalStorageContracts, LocalStorageCurrentContract } from "@/constants";
import { Contract, EventLog, TransactionLog, Log, FunctionItem } from "@/types";
import { useLocalStorageState } from "ahooks";
import { useCallback, useEffect, useState } from "react";
import Functions from "./Functions";
import Caller from "./Caller";
import Logs from "./Logs";
import dayjs from "dayjs";

import UTT_INIT_DATA from "../../../configs/UTT-init-data.json"
const INIT_TEST_CONTRACT = process.env.NEXT_PUBLIC_INIT_TEST_CONTRACT === "true" ? true : false

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
    const [currentFunction, setCurrentFunction] = useState<FunctionItem | null | undefined>()
    const [logs, setLogs] = useState<Log[]>([])
    useEffect(() => {
        if (currentContractHash && localContracts) {
            const target = localContracts.find(contract => contract.hash == currentContractHash);
            setContract(target || null)
        } else {
            setContract(null)
        }
    }, [localContracts, currentContractHash])

    const updateLogs = useCallback((log: Log) => {
        log.createdAt = dayjs().format("HH:mm:ss")
        // console.log('updateLogs', log)
        setLogs(logs => [...logs, log])
    }, [logs])
    const clearLogs = useCallback(() => {
        setLogs([])
    }, [logs])

    /*  initialize the test contract*/
    useEffect(() => {
        if (INIT_TEST_CONTRACT && localContracts) {
            const checkInitStatus = localContracts?.find(contract => contract.hash == UTT_INIT_DATA.hash)
            if (!checkInitStatus) {
                setLocalContracts([...localContracts, UTT_INIT_DATA])
                setCurrentContractHash(UTT_INIT_DATA.hash)
            }
        }
    }, [localContracts])
    return (<>
        <div className="flex gap-4 h-full overflow-hidden">
            <Functions contract={contract} select={(functionItem) => setCurrentFunction(functionItem)} />
            <div className="grow flex flex-col gap-4">
                <div className="basis-1/2  overflow-hidden">
                    <Logs logs={logs} clearLogs={clearLogs} />
                </div>
                <div className="basis-1/2 overflow-hidden ">
                    <Caller contract={contract} functionInfo={currentFunction} updateLogs={updateLogs} />
                </div>

            </div>
        </div>
    </>)
}


