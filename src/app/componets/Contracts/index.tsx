"use client"
import { Button, Modal, Form, Input } from "antd";
import classes from "./contracts.module.scss"
import { PlusOutlined } from "@ant-design/icons";
import { useCallback, useState } from "react";
import { Network, networks } from "@/configs";
import NetworkItem from "../NetworkItem";
import { isAddress } from "ethers";


export default function Contracts() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [contractFrom] = Form.useForm();
    const [selectChainids, setSelectChainids] = useState<string[]>([])
    const initialValues = {
        name: '',
        address: '',
        abi: ""
    }
    const actionAddContract = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleSelectNetwork = useCallback((chainId: string) => {
        console.log(chainId)
        if (selectChainids.includes(chainId)) {
            setSelectChainids(selectChainids.filter(id => id != chainId))
        } else {
            setSelectChainids([...selectChainids, chainId])
        }
    }, [selectChainids])
    const handleSaveContract = () => {
        console.log(contractFrom, contractFrom.getFieldsValue())
    }
    return (<div className={classes.root}>
        <div className="flex items-center justify-between p-4 py-6 ">
            <div className="font-bold text-blue-400">合约列表</div>
            <Button icon={<PlusOutlined />} onClick={actionAddContract}>增加合约</Button>
        </div>
        <div className={classes.list}>
            <div className={classes.item}>
                <div className={classes.name}>USDT</div>
                <div className={classes.address}>0x44979066D87b82954B1759B07B9B35EB82E76BA1</div>
                <div className={classes.chainInfo}>Avalanche Fuji Testnet (43113)</div>
            </div>
            <div className={classes.item}>
                <div className={classes.name}>USDT</div>
                <div className={classes.address}>0x44979066D87b82954B1759B07B9B35EB82E76BA1</div>
                <div className={classes.chainInfo}>Avalanche Fuji Testnet (43113)</div>
            </div>
            <div className={classes.item_current}>
                <div className={classes.name}>USDT</div>
                <div className={classes.address}>0x44979066D87b82954B1759B07B9B35EB82E76BA1</div>
                <div className={classes.chainInfo}>Avalanche Fuji Testnet (43113)</div>
            </div>
            {selectChainids}

        </div>
        <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={null} maskClosable={false} width={800}>
            <Form
                name="basic"
                autoComplete="off"
                layout="vertical"
                initialValues={initialValues}
                form={contractFrom}
            >
                <Form.Item
                    label="合约名称"
                    name="name"
                    rules={[{ required: true, message: '请输入合约名称!' }]}
                >
                    <Input placeholder="给合约一个备注名称，仅用于标记合约" />
                </Form.Item>

                <Form.Item
                    label="合约地址"
                    name="address"
                    required
                    rules={[{
                        validator: (_, value) => {
                            console.log(value)
                            if (!value) {
                                return Promise.reject(new Error('请输入合约地址!'))
                            }
                            return isAddress(value) ? Promise.resolve() : Promise.reject(new Error('无效的合约地址!'))
                        }
                    }]}
                >
                    <Input placeholder="合约部署之后的合约地址" />
                </Form.Item>


                <Form.Item
                    label="合约部署的网络"
                    name="chainList"
                >
                    <div>
                        <div className="mb-3 text-gray-400">
                            <div>若选择了网络则合约调用的时候会判断网络是否匹配，不选则合约调用的时候不做网络判断</div>
                            <div>如果合约以同一个合约地址部署到多个网络上，那么你可以把对应的网络都选上</div>
                        </div>
                        <div className={classes.networks_wrap}>
                            {networks.map((network: Network) => {
                                return <div onClick={() => handleSelectNetwork(network.chainId)} key={network.chainId} >
                                    <NetworkItem network={network} selected={selectChainids.includes(network.chainId)} />
                                </div>
                            })}
                        </div >
                    </div>
                </Form.Item>
                <Form.Item
                    label="ABI"
                    name="abi"
                    rules={[{ required: true, message: '请输入合约的ABI!' }]}
                >
                    <Input.TextArea rows={8} />
                </Form.Item>

                <Form.Item >
                    <Button type="primary" onClick={handleSaveContract}>
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    </div>)
}