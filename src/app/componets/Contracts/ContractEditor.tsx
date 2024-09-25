"use client"

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { isAddress } from "ethers";
import { networks } from "@/configs";
import { Button, Form, Input } from "antd";
import NetworkItem from "../NetworkItem";
import classes from "./contracts.module.scss"
import { Contract, Network } from "@/types";
import { useContractManager } from "@/hooks";

export default function ContractEditor({ contract, handleCancel, callback }: { contract?: Contract, handleCancel: () => void; callback: (count: number) => void }) {
    const [contractFrom] = Form.useForm();
    const [selectedChainids, setSelectedChainids] = useState<string[]>([])
    const [contractHash, setContractHash] = useState<string | undefined | null>()
    const { updateContract, addContract } = useContractManager()
    const t = useTranslations();

    const initialValues = {
        name: '',
        address: '',
        abi: "",
        chainIds: []
    }

    const handleSelectNetwork = useCallback((chainId: string) => {
        console.log(chainId)
        if (selectedChainids.includes(chainId)) {
            setSelectedChainids(selectedChainids.filter(id => id != chainId))
        } else {
            setSelectedChainids([...selectedChainids, chainId])
        }
    }, [selectedChainids])

    const reset = () => {
        contractFrom.resetFields()
        setSelectedChainids([])
        setContractHash(null)
    }

    const onFinish = useCallback((values: any) => {
        const { name, address, abi, remark } = values;
        if (contractHash) {
            updateContract({
                name,
                address,
                abi: JSON.parse(abi),
                chainIds: selectedChainids,
                remark,
                hash: contractHash,
                timestamp: new Date().getTime()
            })
        } else {
            addContract({
                name,
                address,
                abi: JSON.parse(abi),
                chainIds: selectedChainids,
                remark
            })
        }
        callback(1)
    }, [contractHash, selectedChainids]);

    useEffect(() => {
        if (contract) {
            const { name, address, abi, chainIds, hash } = contract
            const abiStr = JSON.stringify(abi)
            contractFrom.setFieldsValue({ name, address, abi: abiStr, chainIds })
            setSelectedChainids(chainIds || [])
            setContractHash(hash)
        } else {
            reset()
        }
    }, [contract])

    return (<>

        <Form
            name={contractHash ? 'edit_form' : 'add_form'}
            autoComplete="off"
            layout="vertical"
            initialValues={initialValues}
            form={contractFrom}
            onFinish={onFinish}
        >
            <Form.Item
                label={t('contract_name')}
                name="name"
                validateTrigger="onBlur"
                rules={[{ required: true, message: `${t('contract_name')}${t('is_required')}` }]}
            >
                <Input placeholder={t('contract_name')} allowClear maxLength={50} showCount />
            </Form.Item>

            <Form.Item
                label={t('contract_address')}
                name="address"
                required
                validateTrigger="onBlur"
                rules={[{
                    validator: (_, value) => {
                        if (!value) {
                            return Promise.reject(new Error(`${t('contract_address')}${t('is_required')}`))
                        }
                        return isAddress(value) ? Promise.resolve() : Promise.reject(new Error(`${t('invalid')}${t('contract_address')}`))
                    }
                }]}
            >
                <Input placeholder={t('contract_address')} allowClear />
            </Form.Item>


            <Form.Item
                label={t('base_on')}
                name="chains"
            >
                <div>
                    <div className="mb-3 text-orange-400">
                        <div>{t('base_on_tips')}</div>
                    </div>
                    <div className={classes.networks_wrap}>
                        {networks.map((network: Network) => {
                            return <div onClick={() => handleSelectNetwork(network.chainId)} key={network.chainId} >
                                <NetworkItem network={network} selected={selectedChainids.includes(network.chainId)} />
                            </div>
                        })}
                    </div >
                </div>
            </Form.Item>
            <Form.Item
                label="ABI"
                name="abi"
                required
                validateTrigger="onBlur"
                rules={[{
                    validator: (_, value) => {
                        if (!value) {
                            return Promise.reject(new Error(`ABI${t('is_required')}`))
                        }
                        try {
                            const abiJson = JSON.parse(value)
                            if (abiJson instanceof Array) {
                                return Promise.resolve()
                            } else {
                                return Promise.reject(new Error(t('incorrect_format')))
                            }
                        } catch (e) {
                            return Promise.reject(new Error(t('incorrect_format')))
                        }
                    }
                }]}
            >
                <Input.TextArea rows={8} placeholder={t('abi_placeholder')} allowClear />
            </Form.Item>
            <Form.Item
                label={t('remark')}
                name="remark"
            >
                <Input.TextArea rows={2} autoSize={{ minRows: 2, maxRows: 4 }} placeholder={t('remark')} allowClear maxLength={200} showCount />
            </Form.Item>
            <div className="flex gap-5 justify-end">
                <Button onClick={handleCancel}>{t('cancel')}</Button>

                <Button onClick={reset} >
                    {t('reset')}
                </Button>
                <Button type="primary" htmlType="submit" >
                    {t('submit')}
                </Button>
            </div>
        </Form>
    </>)
}
