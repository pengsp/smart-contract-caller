import { Contract } from "@/types";
import { Empty, Select, Skeleton } from "antd";
import { useEffect, useState } from "react";
import Card from "../Layout/Card";
import classes from "./functions.module.scss";
import { defaultContract } from "@/constants";


export default function Functions({ contract, select }: { contract: Contract | null, select: (functionItem: Record<string, any> | null) => void }) {
    const { abi = [], name = '', hash = '', address = '' } = contract || defaultContract;
    const [currentFunction, setCurrentFunction] = useState<Record<string, any> | null>(null)
    const [pageLoading, setPageLoading] = useState(true)
    const functions = abi.filter((item: any) => {
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
        <Card title={`方法列表 [${functions.length || 0}]`} rootClassName="h-full overflow-hidden gap-4 flex flex-col shrink-0 min-w-64">
            <Select
                showSearch
                style={{ width: '100%' }}
                placeholder="搜索方法名"
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
                {pageLoading ? Array(10).fill(1).map((_, index) => <div key={index}><Skeleton.Button active size="small" block className="mb-1" /></div>)
                    : (functions.length > 0 ? functions.map((item: any, index: number) => {
                        return <div key={`${item.name}-${index}`} className={currentFunction?.name === item.name ? classes.current : classes.item} onClick={() => selectFunction(item)}>
                            <span className={classes.index}> {index + 1}:</span>  {item.name}({item.inputs.length > 0 ? item.inputs.length : ''})
                        </div>

                    }) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />)
                }
            </div>
        </Card>)
}