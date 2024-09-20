import { Button, Empty, Form, Input } from "antd"
import { useCallback, useEffect, useState } from "react"
import ConnectWalletBtn from "../Connection/ConnectWalletBtn"
import { useWeb3React } from "@web3-react/core"
import { useContract } from "@/hooks/useContract"
import InfoItem from "./InfoItem"
import Params from "./ParamsItem"
import Card from "../Layout/Card"
import { defaultContract } from "@/constants"
import { Log, EventItem } from "@/types"
import { stringifyReplacer } from "@/utils"
import { isAddress, parseEther } from "ethers"
import { Decoder } from "ts-abi-decoder";
import { networks } from "@/configs"
import NetworkSwitchBtn from "../Connection/NetworkSwitchBtn"
import { FunctionRender } from "./Logs"

export default function Caller({ contract, functionInfo, updateLogs }: {
    contract: Record<string, any> | null,
    functionInfo: Record<string, any> | null | undefined,
    updateLogs: (log: any) => void
}) {
    const { account, chainId, connector, provider } = useWeb3React()
    const { abi, name, hash, address, chainIds } = contract || defaultContract;
    const [callFunctionData, setCallFunctionData] = useState<any>()
    const [callInputs, setCallInputs] = useState<any[]>([])
    const [isLogined, setIsLogined] = useState(false)
    const [loading, setLoading] = useState<boolean>(false);
    const params = functionInfo?.inputs
    Decoder.addABI(abi)
    const currentNetwork = networks.find(network => Number(network.chainId) == Number(chainId))
    const nativeCurrency = currentNetwork?.nativeCurrency.symbol;
    const explorer = currentNetwork?.blockExplorerUrls[0]
    const contractInstance = useContract(address, abi)
    const [callFunctionForm] = Form.useForm();
    const [networkSupportCheck, setNetworkSupportCheck] = useState(false)

    useEffect(() => {
        setIsLogined(account ? true : false)
    }, [account])
    useEffect(() => {
        setLoading(false)
        callFunctionForm.resetFields()
        setCallFunctionData('')
        setCallInputs([])
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

    const updateCallFunctionData = (event: any) => {
        const input = event.currentTarget.value
        setCallFunctionData(input)
    }
    const updateCallInputs = useCallback((value: any, index: number) => {
        const _callInputs = [...callInputs]
        _callInputs[index] = value
        setCallInputs([..._callInputs])
    }, [callInputs])
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
                if (stateMutability === 'view' || stateMutability === 'pure') {
                    try {
                        const response = await contractInstance![name](...callInputs)
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
                    log.params = callInputs
                    log.type = "Transaction";
                    try {
                        const response = await contractInstance![name](...callInputs, callFunctionData ? { value: parseEther(callFunctionData) } : {})
                        console.log('await response', response, response.hash)
                        const hash = response.hash
                        log.hash = hash;
                        if (stateMutability === 'payable') {
                            log.value = `${callFunctionData} ${nativeCurrency}`;
                        }
                        updateLogs(log)
                        /*
                            ethers.js v6
                            if use `await response.wait()` ,will throw an error like `TypeError: receipt.confirmations is not a function`
                            so instead of `await response.getTransaction()` to get TransactionReceipt 
                            remark at 2024/09/19 
                        */
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

    }, [contractInstance, functionInfo, callInputs, updateLogs, callFunctionData])
    return (
        <Card title={functionInfo ? <div className="font-bold text-lg font-mono">
            <FunctionRender name={functionInfo?.name} values={functionInfo.inputs?.map((input: Record<string, any>, index: number) => input.name)} />
        </div> : <>操作面板</>
        } rootClassName=" h-full flex flex-col overflow" >
            <div className="flex gap-4 h-full overflow-hidden font-mono  box-border pt-4">
                <div className="bg-gray-50 p-4 px-6 flex flex-col  h-full box-border min-w-64 shrink-0  overflow-auto ">
                    {functionInfo ? <>
                        {functionInfo?.name && <InfoItem name="Name" value={functionInfo.name} />}
                        {functionInfo?.stateMutability && <InfoItem name="State Mutability" value={functionInfo.stateMutability} />}
                        {functionInfo?.inputs.length > 0 && <Params type="inputs" params={functionInfo.inputs} />}
                        {functionInfo?.outputs.length > 0 && <Params type="outputs" params={functionInfo.outputs} />}
                    </> : <div className="h-full flex flex-col justify-center"><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /></div>}
                </div>
                <div className=" bg-gray-50 p-4 px-6 grow h-full overflow-auto box-border">
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
                                name="eth"
                                rules={[{ required: true, message: `请输入支付的${nativeCurrency || ''}数量` }]}
                                validateTrigger="onBlur"
                                className="!mb-2">
                                <Input
                                    placeholder={`请输入${nativeCurrency || ''}数量`}
                                    key={functionInfo.name}
                                    value={callFunctionData}
                                    allowClear
                                    onChange={updateCallFunctionData}
                                />
                            </Form.Item>}

                        {params?.map((input: any, index: number) => {
                            return <Form.Item
                                label={input.name || input.internalType}
                                name={input.name}
                                key={input.name}
                                validateTrigger="onBlur"
                                rules={[{
                                    validator: (_, value) => {
                                        if (!value) {
                                            return Promise.reject(new Error(`${input.name}不能为空`))
                                        }
                                        if (input.type == 'address') {
                                            return isAddress(value) ? Promise.resolve() : Promise.reject(new Error(`checksum 失败，不合法的地址`))
                                        }
                                        return Promise.resolve()
                                    }
                                }]}
                                className="!mb-2">
                                <Input
                                    key={input.name}
                                    placeholder={input.type}
                                    allowClear
                                    // value={callInputs[index] ? callInputs[index] : ''}
                                    onClear={() => updateCallInputs('', index)}
                                    onChange={(event: any) => {
                                        const input = event.currentTarget.value;
                                        updateCallInputs(input, index)
                                    }
                                    }
                                />
                            </Form.Item>
                        }
                        )}
                        {functionInfo ?
                            <Form.Item label="" className="!mb-2">
                                <div className="pt-4">
                                    {isLogined
                                        ? <> <Button onClick={callFunction} type="primary" loading={loading} disabled={!networkSupportCheck} >
                                            {functionInfo?.stateMutability == 'view' ? `查询` : `执行`} {functionInfo?.name}
                                        </Button>
                                            {!networkSupportCheck && <NetworkSwitchBtn supportedChainids={chainIds} />}
                                        </>
                                        : <ConnectWalletBtn danger block />}
                                </div>
                            </Form.Item> : <div className="h-full flex flex-col justify-center"><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /></div>}
                    </Form>

                </div>
            </div>
            {/* <div className="h-full flex flex-col justify-center"><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /></div> */}
        </Card>)
}