import { forwardRef, useImperativeHandle, useState } from "react";
import { useTranslations } from "next-intl";
import { Alert, Button, message, Modal, Upload } from "antd";
import type { UploadProps } from 'antd';
import { InboxOutlined } from "@ant-design/icons";
import { useContractManager } from "@/hooks";
import JSONDataFormatTips from "./JSONDataFormatTips";
const { Dragger } = Upload;

const AddContractByUploadJSON = forwardRef(function AddContractByUploadJSON(props, ref) {
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
        setErrMsg('')
        setIsContractModalOpen(true)
    }

    const uploadProps: UploadProps = {
        action: '/',
        listType: 'text',
        maxCount: 1,
        beforeUpload(file) {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsText(file);
                reader.onload = (e: any) => {
                    const content = e.target.result;
                    // 处理文件内容
                    // console.log(content);
                    const res = batchAddContract(content)
                    console.log(res)
                    if (res.result) {
                        if (res.count) {
                            handleCancel()
                            message.success(t('successfully_added_records', { count: res.count }));
                        } else {
                            setErrMsg(t('no_data_matching_the_rule'))
                        }
                    } else {
                        setErrMsg(res.msg || t('incorrect_format'))
                    }
                };
            });
        },
    };

    const handleCancel = () => {
        setErrMsg('')
        setIsContractModalOpen(false);
    };

    return (<Modal title={t('add_contract')} open={isContractModalOpen} onCancel={handleCancel} footer={null} maskClosable={false} width={800} zIndex={102}>
        <JSONDataFormatTips />
        <div>
            <Dragger {...uploadProps}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">{t('upload_json_tips_1')} <span className="text-xl text-blue-600">.json</span> {t('upload_json_tips_2')}</p>
            </Dragger>
        </div>
        {errMsg && <div className="mt-3"> <Alert message={errMsg} type="error" showIcon /></div>}

        <div className="flex justify-end mt-4">
            <Button onClick={handleCancel}>{t('cancel')}</Button>
        </div>
    </Modal>)
})
export default AddContractByUploadJSON