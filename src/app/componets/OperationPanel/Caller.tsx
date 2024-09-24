
import { useCallback, useEffect, useState } from "react"
import { isAddress, isBytesLike, parseEther, zeroPadBytes } from "ethers"
import { Decoder } from "ts-abi-decoder";
import { Button, Empty, Form, Input, InputNumber, Radio, Typography } from "antd"
import { defaultContract } from "@/constants"
import { Log, EventItem, FunctionItem } from "@/types"
import { stringifyReplacer } from "@/utils"
import ConnectWalletBtn from "../Connection/ConnectWalletBtn"
import { useWeb3React } from "@web3-react/core"
import { useContract } from "@/hooks/useContract"
import InfoItem from "./InfoItem"
import Params from "./ParamsItem"
import Card from "../Layout/Card"
import { networks } from "@/configs"
import NetworkSwitchBtn from "../Connection/NetworkSwitchBtn"
import { FunctionRender } from "./Logs"
import { CloseCircleOutlined } from "@ant-design/icons";

const { Paragraph, Text } = Typography;
const ETH_INPUT_NAME = "__ETH__";
export default function Caller({ contract, functionInfo, updateLogs }: {
    contract: Record<string, any> | null,
    functionInfo: FunctionItem | undefined | null,
    updateLogs: (log: any) => void
}) {
    const { account, chainId, connector, provider } = useWeb3React()
    const { abi, name, hash, address, chainIds } = contract || defaultContract;
    const [isLogined, setIsLogined] = useState(false)
    const [loading, setLoading] = useState<boolean>(false);
    const params = functionInfo?.inputs
    const paramTypes = functionInfo?.inputs.map((item) => item.type) || []

    const currentNetwork = networks.find(network => Number(network.chainId) == Number(chainId))
    const nativeCurrency = currentNetwork?.nativeCurrency.symbol;
    const explorer = currentNetwork?.blockExplorerUrls[0]
    const contractInstance = useContract(address, abi)
    const [callFunctionForm] = Form.useForm();
    const [networkSupportCheck, setNetworkSupportCheck] = useState(false)

    Decoder.addABI(abi)

    useEffect(() => {
        setIsLogined(account ? true : false)
    }, [account])
    useEffect(() => {
        setLoading(false)
        callFunctionForm.resetFields()
    }, [functionInfo])
    useEffect(() => {
        if (chainIds.length == 0) {
            setNetworkSupportCheck(true)
        } else {
            const supportCheck = chainIds.find((cid: string) => {
                return Number(chainId) == Number(cid)
            })
            setNetworkSupportCheck(supportCheck ? true : false)
        }
    }, [chainId, chainIds])


    const callFunction = useCallback(() => {

        callFunctionForm.validateFields().then(async () => {
            setLoading(true)
            if (contract && functionInfo) {
                const { name, stateMutability } = functionInfo;
                const log = {
                    function: name,
                    stateMutability,
                    explorer,
                } as Log
                const formData = callFunctionForm.getFieldsValue({
                    strict: true, filter: (meta) => meta.name[0] != ETH_INPUT_NAME
                })
                const callData = Object.values(formData);
                const args = callData.map((item: any, index: number) => {
                    const type = paramTypes[index];
                    //bytes
                    if (type != 'bytes' && type.startsWith('bytes')) {
                        const length = parseInt(type.slice(5)) || 0;//[0,32]
                        return zeroPadBytes(item, length)
                    } else if (type == 'tuple') {
                        return JSON.parse(item)
                    }
                    return item
                })
                if (stateMutability === 'view' || stateMutability === 'pure') {
                    try {
                        const response = await contractInstance![name](...args)
                        const responseType = typeof response;
                        log.type = "View";
                        if (responseType == 'object') {
                            log.result = JSON.parse(JSON.stringify(response, stringifyReplacer))
                        } else {
                            //if data is primitive data type, parse to string
                            log.result = response.toString()
                        }
                        updateLogs(log)
                    } catch (e: any) {
                        log.error = e
                        updateLogs(log)
                    } finally {
                        setLoading(false)
                    }

                } else if (stateMutability === 'nonpayable' || stateMutability === 'payable') {
                    log.params = args
                    log.type = "Transaction";
                    const callValue: any = {};
                    if (stateMutability === 'payable') {
                        const ethValue = callFunctionForm.getFieldValue(ETH_INPUT_NAME)
                        callValue.value = parseEther(ethValue);
                        log.value = `${ethValue} ${nativeCurrency}`;
                    }
                    try {
                        const response = await contractInstance![name](...args, { ...callValue })
                        const hash = response.hash
                        log.hash = hash;
                        updateLogs(log)
                        const tx = await response.getTransaction()
                        const receipt = await tx.wait()
                        log.isMined = true;
                        updateLogs({
                            type: "TransactionMined",
                            function: name,
                            explorer,
                            hash
                        })
                        const events: EventItem[] = []
                        const decodedLogs = Decoder.decodeLogs(receipt.logs);
                        decodedLogs.forEach((event) => {
                            const values = event?.events?.map((x) => {
                                if (x?.type === "bytes32") {
                                    x.value.toString();
                                }
                                return x?.value ?? false;
                            });
                            const eventObj = { name: event.name, values }
                            events.push(eventObj)
                        })
                        if (events.length > 0) {
                            updateLogs({
                                type: 'Event',
                                events,
                                hash
                            });
                        }
                    } catch (e: any) {
                        log.error = e
                        updateLogs(log)
                    } finally {
                        setLoading(false)
                    }
                }
            }
        }, (err) => {
            console.log('validate failed')
        })

    }, [contractInstance, functionInfo, updateLogs])
    return (
        <Card title={functionInfo ? <div className="font-bold text-lg font-mono">
            <FunctionRender name={functionInfo?.name} values={functionInfo.inputs?.map((input: Record<string, any>, index: number) => input.name)} />
            <span className="text-gray-400 text-xs ml-4 font-sans font-normal">在ABI中的位置索引为 {functionInfo.rawIndex}</span>
        </div> : <>操作面板</>
        }
            rootClassName=" h-full flex flex-col overflow"
        // extra={<UnitConverter />  }
        >
            <div className="flex gap-4 h-full overflow-hidden font-mono  box-border pt-4">
                <div className="bg-gray-50 p-4 px-6 flex flex-col  h-full box-border min-w-64 shrink-0  overflow-auto ">
                    {functionInfo ? <>
                        {functionInfo?.name && <InfoItem name="Name" value={functionInfo.name} />}
                        {functionInfo?.stateMutability && <InfoItem name="State Mutability" value={functionInfo.stateMutability} />}
                        {functionInfo?.inputs.length > 0 && <Params type="inputs" params={functionInfo.inputs} />}
                        {functionInfo?.outputs.length > 0 && <Params type="outputs" params={functionInfo.outputs} />}
                    </> : <div className="h-full flex flex-col justify-center"><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /></div>}
                </div>
                <div className=" bg-gray-50 p-4 px-6 grow shrink-0 h-full overflow-auto box-border">
                    <Form
                        name="callFunctionForm"
                        autoComplete="off"
                        layout="vertical"
                        form={callFunctionForm}
                        colon
                        style={functionInfo ? { maxWidth: "500px" } : { height: "100%" }}
                    >


                        {functionInfo?.stateMutability === "payable" &&
                            <Form.Item
                                label={`支付${nativeCurrency || ''}数量`}
                                name={ETH_INPUT_NAME}
                                rules={[{ required: true, message: `请输入支付的${nativeCurrency || ''}数量` }]}
                                validateTrigger={["onBlur", "onChange"]}
                                className="!mb-2">
                                <Input
                                    placeholder={`请输入${nativeCurrency || ''}数量`}
                                    key={functionInfo.name}
                                    allowClear
                                    disabled={loading || !networkSupportCheck}
                                />
                            </Form.Item>}
                        {params?.map((input: any, index: number) => <FormItemRender input={input} key={`${input.name}-${index}`} disabled={loading || !networkSupportCheck} />)}

                        {functionInfo ?
                            <Form.Item label="" className="!mb-2">
                                <div className="pt-4">
                                    {isLogined
                                        ? <> <Button onClick={callFunction} type="primary" loading={loading} disabled={!networkSupportCheck} >
                                            {functionInfo?.stateMutability == 'view' ? `查询` : `执行`} {functionInfo?.name}
                                        </Button>
                                            {!networkSupportCheck && <NetworkSwitchBtn supportedChainids={chainIds} />}
                                        </>
                                        : <ConnectWalletBtn danger type="primary" />}
                                </div>
                            </Form.Item> : <div className="h-full flex flex-col justify-center"><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /></div>}
                    </Form>

                </div>
            </div>
        </Card>)
}

