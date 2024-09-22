"use client"
import { EventLog, Log, TransactionLog, LogType, EventItem } from "@/types";
import Card from "../Layout/Card";
import { lazy, useEffect, useRef } from "react";
import { Button, Empty } from "antd";
import { ClearOutlined } from "@ant-design/icons";
// import ReactJson from 'react-json-view'
const LazyReactJson = lazy(() => import("react-json-view"))

export default function Logs({ logs, clearLogs }: { logs: Log[], clearLogs: () => void }) {
    const logsRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (logsRef && logsRef.current) {
            logsRef?.current?.scrollTo({ top: logsRef?.current.scrollHeight, behavior: 'smooth' });
        }
    }, [logsRef, logs.length])
    return <Card title={<div>Logs<span className="text-xs text-orange-400 ml-2 font-mono" >JSON不支持 bigint, bigint 会转为 string 展示</span></div>}
        extra={<Button icon={<ClearOutlined />} onClick={clearLogs} size="small">清除Logs</Button>}
        rootClassName="h-full flex flex-col" >
        <div className="py-4 text-xs whitespace-normal break-all h-full overflow-auto  box-border " ref={logsRef}>
            {(logs && logs.length > 0) ? logs.map((log: Log, index: number) => {
                if (log.type == "Event") {
                    return <Event log={log as EventLog} key={index} />
                } else if (log.type == "TransactionMined") {
                    return <TransactionMined log={log as TransactionLog} key={index} />
                } else {
                    return <TransactionWait log={log as TransactionLog} key={index} />
                }

            })
                : <div className="h-full flex flex-col justify-center"><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /></div>
            }
        </div>

    </Card>
}

function TransactionWait({ log }: { log: TransactionLog }) {
    return (
        <div className="flex gap-1 mb-1">
            <span className="text-gray-400 shrink-0">[{log.createdAt}]</span>
            <div>
                <div className="font-bold  font-mono">
                    <FunctionRender name={log.function} values={log.params || []} />
                    {log.value && <span className="text-blue-400 ml-4">支付 {log.value}</span>}

                </div>
                <div>
                    {log.hash && <div>
                        <a href={`${log.explorer}tx/${log.hash}`} target="_blank" title="在区块浏览器查看" className="text-blue-400 underline hover:text-orange-500">{log.hash}</a> | 等待确认...
                    </div>}
                    <div> {(log.result && typeof (log.result) == 'object') ? <LazyReactJson src={log.result} name={false} /> : log.result}</div>
                    {log.error && <div className="text-red-400">{log.error.toString()}</div>}
                </div>
            </div>

        </div>
    )
}
function TransactionMined({ log }: { log: TransactionLog }) {
    return (<div className="flex gap-1 mb-1">
        <span className="text-gray-400 shrink-0">[{log.createdAt}]</span>
        <div><a href={`${log.explorer}tx/${log.hash}`} target="_blank" title="在区块浏览器查看" className="text-blue-400 underline hover:text-orange-500">{log.hash}</a> | 已确认!</div>
    </div>)
}
function Event({ log }: { log: EventLog }) {
    return (<div className="flex gap-1 mb-1">
        <span className="text-gray-400 shrink-0">[{log.createdAt}]</span>
        <div className="break-keep text-blue-800">Event:</div>
        <div>
            {log.events.map((event: EventItem, index: number) => {
                return <div key={index}> <FunctionRender key={index} name={event.name} values={event.values} /></div>
            })}
        </div>
    </div>)
}

export function FunctionRender({ name, values }: { name: string, values: any[] }) {
    return (<span className="font-bold font-mono">
        <span className="text-red-800">{name}</span>
        <span className="text-blue-800">{'('}</span>
        {values.map((value: any, index: number) => {
            return <span key={index}><span className="text-orange-300">{value.toString()}</span>{index != values.length - 1 && <span className="text-gray-400">,</span>}</span>
        })}
        <span className="text-blue-800">{')'}</span>
    </span>)
}