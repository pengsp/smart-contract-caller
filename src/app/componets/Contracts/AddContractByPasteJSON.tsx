import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Alert, Button, Input } from "antd";
import { useContractManager } from "@/hooks";

export default function AddContractByPasteJSON({ handleCancel, callback }: { handleCancel: () => void; callback: (count: number) => void }) {
    const [contracts, setContracts] = useState<string | undefined>()
    const [errMsg, setErrMsg] = useState<string>('')
    const { batchAddContract } = useContractManager()
    const t = useTranslations();

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
                    setErrMsg(t('incorrect_format'))
                    return
                }
                const res = batchAddContract(json)
                if (res.result) {
                    if (res.count) {
                        callback(res.count)
                    } else {
                        setErrMsg(t('no_data_matching_the_rule'))
                    }
                } else {
                    setErrMsg(res.msg || t('incorrect_format'))
                }
            } catch (e) {
                setErrMsg(t('incorrect_format'))
            }

        }
    }, [contracts])

    useEffect(() => {
        setContracts(undefined)
        setErrMsg('')
    }, [])

    return (<div>
        <div className="h-[118px]">
            <Input.TextArea rows={5} autoSize={{ minRows: 5, maxRows: 5 }} placeholder={t('paste_abi_placeholder')} allowClear onChange={handleChange} />
        </div>
        {errMsg && <div className="mt-3">  <Alert message={errMsg} type="error" showIcon /></div>}
        <div className="flex justify-end mt-4 gap-6">
            <Button onClick={handleCancel}>{t('cancel')}</Button>
            <Button onClick={batchAdd} type="primary" disabled={!contracts}>{t('submit')}</Button>
        </div>
    </div>)
}