function UnitConverter() {
    const [wei, setWei] = useState<any>(0)
    const convert = (val: any) => {
        console.log(val, val ? parseEther(val.toString()) : '')
        const _wei = val ? parseEther(val.toString()).toString() : 0
        setWei(_wei)
    }
    return (<div className="flex items-center gap-2 text-xs relative -bottom-1">
        <span>单位换算</span>
        <div className="relative">
            <InputNumber addonBefore="ETH" controls={false} type="number" onChange={convert} placeholder="ETH数量" style={{ width: "140px" }} />
        </div>
        <span>=</span>
        <InputNumber type="number" controls={false} addonBefore="Wei" value={wei} style={{ width: "auto" }} readOnly addonAfter={<Text copyable={{ text: wei }} />} />
    </div>)
}

function FormItemRender({ input, disabled }: { input: any, disabled: boolean }) {
    const { type } = input;
    if (type == 'bool') {
        return <FormItemRadioButton input={input} disabled={disabled} />;
    } if (type.startsWith('bytes')) {
        return <FormItemInput input={input} disabled={disabled} required rules={[{
            validator: (_: any, value: any) => {
                if (!value) {
                    return Promise.reject(new Error(`${input.name}不能为空`))
                }
                if (type == 'bytes') {
                    return isBytesLike(value) ? Promise.resolve() : Promise.reject(new Error(`输入必须是以 0x 开头`))
                } else {
                    const length = parseInt(type.slice(5)) || 0;//[0,32]
                    const expectedLength = length * 2 + 2;
                    return isBytesLike(value) && value.length <= expectedLength ? Promise.resolve() : Promise.reject(new Error(`输入必须是以 0x 开头,长度小于等于${expectedLength}`))
                }
            }
        }]} />;
    } else if (type == 'address') {
        return <FormItemInput input={input} disabled={disabled} required rules={[{
            validator: (_: any, value: any) => {
                if (!value) {
                    return Promise.reject(new Error(`${input.name}不能为空`))
                }
                return isAddress(value) ? Promise.resolve() : Promise.reject(new Error(`checksum失败,请输入一个合法的address`))
            }

        }]} />
    } else if (type == 'tuple') {
        return <FormItemArea input={input} disabled={disabled} rules={[{
            validator: (_: any, value: any) => {
                if (!value) {
                    return Promise.reject(new Error(`${input.name}不能为空1`))
                }
                try {
                    const json = JSON.parse(value)
                    console.log('json', json)

                    return typeof (json) == 'object' ? Promise.resolve() : Promise.reject(new Error(`数据格式不正确`))
                } catch (e) {
                    return Promise.reject(new Error(`数据格式不正确`))
                }
            }
        }]} />
    } else {
        return <FormItemInput input={input} disabled={disabled} />;
    }
}

