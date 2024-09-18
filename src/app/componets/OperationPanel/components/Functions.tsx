import { Contract } from "@/types";
import { Card, Select } from "antd";
import { useEffect, useState } from "react";
export default function Functions({ contract, select }: { contract: Contract, select: (functionItem: Record<string, any> | null) => void }) {
    const { abi, name, hash, address } = contract;
    const [currentFunction, setCurrentFunction] = useState<Record<string, any> | null>()
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
        select(null)
        setCurrentFunction(null)
    }, [hash])
    return (
        <Card title={`方法列表 [${functions.length || 0}]`}>
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
            <div className=" h-[calc(100vh-552px)] overflow-y-auto overflow-x-hidden mt-3">
                <ol className="list-none w-60 font-mono">

                    {contract ? functions.map((item: any, index: number) => {
                        return <li key={`${item.name}-${index}`} className={currentFunction?.name === item.name ? "text-blue-500" : "cursor-pointer"} onClick={() => selectFunction(item)}>
                            <span className="text-gray-400  w-7 text-right inline-block"> {index + 1}:</span>  {item.name}({item.inputs.length > 0 ? item.inputs.length : ''})
                        </li>

                    })
                        : null}
                </ol>
            </div>
        </Card>)
}