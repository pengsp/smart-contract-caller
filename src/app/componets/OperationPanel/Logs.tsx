"use client"
import { lazy, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Button, Empty } from "antd";
import { ClearOutlined } from "@ant-design/icons";
import { EventLog, Log, TransactionLog, EventItem } from "@/types";
import Card from "../Layout/Card";
const LazyReactJson = lazy(() => import("react-json-view"))

export default function Logs({ logs, clearLogs }: { logs: Log[], clearLogs: () => void }) {
    const logsRef = useRef<HTMLDivElement>(null);
    const t = useTranslations();

    useEffect(() => {
        if (logsRef && logsRef.current) {
            logsRef?.current?.scrollTo({ top: logsRef?.current.scrollHeight, behavior: 'smooth' });
        }
    }, [logsRef, logs.length])

    return <Card title={<div>{t('logs')}<span className="text-xs text-orange-400 ml-2 font-serif " >{t('json_unsupported_bigint_tips')}</span></div>}
        extra={<Button icon={<ClearOutlined />} onClick={clearLogs} size="small" variant="filled" color="primary">{t('clear_logs')}</Button>}
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
                : <div className="h-full flex flex-col justify-center"><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('empty_tip')} /> </div>
            }
        </div>

    </Card>
}

function TransactionWait({ log }: { log: TransactionLog }) {
    const t = useTranslations();

    return (
        <div className="flex gap-1 mb-1">
            <span className="text-gray-400 shrink-0">[{log.createdAt}]</span>
            <div>
                <div className="font-bold  font-mono">
                    <FunctionRender name={log.function} values={log.params || []} />
                    {log.value && <span className="text-blue-400 ml-4">{t('pay')} {log.value}</span>}

                </div>
                <div>
                    {log.hash && <div>
                        {log.explorer
                            ? <a href={`${log.explorer}tx/${log.hash}`} target="_blank" title={t('view_on_explorer', { chainName: '' })} className="text-blue-400 underline hover:text-orange-500">{log.hash}</a>
                            : log.hash} | {t('waiting_confirm')}
                    </div>}
                    <div> {(log.result && typeof (log.result) == 'object') ? <LazyReactJson src={log.result} name={false} /> : log.result}</div>
                    {log.error && <div className="text-red-400">{log.error.toString()}</div>}
                </div>
            </div>

        </div>
    )
}
function TransactionMined({ log }: { log: TransactionLog }) {
    const t = useTranslations();

    return (<div className="flex gap-1 mb-1">
        <span className="text-gray-400 shrink-0">[{log.createdAt}]</span>
        <div>
            {log.explorer
                ? <a href={`${log.explorer}tx/${log.hash}`} target="_blank" title={t('view_on_explorer', { chainName: '' })} className="text-blue-400 underline hover:text-orange-500">{log.hash}</a>
                : log.hash}  | {t('confirmed')}
        </div>
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