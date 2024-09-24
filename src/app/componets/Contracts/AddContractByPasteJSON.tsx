import { useCallback, useEffect, useState } from "react";
import { Alert, Button, Input } from "antd";
import { useContractManager } from "@/hooks";

export default function AddContractByPasteJSON({ handleCancel, callback }: { handleCancel: () => void; callback: (count: number) => void }) {
    const [contracts, setContracts] = useState<string | undefined>()
    const [errMsg, setErrMsg] = useState<string>('')
    const { batchAddContract } = useContractManager()

    const handleChange = (e: any) => {
        const value = e.target.value;
        setContracts(value)
        setErrMsg('')
    }

    const batchAdd = useCallback(() => {
        if (contracts) {
            try {
                const json = JSON.parse(contracts)
                if (typeof json != 'object') {
                    setErrMsg('Incorrect format')
                    return
                }
                const res = batchAddContract(json)
                if (res.result) {
                    if (res.count) {
                        callback(res.count)
                    } else {
                        setErrMsg('没有找到符合规则的数据，请检查数据格式调整后重新提交')
                    }
                } else {
                    setErrMsg(res.msg || 'Incorrect format')
                }
            } catch (e) {
                setErrMsg('Incorrect format')
            }

        }
    }, [contracts])

    useEffect(() => {
        setContracts(undefined)
        setErrMsg('')
    }, [])

    return (<div>
        <div className="h-[118px]">
            <Input.TextArea rows={5} autoSize={{ minRows: 5, maxRows: 5 }} placeholder={`请输入符合规则的JSON数据`} allowClear onChange={handleChange} />
        </div>
        {errMsg && <div className="mt-3">  <Alert message={errMsg} type="error" showIcon /></div>}
        <div className="flex justify-end mt-4 gap-6">
            <Button onClick={handleCancel}>取消</Button>
            <Button onClick={batchAdd} type="primary" disabled={!contracts}>提交</Button>
        </div>
    </div>)
}
