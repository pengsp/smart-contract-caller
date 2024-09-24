"use client"
import { useCallback, useState } from "react";
import dayjs from "dayjs";
import Functions from "./Functions";
import Caller from "./Caller";
import Logs from "./Logs";
import { Log, FunctionItem } from "@/types";
import { useContractManager } from "@/hooks";


export default function OperationPanel() {
    const { currentContract } = useContractManager()
    const [currentFunction, setCurrentFunction] = useState<FunctionItem | null | undefined>()
    const [logs, setLogs] = useState<Log[]>([])

    const updateLogs = useCallback((log: Log) => {
        log.createdAt = dayjs().format("HH:mm:ss")
        // console.log('updateLogs', log)
        setLogs(logs => [...logs, log])
    }, [logs])

    const clearLogs = useCallback(() => {
        setLogs([])
    }, [logs])

    return (<>
        <div className="flex gap-4 h-full overflow-hidden">
            <Functions contract={currentContract} select={(functionItem) => setCurrentFunction(functionItem)} />
            <div className="grow flex flex-col gap-4">
                <div className="basis-1/2  overflow-hidden">
                    <Logs logs={logs} clearLogs={clearLogs} />
                </div>
                <div className="basis-1/2 overflow-hidden ">
                    <Caller contract={currentContract} functionInfo={currentFunction} updateLogs={updateLogs} />
                </div>

            </div>
        </div>
    </>)
}


