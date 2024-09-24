"use client"
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Button, Select, Skeleton, Tag } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import classes from "./contracts.module.scss"
import { Contract } from "@/types";
import { networks } from "@/configs";
import { useContractManager } from "@/hooks";

export default function ContractList({ add }: { add: () => void }) {
    const [pageLoading, setPageLoading] = useState(true)

    const { localContracts, contractsCount, currentContractHash, setCurrentContractHash } = useContractManager()

    useEffect(() => {
        setPageLoading(false)
    }, [])

    const onChange = (value: string) => {
        setCurrentContractHash(value)
    };

    const onSearch = (value: string) => {
        // console.log('search:', value);
    };
    const options = useMemo(() => {
        const list = localContracts?.map((contract: Contract, index: number) => {
            const option: any = { ...contract }
            option.value = contract.hash
            option.label = contract.name
            return option
        })
        return list;
    }, [localContracts])
    return (
        <>{pageLoading
            ? <div className="flex items-center gap-2 justify-between border-b pb-4">
                <div className="w-32"><Skeleton.Button active block /></div>
                <div className="w-28"><Skeleton.Button active block /></div>

            </div>
            : <div className="flex items-center gap-2 justify-between border-b pb-4">
                {contractsCount > 0 ? <div className="flex items-center gap-4">
                    <span>选择合约</span>
                    <Select
                        showSearch
                        placeholder={`共${contractsCount}条记录，请选择合约`}
                        optionFilterProp="label"
                        onChange={onChange}
                        onSearch={onSearch}
                        style={{ width: "380px" }}
                        value={currentContractHash || null}

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
