import { useEffect, useState } from "react";
import { Alert, Button, Upload } from "antd";
import type { UploadProps } from 'antd';
import { InboxOutlined } from "@ant-design/icons";
import { useContractManager } from "@/hooks";
const { Dragger } = Upload;

export default function AddContractByUploadJSON({ handleCancel, callback }: { handleCancel: () => void; callback: (count: number) => void }) {
    const [errMsg, setErrMsg] = useState<string>('')
    const { batchAddContract } = useContractManager()

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
                            setErrMsg('')
                            callback(res.count)
                        } else {
                            setErrMsg('没有找到符合规则的数据，请检查数据格式调整后重新提交')
                        }
                    } else {
                        setErrMsg(res.msg || 'Incorrect format')
                    }
                };
            });
        },
    };

    useEffect(() => {
        setErrMsg('')
    }, [])

    return (<div>
        <div className="h-[118px] ">
            <Dragger {...uploadProps}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag <span className="text-xl text-blue-600">.json</span> file to this area to upload</p>
            </Dragger>
        </div>
        {errMsg && <div className="mt-3"> <Alert message={errMsg} type="error" showIcon /></div>}

        <div className="flex justify-end mt-4">
            <Button onClick={handleCancel}>取消</Button>
        </div>
    </div>)
}
