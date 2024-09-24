"use client"
import { useRef } from "react";
import { Contract } from "@/types";
import ContractList from "./ContractList";
import ContractInfo from "./ContractInfo";
import ContractModal, { ContractModalRef } from "./ContractModal";


export default function Contracts() {
    const contractModalRef = useRef<ContractModalRef>(null)

    const actionAddContract = () => {
        contractModalRef?.current?.showContractModal("manual", undefined)
    };

    const actionEditContract = (contract: Contract) => {
        contractModalRef?.current?.showContractModal("manual", contract)
    };



    return (<>
        <ContractList add={actionAddContract} />
        <ContractInfo edit={actionEditContract} />
        <ContractModal ref={contractModalRef} />
        {/* <ContractEditor ref={contractEditorRef} />
        <BatchAddContractModal ref={batchAddContractModalRef} /> */}
        {/* <Modal title="" open={isTipsModalOpen} footer={null} maskClosable={false} closable={false} centered zIndex={100}>

            <div className="text-orange-500 text-base mt-2 mb-6">当前没有可用的智能合约,您可以选择以下操作：</div>

            <div className="flex gap-3">
                <div className="border rounded basis-1/3 p-3 flex flex-col justify-between gap-4">
                    <div>系统内置了一个测试合约，方便你熟悉工具</div>
                    <Button icon={<UngroupOutlined />} onClick={initContract} loading={loading}>立即使用</Button>
                </div>

                <div className="border rounded basis-1/3 p-3  flex flex-col justify-between gap-4">
                    <div>上传符合数据格式的JSON文件或JSON数据增加合约</div>
                    <Button icon={<CloudUploadOutlined />} loading={loading} block onClick={actionBatchUploadContract}>立即上传</Button>
                
                </div>

                <div className="border rounded basis-1/3 p-3 flex flex-col justify-between gap-4">
                    <div>
                        <div>提供合约地址和合约ABI,新增合约</div>
                    </div>
                    <Button icon={<PlusOutlined />} type="primary" onClick={actionAddContract} disabled={loading}>新增合约</Button>
                </div>
            </div>
        </Modal > */}


    </>)
}
