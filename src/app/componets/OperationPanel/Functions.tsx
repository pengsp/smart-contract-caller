
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Contract, FunctionItem } from "@/types";
import { Empty, Select, Skeleton } from "antd";
import Card from "../Layout/Card";
import classes from "./functions.module.scss";
import { defaultContract } from "@/constants";


export default function Functions({ contract, select }: { contract: Contract | null, select: (functionItem: FunctionItem) => void }) {
    const { abi, hash } = contract || defaultContract;
    const [currentFunction, setCurrentFunction] = useState<FunctionItem | null>(null)
    const [pageLoading, setPageLoading] = useState(true)
    const t = useTranslations();

    const functions: any = abi.filter((item: any, index: number) => {
        item.rawIndex = index;
        if (item.name && item.type === 'function') {
            item.value = item.name;
            item.label = item.name;
            return item;
        }
    })

    const selectFunction = (item: any) => {
        select(item)
        setCurrentFunction(item)
    }
    useEffect(() => {
        select(functions[0])
        setCurrentFunction(functions[0])
        setPageLoading(false)
    }, [hash])

    return (
        <Card title={`${t('function_list')} [${functions.length || 0}]`} rootClassName="h-full overflow-hidden gap-4 flex flex-col shrink-0 min-w-64">
            <Select
                showSearch
                style={{ width: '100%' }}
                placeholder={t('search_function_name')}
                options={functions}
                value={currentFunction?.value || null}
                optionRender={(option) => {
                    return <>{option.data.name}({option.data.inputs.length > 0 ? option.data.inputs.length : ''})</>
                }}
                onSelect={(e, option) => {
                    console.log(e, option)
                    selectFunction(option)
                }}
                dropdownStyle={{ border: 0 }}
            />
            <div className={classes.root}>
                {pageLoading ? <FunctionListSkeleton />
                    : (functions.length > 0 ? functions.map((item: any, index: number) => {
                        return <div key={`${item.name}-${index}`} className={currentFunction?.name === item.name ? classes.current : classes.item} onClick={() => selectFunction(item)}>
                            <span className={classes.index}> {index + 1}:</span>{item.name}({item.inputs.length > 0 ? item.inputs.length : ''})
                        </div>

                    }) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('empty_tip')} />)
                }
            </div>
        </Card>)
}

function FunctionListSkeleton() {
    return (<>
        {[80, 60, 95, 80, 70, 100, 80, 60, 70, 90, 60, 95, 40,].map((w, index) => <div key={index} style={{ width: `${w}%` }}><Skeleton.Button active size="small" block className="mb-1" /></div>)}
    </>)
}