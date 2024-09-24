"use client"

import { useCallback, useEffect, useState } from "react";
import { isAddress } from "ethers";
import { networks } from "@/configs";
import { Button, Form, Input, message, Modal } from "antd";
import NetworkItem from "../NetworkItem";
import classes from "./contracts.module.scss"
import { Contract, Network } from "@/types";
import { useContractManager } from "@/hooks";

export default function ContractEditor({ contract, handleCancel, callback }: { contract?: Contract, handleCancel: () => void; callback: (count: number) => void }) {
    const [contractFrom] = Form.useForm();
    const [selectedChainids, setSelectedChainids] = useState<string[]>([])
    const [contractHash, setContractHash] = useState<string | undefined | null>()
    const { updateContract, addContract } = useContractManager()

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
                label="合约名称"
                name="name"
                validateTrigger="onBlur"
                rules={[{ required: true, message: '请输入合约名称!' }]}
            >
                <Input placeholder="合约名称" allowClear maxLength={50} showCount />
            </Form.Item>

            <Form.Item
                label="合约地址"
                name="address"
                required
                validateTrigger="onBlur"
                rules={[{
                    validator: (_, value) => {
                        if (!value) {
                            return Promise.reject(new Error('请输入合约地址!'))
                        }
                        return isAddress(value) ? Promise.resolve() : Promise.reject(new Error('无效的合约地址!'))
                    }
                }]}
            >
                <Input placeholder="合约地址" allowClear />
            </Form.Item>


            <Form.Item
                label="合约部署的网络"
                name="chains"
            >
                <div>
                    <div className="mb-3 text-orange-400">
                        <div>若选择了网络则合约调用的时候会判断网络是否匹配，若你添加的合约部署的网络不在下面的列表中不选即可。</div>
                        <div>如果合约以同一个合约地址部署到多个网络上，那么你可以把对应的网络都选上。</div>
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
                            return Promise.reject(new Error('请输入合约ABI!'))
                        }
                        try {
                            const abiJson = JSON.parse(value)
                            if (abiJson instanceof Array) {
                                return Promise.resolve()
                            } else {
                                return Promise.reject(new Error('ABI格式不正确，它应该是一个数组的形式!'))
                            }
                        } catch (e) {
                            return Promise.reject(new Error('ABI格式不正确，它应该是一个数组的形式!'))
                        }
                    }
                }]}
            >
                <Input.TextArea rows={8} placeholder="合约的ABI，它应该是一个数组形式" allowClear />
            </Form.Item>
            <Form.Item
                label="备注"
                name="remark"
            >
                <Input.TextArea rows={2} autoSize={{ minRows: 2, maxRows: 4 }} placeholder="备注" allowClear maxLength={200} showCount />
            </Form.Item>
            <div className="flex gap-5 justify-end">
                <Button onClick={handleCancel}>取消</Button>

                <Button onClick={reset}>
                    重置
                </Button>
                <Button type="primary" htmlType="submit" >
                    提交
                </Button>
            </div>
        </Form>
    </>)
}
