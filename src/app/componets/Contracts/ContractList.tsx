"use client"
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Button, Select, Skeleton, Tag } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useLocalStorageState } from 'ahooks';
import classes from "./contracts.module.scss"
import { Contract } from "@/types";
import { LocalStorageContracts, LocalStorageCurrentContract } from "@/constants";
import { networks } from "@/configs";

export default function ContractList({ add }: { add: () => void }) {
    const [pageLoading, setPageLoading] = useState(true)

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

    const selectContract = (hash: string) => {
        setCurrentContractHash(hash)
        setDefaultContract(hash)
    }
    useEffect(() => {
        // fix hydration error
        setContracts(localContracts)
        setPageLoading(false)
    }, [localContracts])

    useEffect(() => {
        setCurrentContractHash(defaultContract)
    }, [defaultContract])

    const onChange = (value: string) => {
        console.log(`selected ${value}`);
        selectContract(value)
    };

    const onSearch = (value: string) => {
        console.log('search:', value);
    };
    const options = useMemo(() => {
        const list = contracts?.map((contract: Contract, index: number) => {
            const option: any = { ...contract }
            option.value = contract.hash
            option.label = contract.name
            return option
        })
        // console.log('list', list)
        return list;
    }, [contracts])
    return (
        <>{pageLoading
            ? <div className="flex items-center gap-2 justify-between border-b pb-4">
                <div className="w-32"><Skeleton.Button active block /></div>
                <div className="w-28"><Skeleton.Button active block /></div>

            </div>
            : <div className="flex items-center gap-2 justify-between border-b pb-4">
                {contracts && contracts.length > 0 ? <div className="flex items-center gap-4">
                    <span>选择合约</span>
                    <Select
                        showSearch
                        placeholder="选择合约"
                        optionFilterProp="label"
                        onChange={onChange}
                        onSearch={onSearch}
                        style={{ width: "380px" }}
                        value={currentContractHash}

                        optionRender={(option: any) => {
                            const contract = option.data;
                            return <div className={classes.option} key={contract.hash}  >
                                <div className={classes.name}>{contract.name}</div>
                                <div className={classes.address}>{contract.address}</div>
                                <div className={classes.chainInfo}>
                                    {contract.chainIds?.map((chainId: any) => {
                                        return getChainByChainId(chainId)
                                    })}
                                </div>
                            </div>
                        }}
                        options={options}
                    />
                </div> : <span>请先增加合约</span>}
                <Button icon={<PlusOutlined />} onClick={add} type="primary">增加合约</Button>
            </div>
        }
        </>
    )
}

function getChainByChainId(chainId: string) {
    const network = networks.find(network => network.chainId == chainId)
    if (network) {
        return <Tag key={network.chainId}>
            <div className="flex justify-center  py-1 px-2  gap-1 relative" >
                {network?.iconUrls && network?.iconUrls?.length > 0
                    ? <Image src={network.iconUrls[0]} width={20} height={20} alt={`${network.chainName}`} />
                    : <Image src="/images/other.svg" width={20} height={20} alt={`${network.chainName}`} />}
                <span className="">{Number(network.chainId)}</span>
            </div>
        </Tag>
    }
}