function FormItemRadioButton({ input, disabled, rules }: { input: any, disabled: boolean, rules?: any[] }) {
    return <Form.Item
        label={input.name || input.internalType}
        name={input.name}
        rules={[{ required: true, message: '必须选一个值' }]}
        className="!mb-2"
    >
        <Radio.Group buttonStyle="solid" disabled={disabled}>
            <Radio.Button value={true}>True</Radio.Button>
            <Radio.Button value={false}>False</Radio.Button>
        </Radio.Group>
    </Form.Item>
}
function FormItemInput({ input, disabled, required, rules }: { input: any, disabled: boolean, required?: boolean, rules?: any[] }) {
    const { name, type, internalType } = input
    return <Form.Item
        label={name}
        name={name}
        rules={rules || [{ required: true, message: `${input.name}不能为空` }]}
        required={required}
        className="!mb-2"
    >
        <Input
            key={name}
            name={name}
            placeholder={type.startsWith('bytes') ? `${type}:16进制数字,以0x开头` : type}
            allowClear
            disabled={disabled}
        />
    </Form.Item>
}
function FormItemArea({ input, disabled, rules }: { input: any, disabled: boolean, rules?: any[] }) {
    return <Form.Item
        label={input.name || input.internalType}
        name={input.name}
        rules={rules || [{ required: true, message: '不能为空' }]}
        className="!mb-2"
    >
        <Input.TextArea rows={4}
            disabled={disabled}
            allowClear
        />
    </Form.Item>
}

