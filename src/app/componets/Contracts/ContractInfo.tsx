"use client"
import { Contract } from "@/types";
import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Button, Descriptions, Popconfirm, Skeleton, Tooltip } from 'antd';
import { networks } from "@/configs";
import { Typography } from 'antd';
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { useLocalStorageState } from "ahooks";
import { defaultContract, LocalStorageContracts, LocalStorageCurrentContract } from "@/constants";

const { Paragraph } = Typography;

export default function ContractInfo({ edit }: { edit: (contract: Contract) => void }) {
    const [pageLoading, setPageLoading] = useState(true)

    const [localContracts, setLocalContracts] = useLocalStorageState<Contract[]>(
        LocalStorageContracts,
        {
            defaultValue: [],
            listenStorageChange: true
        },
    );
    const [currentContractHash, setCurrentContractHash] = useLocalStorageState<string | undefined | null>(
        LocalStorageCurrentContract,
        {
            defaultValue: '',
            listenStorageChange: true
        },
    );
    const [contract, setContract] = useState<Contract | null>(null)

    const actionDeleteContract = (hash?: string) => {
        if (contract) {
            const _localContracts = localContracts?.filter(item => item.hash != hash)
            console.log(_localContracts)
            setLocalContracts(_localContracts)
            setCurrentContractHash('')
        }
    }
    const actionEditContract = useCallback(() => {
        if (contract) {
            edit(contract)
        }
    }, [contract]);
    useEffect(() => {
        if (currentContractHash && localContracts) {
            const target = localContracts.find(contract => contract.hash == currentContractHash);
            setContract(target || null)
        } else {
            setContract(null)
        }
    }, [localContracts, currentContractHash])
    const explorerLinks = useMemo(() => {
        if (contract && contract.chainIds && contract.chainIds.length > 0) {
            return contract.chainIds.map(chainId => {
                return <BlockExplorerLinks chainId={chainId} contractAddrss={contract.address} key={chainId} />
            })
        } else {
            return null
        }
    }, [contract])
    const contractItems = useMemo(() => {
        const { abi, name, hash, address, timestamp } = contract || defaultContract;
        const updateAt = timestamp ? new Date(timestamp).toLocaleString() : "-"

        return [
            {
                key: 'name',
                label: '合约名称',
                children: pageLoading ? <div className="w-20"><Skeleton.Button active block size="small" /></div> : name,
            },
            {
                key: 'address',
                label: '合约地址',
                span: 2,
                children: pageLoading ? <div className="w-48"><Skeleton.Button active block size="small" /></div> : <Paragraph copyable={{ text: address }} className="!mb-0">{address}</Paragraph>,
            },
            // {
            //     key: 'timestamp',
            //     label: '更新时间',
            //     children: updateAt,
            // },
            {
                key: 'chains',
                label: '部署网络',
                children: pageLoading ? <div className="w-20"><Skeleton.Button active block size="small" /></div> : <div className="flex flex-wrap gap-2">{explorerLinks}</div>,
            },
            {
                key: 'action',
                label: '操作',
                children: <div className="flex gap-2">
                    <Button size="small" onClick={actionEditContract} icon={<EyeOutlined />} disabled={pageLoading}>查看ABI</Button>
                    <Button size="small" onClick={actionEditContract} icon={<EditOutlined />} disabled={pageLoading}>编辑</Button>
                    <Popconfirm
                        title="删除合约"
                        description="确定删除这个合约?"
                        onConfirm={() => actionDeleteContract(contract?.hash)}
                        okText="确定"
                        cancelText="取消"
                    >    <Button danger size="small" icon={<DeleteOutlined />} disabled={pageLoading} >删除</Button>
                    </Popconfirm>

                </div>,
            },
        ]

    }, [contract]);
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
    </>)
}

function BlockExplorerLinks({ chainId, contractAddrss }: { chainId: string, contractAddrss: string }) {
    const network = networks.find(network => network.chainId == chainId)
    if (network) {
        return <Tooltip title={`在 ${network.chainName} 区块浏览器查看`}>
            <a key={network.chainId}
                className="flex justify-center border py-1 px-2 rounded gap-1 relative bg-gray-100  text-xs"
                href={`${network.blockExplorerUrls[0]}address/${contractAddrss} `}
                target="_blank"
            >
                {network?.iconUrls && network?.iconUrls?.length > 0
                    ? <Image src={network.iconUrls[0]} width={16} height={16} alt={`${network.chainName}`} />
                    : <Image src="/images/other.svg" width={16} height={16} alt={`${network.chainName}`} />}
                <span className="">{network.chainName}</span>
            </a>
        </Tooltip>
    } else {
        return null
    }
}