"use client"
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "antd";
import { PlusOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { useLocalStorageState } from 'ahooks';
import classes from "./contracts.module.scss"
import ContractEditor, { ContractEditorRef } from "./ContractEditor";
import { Contract } from "@/types";
import { LocalStorageContracts } from "@/constants";
import { networks } from "@/configs";

export default function Contracts() {
    const contractEditorRef = useRef<ContractEditorRef>(null)
    const [contracts, setContracts] = useState<Contract[] | undefined>()
    const [inTestContract, setInTestContract] = useState<Contract | null>(null)
    const [localContracts, setLocalContracts] = useLocalStorageState<Contract[]>(
        LocalStorageContracts,
        {
            defaultValue: [],
            listenStorageChange: true
        },
    );
    const actionAddContract = (contract?: Contract) => {
        contractEditorRef?.current?.showContractEditor(contract)
    };
    const actionTestContract = (contract: Contract) => {
        setInTestContract(contract)
    };

    useEffect(() => {
        // fix hydration error
        setContracts(localContracts)
    }, [localContracts])
    return (
        <>
            <div className={classes.root}>
                <div className="flex items-center justify-between p-4 py-8 ">
                    <div className="flex gap-2 items-center ">
                        <UnorderedListOutlined />
                        <span>合约列表</span>
                    </div>
                    <Button icon={<PlusOutlined />} onClick={() => actionAddContract()}>增加合约</Button>
                </div>
                <div className={classes.list}>

                    {
                        contracts?.map((contract: Contract) => {
                            return <div className={inTestContract && inTestContract.hash == contract.hash ? classes.item_current : classes.item} key={contract.hash} onClick={() => actionTestContract(contract)}>
                                <div className={classes.name}>{contract.name}</div>
                                <div className={classes.address}>{contract.address}</div>
                                <div className={classes.chainInfo}>
                                    {contract.chainIds.map(chainId => {
                                        return getChainByChainId(chainId)
                                    })}
                                </div>
                            </div>
                        })
                    }
                </div>

            </div>
            <ContractEditor ref={contractEditorRef} />
        </>
    )
}

function getChainByChainId(chainId: string) {
    const network = networks.find(network => network.chainId == chainId)
    if (network) {
        return <a key={network.chainId} onClick={(e) => e.stopPropagation()} className="flex justify-center border py-1 px-2 rounded gap-1 relative bg-gray-100" href={`${network.blockExplorerUrls[0]}`} target="_blank" title={`在${network.chainName}区块浏览器查看`}>

            {network?.iconUrls && network?.iconUrls?.length > 0
                ? <Image src={network.iconUrls[0]} width={20} height={20} alt={`在${network.chainName}区块浏览器查看`} />
                : <Image src="/images/other.svg" width={20} height={20} alt={`在${network.chainName}区块浏览器查看`} />}
            <span className="">{Number(network.chainId)}</span>
        </a>
    }
}
function ExplorerLinks({ chainIds }: { chainIds: string[] }) {
    return (<>
        {chainIds.map(chainId => {
            return getChainByChainId(chainId)
        })}
    </>)
}