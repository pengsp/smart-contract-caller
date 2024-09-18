"use client"
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Badge, Button } from "antd";
import { PlusOutlined, ProfileOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { useLocalStorageState } from 'ahooks';
import classes from "./contracts.module.scss"
import ContractEditor, { ContractEditorRef } from "./ContractEditor";
import { Contract } from "@/types";
import { LocalStorageContracts, LocalStorageCurrentContract } from "@/constants";
import { networks } from "@/configs";

export default function Contracts() {
    const contractEditorRef = useRef<ContractEditorRef>(null)
    const [contracts, setContracts] = useState<Contract[] | undefined>()
    const [currentContractHash, setCurrentContractHash] = useState<string | undefined | null>(null)
    const [localContracts, setLocalContracts] = useLocalStorageState<Contract[]>(
        LocalStorageContracts,
        {
            defaultValue: [],
            listenStorageChange: true
        },
    );
    const [defaultContract, setDefaultContract] = useLocalStorageState<string | undefined | null>(
        LocalStorageCurrentContract,
        {
            defaultValue: '',
            // listenStorageChange: true
        },
    );

    const actionAddContract = () => {
        contractEditorRef?.current?.showContractEditor()
    };

    const selectContract = (hash: string) => {
        setCurrentContractHash(hash)
        setDefaultContract(hash)
    }
    useEffect(() => {
        // fix hydration error
        setContracts(localContracts)
    }, [localContracts])

    useEffect(() => {
        setCurrentContractHash(defaultContract)
    }, [defaultContract])
    return (
        <>
            <div className={classes.root}>
                <div className="flex items-center justify-between p-4 py-8 ">
                    <div className="flex gap-1 items-center ">
                        <UnorderedListOutlined />
                        <span>合约列表 [{contracts && contracts.length}]</span>
                    </div>
                    <Button icon={<PlusOutlined />} onClick={() => actionAddContract()}>增加合约</Button>
                </div>
                <div className={classes.list}>
                    {
                        contracts?.map((contract: Contract, index: number) => {
                            return <div className={currentContractHash && currentContractHash == contract.hash ? classes.item_current : classes.item}
                                key={contract.hash}
                                onClick={() => selectContract(contract.hash)}>
                                <div className={classes.name}>{contract.name}</div>
                                <div className={classes.address}>{contract.address}</div>
                                <div className={classes.chainInfo}>
                                    {contract.chainIds.map(chainId => {
                                        return getChainByChainId(chainId)
                                    })}
                                </div>
                                <div className={classes.index}>{index + 1}</div>
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
        return <div key={network.chainId} className="flex justify-center border py-1 px-2 rounded gap-1 relative bg-gray-100" >
            {network?.iconUrls && network?.iconUrls?.length > 0
                ? <Image src={network.iconUrls[0]} width={20} height={20} alt={`${network.chainName}`} />
                : <Image src="/images/other.svg" width={20} height={20} alt={`${network.chainName}`} />}
            <span className="">{Number(network.chainId)}</span>
        </div>
    }
}
