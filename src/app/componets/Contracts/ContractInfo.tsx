"use client"
import { lazy, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button, Descriptions, Empty, Modal, Popconfirm, Skeleton, Tooltip, Typography } from 'antd';
import { networks } from "@/configs";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { defaultContract } from "@/constants";
import { useContractManager } from "@/hooks";
import { Contract } from "@/types";

const LazyReactJson = lazy(() => import("react-json-view"))
const { Paragraph } = Typography;

export interface ContractModalRef {
    show: (contract?: Contract) => void;
}


export default function ContractInfo({ action }: { action: (contrat: Contract) => void }) {

    const [pageLoading, setPageLoading] = useState(true)
    const { deleteContract, currentContract, setCurrentContractHash } = useContractManager()
    const [isModalOpen, setIsModalOpen] = useState(false);

    const t = useTranslations();

    const showABIModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const actionDeleteContract = (hash: string) => {
        if (currentContract) {
            deleteContract(hash)
            setCurrentContractHash('')
        }
    }

    const actionEditContract = useCallback(() => {
        if (currentContract) {
            action(currentContract)
        }
    }, [currentContract]);

    const explorerLinks = useMemo(() => {
        if (currentContract && currentContract.chainIds && currentContract.chainIds.length > 0) {
            return currentContract.chainIds.map(chainId => {
                return <BlockExplorerLinks chainId={chainId} contractAddrss={currentContract.address} key={chainId} />
            })
        } else {
            return t('unspecified')
        }
    }, [currentContract, t])

    const contractItems = useMemo(() => {
        const { abi, name, hash, address, timestamp, remark } = currentContract || defaultContract;
        const updateAt = timestamp ? new Date(timestamp).toLocaleString() : "-"

        return [
            {
                key: 'address',
                label: t('contract_address'),
                children: pageLoading
                    ? <div className="w-48"><Skeleton.Button active block size="small" /></div>
                    : (address ? <Paragraph copyable={{ text: address }} className="!mb-0">{address}</Paragraph> : '-'),
            },
            {
                key: 'chains',
                label: t('base_on'),
                children: pageLoading ? <div className="w-20"><Skeleton.Button active block size="small" /></div> : <div className="flex flex-wrap gap-2">{explorerLinks}</div>,
                span: 2
            },
            {
                key: 'remark',
                label: t('remark'),
                children: pageLoading ? <div className="w-20"><Skeleton.Button active block size="small" /></div> : remark,
            },
            {
                key: 'action',
                label: t('action'),
                children: pageLoading ? <div className="flex gap-2">
                    <div className="w-20"><Skeleton.Button active block size="small" /></div>
                    <div className="w-20"><Skeleton.Button active block size="small" /></div>
                    <div className="w-20"><Skeleton.Button active block size="small" /></div>
                </div>
                    : <div className="flex gap-2">
                        <Popconfirm
                            title={t('del_contract')}
                            description={t('confirm_del_contract')}
                            onConfirm={() => actionDeleteContract(hash)}
                            okText={t('confirm')}
                            cancelText={t('cancel')}
                        >    <Button danger size="small" icon={<DeleteOutlined />} disabled={!hash} ><span className="text-xs">{t('del_contract')}</span></Button>
                        </Popconfirm>
                        <Button size="small" onClick={showABIModal} icon={<EyeOutlined />} disabled={!hash}><span className="text-xs">{t('check_abi')}</span></Button>
                        <Button size="small" onClick={actionEditContract} icon={<EditOutlined />} disabled={!hash}><span className="text-xs">{t('edit_contract')}</span></Button>

                    </div>

            },
        ]

    }, [currentContract, pageLoading, t]);

    useEffect(() => {
        setPageLoading(false)
    }, [])

    return (<>
        <Descriptions
            bordered
            size="middle"
            items={contractItems}
            className="whitespace-nowrap"
        />
        <Modal title={`${currentContract && currentContract.name} ABI`} open={isModalOpen} onOk={handleOk} width={720} onCancel={handleCancel} footer={null}>
            <div className="h-[50vh] overflow-auto">
                {currentContract ? <LazyReactJson src={currentContract.abi} name={false} collapsed={2} /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('empty_tip')} />}
            </div>
            <div className="flex justify-end mt-5">
                <Button type="primary" onClick={handleOk}>{t('confirm')}</Button>
            </div>
        </Modal>
    </>)
}

function BlockExplorerLinks({ chainId, contractAddrss }: { chainId: string, contractAddrss: string }) {
    const t = useTranslations();

    const network = networks.find(network => network.chainId == chainId)
    if (network) {
        if (network.blockExplorerUrls[0]) {
            return <Tooltip title={t('view_on_explorer', { chainName: network.chainName })}>
                <a key={network.chainId}
                    className="flex justify-center border py-1  px-2 rounded gap-1 relative bg-gray-100 items-center "
                    href={`${network.blockExplorerUrls[0]}/address/${contractAddrss} `}
                    target="_blank"
                >
                    {network?.iconUrls && network?.iconUrls?.length > 0
                        ? <Image src={network.iconUrls[0]} width={16} height={16} alt={`${network.chainName}`} style={{ maxHeight: "16px" }} />
                        : <Image src="/images/chains/none.svg" width={16} height={16} alt={`${network.chainName}`} />}
                    <span className="text-xs">{network.chainName}</span>
                </a>
            </Tooltip>
        } else {
            return <div className="flex justify-center border py-1  px-2 rounded gap-1 relative bg-gray-100 items-center ">
                {network?.iconUrls && network?.iconUrls?.length > 0
                    ? <Image src={network.iconUrls[0]} width={16} height={16} alt={`${network.chainName}`} style={{ maxHeight: "16px" }} />
                    : <Image src="/images/chains/none.svg" width={16} height={16} alt={`${network.chainName}`} />}
                <span className="text-xs">{network.chainName}</span>
            </div>
        }
    } else {
        return null
    }
}