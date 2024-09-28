import { forwardRef, useCallback, useImperativeHandle, useState } from "react";
import { useTranslations } from "next-intl";
import { Alert, Button, Input, message, Modal } from "antd";
import { useContractManager } from "@/hooks";
import JSONDataFormatTips from "./JSONDataFormatTips";

const AddContractByPasteJSON = forwardRef(function AddContractByPasteJSON(props, ref) {
    const [contracts, setContracts] = useState<string | undefined>()
    const [isContractModalOpen, setIsContractModalOpen] = useState(false);
    const [errMsg, setErrMsg] = useState<string>('')
    const { batchAddContract } = useContractManager()
    const t = useTranslations();

    useImperativeHandle(ref, () => {
        return {
            show: () => init()
        }
    }, [])

    const init = () => {
        setContracts(undefined)
        setErrMsg('')
        setIsContractModalOpen(true)
    }

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
                        setIsContractModalOpen(false);
                        message.success(t('successfully_added_records', { count: res.count }));
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

    const handleCancel = () => {
        setContracts(undefined)
        setErrMsg('')
        setIsContractModalOpen(false);
    };

    return (<Modal title={t('add_contract')} open={isContractModalOpen} onCancel={handleCancel} footer={null} maskClosable={false} width={800} zIndex={102}>
        <JSONDataFormatTips />
        <div className="h-[118px]">
            <Input.TextArea rows={5} autoSize={{ minRows: 5, maxRows: 5 }} placeholder={t('paste_abi_placeholder')} allowClear onChange={handleChange} value={contracts} />
        </div>
        {errMsg && <div className="mt-3">  <Alert message={errMsg} type="error" showIcon /></div>}
        <div className="flex justify-end mt-5 gap-5">
            <Button onClick={handleCancel}>{t('cancel')}</Button>
            <Button onClick={batchAdd} type="primary" disabled={!contracts}>{t('submit')}</Button>
        </div>
    </Modal>)
})
export default AddContractByPasteJSON