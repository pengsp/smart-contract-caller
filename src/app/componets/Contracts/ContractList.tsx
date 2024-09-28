"use client"
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button, Dropdown, Popover, Select, Skeleton, Tag, Tooltip } from "antd";
import { BlockOutlined, CloudUploadOutlined, FileTextOutlined, PlusOutlined } from "@ant-design/icons";
import { Contract, ViaType } from "@/types";
import { networks } from "@/configs";
import { useContractManager } from "@/hooks";
import type { MenuProps } from 'antd';
import classes from "./contracts.module.scss"
import AddContractBtn from "./AddContractBtn";

export default function ContractList({ add }: { add: (via: ViaType) => void }) {
    const [pageLoading, setPageLoading] = useState(true)
    // const [showTip,setShowTip]=useState(false)
    const { localContracts, contractsCount, currentContractHash, setCurrentContractHash } = useContractManager()
    const t = useTranslations();
    const showTip = (contractsCount > 0 && !currentContractHash)
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

    useEffect(() => {
        if (contractsCount > 0 && !currentContractHash) {

        }
    }, [contractsCount, currentContractHash])

    return (
        <>{pageLoading
            ? <div className="flex items-center gap-2 justify-between border-b pb-4">
                <div className="w-32"><Skeleton.Button active block /></div>
                <div className="w-28"><Skeleton.Button active block /></div>

            </div>
            : <div className="flex items-center gap-2 justify-between border-b pb-4">
                {contractsCount > 0 ? <div className="flex items-center gap-4">
                    <span>{t('select_contract')}</span>
                    <Tooltip placement="bottomLeft" title="选择一个合约以开始调试" color="orange" open={showTip}>

                        <Select
                            showSearch
                            placeholder={t('select_contract_placeholder', { total: contractsCount })}
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
                    </Tooltip>

                </div> : <span>{t('no_contract_found')}</span>}
                <AddContractBtn action={add} />
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
