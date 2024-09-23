"use client"

import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from "react";
import { hashMessage, isAddress } from "ethers";
import { internalTestContract, networks } from "@/configs";
import { Button, Checkbox, Form, Input, message, Modal } from "antd";
import NetworkItem from "../NetworkItem";
import classes from "./contracts.module.scss"
import { Contract, Network } from "@/types";
import { useLocalStorageState } from "ahooks";
import { LocalStorageContracts, LocalStorageCurrentContract } from "@/constants";
import { UngroupOutlined } from "@ant-design/icons";

export interface ContractEditorRef {
    showContractEditor: (contract?: Contract) => void;
}
const ContractEditor = forwardRef(function ContractEditor(props, ref) {
    const [contractFrom] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedChainids, setSelectedChainids] = useState<string[]>([])
    const [contractHash, setContractHash] = useState<string | undefined | null>()
    const [internalTestContractAdded, setInternalTestContract] = useState(true)
    const [contracts, setContracts] = useLocalStorageState<Contract[]>(
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

    const initialValues = {
        name: '',
        address: '',
        abi: "",
        chainIds: []
    }

    useImperativeHandle(ref, () => {
        return {
            showContractEditor: (contract: Contract) => initContractEditor(contract)
        }
    }, [])

    const [messageApi, contextHolder] = message.useMessage();

    const addContractCallback = () => {
        messageApi.open({
            type: 'success',
            content: contractHash ? '合约编辑成功' : '合约增加成功',
        });
    };
    const initContractEditor = (contract: Contract) => {
        if (contract) {
            const { name, address, abi, chainIds, hash } = contract
            const abiStr = JSON.stringify(abi)
            contractFrom.setFieldsValue({ name, address, abi: abiStr, chainIds })
            setSelectedChainids(chainIds || [])
            setContractHash(hash)
        } else {
            reset()
        }
        setIsModalOpen(true)
    }

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        reset()
        setIsModalOpen(false);
    };
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
        const { name, address, abi } = values;
        const timestamp = new Date().getTime()
        console.log(selectedChainids)
        const contractInfo = {
            name,
            address,
            abi: JSON.parse(abi),
            chainIds: selectedChainids,
            timestamp
        }
        const _contracts = contracts ? [...contracts] : []
        if (contractHash) {
            const newContracts = _contracts?.map(contract => {
                if (contract.hash == contractHash) {
                    return { ...contractInfo, hash: contractHash }
                } else {
                    return contract;
                }
            })
            setContracts(newContracts)
        } else {
            const hash = hashMessage(`${timestamp}`)
            _contracts.unshift({ ...contractInfo, hash })
            setContracts(_contracts)
            setCurrentContractHash(hash)
        }
        addContractCallback()
        setIsModalOpen(false)
    }, [contracts, contractHash, selectedChainids]);

    const addInternalContract = useCallback(() => {
        const _contracts = contracts || []
        setContracts([internalTestContract, ..._contracts])
        setCurrentContractHash(internalTestContract.hash)
        setIsModalOpen(false)
    }, [contracts])

    useEffect(() => {
        const isExisting = contracts?.find(contract => contract.hash == internalTestContract.hash) || false
        setInternalTestContract(isExisting ? true : false)
    }, [contracts])
    return (<>
        {contextHolder}
        <Modal title={contractHash ? "编辑合约" : "新增合约"} open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={null} maskClosable={false} width={800} centered zIndex={102}>
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
                    <Input placeholder="给合约一个备注名称，仅用于标记合约" allowClear />
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
                    <Input placeholder="合约部署之后的合约地址" allowClear />
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

                <Form.Item >
                    <div className="flex gap-5 justify-between">
                        {internalTestContractAdded
                            ? <div></div>
                            : <Button icon={<UngroupOutlined />} onClick={addInternalContract}>
                                使用系统内置测试合约
                            </Button>
                        }
                        <div>
                            <Button onClick={reset}>
                                重置
                            </Button>
                            <Button type="primary" htmlType="submit" className="ml-4">
                                提交
                            </Button>
                        </div>
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    </>)
})
export default ContractEditor;
