import { Button, Empty, Form, Input } from "antd"
import { useCallback, useEffect, useState } from "react"
import ConnectWalletBtn from "../../Connection/ConnectWalletBtn"
import { useWeb3React } from "@web3-react/core"
import { useContract } from "@/hooks/useContract"
import InfoItem from "./InfoItem"
import Params from "./ParamsItem"
import Card from "../../Layout/Card"
import { defaultContract } from "@/constants"
import { Log, EventItem } from "@/types"
import { stringifyReplacer } from "@/utils"
import { parseEther } from "ethers"
import { Decoder } from "ts-abi-decoder";
import { networks } from "@/configs"

export default function Caller({ contract, functionInfo, updateLogs }: {
    contract: Record<string, any> | null,
    functionInfo: Record<string, any> | null | undefined,
    updateLogs: (log: any) => void
}) {
    const { account, chainId, connector, provider } = useWeb3React()
    const { abi, name, hash, address } = contract || defaultContract;
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
    useEffect(() => {
        setIsLogined(account ? true : false)
    }, [account])
    useEffect(() => {
        setLoading(false)
    }, [functionInfo])

    const updateCallFunctionData = (event: any) => {
        const input = event.currentTarget.value
        console.log('updateCallFunctionData', input)
        setCallFunctionData(input)
    }
    const callFunction = useCallback(async () => {
        setLoading(true)
        if (contract && functionInfo) {
            const { name, stateMutability } = functionInfo;
            const log = {
                function: name,
                stateMutability,
                explorer,
            } as Log
            if (stateMutability === 'view') {
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
                    log.value = `${callFunctionData} ${nativeCurrency}`;
                    updateLogs(log)
                    /*
                        ethers.js v6
                        if use `await response.wait()` ,will throw an error like `TypeError: receipt.confirmations is not a function`
                        so instead of `await response.getTransaction()` to get TransactionReceipt 
                        remark at 2024/09/19 
                    */
                    const tx = await response.getTransaction()
                    console.log('await res', tx)
                    const receipt = await tx.wait()
                    console.log('await _Res', receipt)
                    log.isMined = true;
                    updateLogs({
                        type: "TransactionMined",
                        function: name,
                        explorer,
                        hash
                    })
                    const events: EventItem[] = []
                    const decodedLogs = Decoder.decodeLogs(receipt.logs);
                    // console.log('decodedLogs', decodedLogs)
                    decodedLogs.forEach((event) => {
                        // console.log('---event ---', evt)
                        const values = event?.events?.map((x) => {
                            if (x?.type === "bytes32") {
                                x.value.toString();
                            }
                            return x?.value ?? false;
                        });
                        // addLogItem(`Event: ${evt.name}(${values})`);
                        // const event = `${evt.name}(${values})`
                        const eventObj = { name: event.name, values }
                        console.log('---event log---', log)
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
    }, [contractInstance, functionInfo, callInputs, updateLogs, callFunctionData])
    return (
        <Card title={functionInfo && <div className="font-bold text-lg font-mono">
            <span className="text-red-800">{functionInfo?.name}</span>
            <span className="text-blue-800">(</span>
            {functionInfo.inputs?.map((input: Record<string, any>, index: number) => {
                return <span key={index}><span className="text-orange-400">{input.name}</span>{index != functionInfo.inputs.length - 1 && <span className="text-gray-300">,</span>}</span>
            })}
            <span className="text-blue-800">)</span>
        </div>
        } rootClassName=" h-full flex flex-col overflow" >
            {functionInfo ?
                <div className="flex gap-4 h-full overflow-hidden font-mono  box-border pt-4">
                    <div className="bg-gray-50 p-4 px-6 flex flex-col  h-full box-border min-w-64 shrink-0  overflow-auto ">
                        <InfoItem name="Name" value={functionInfo?.name} />
                        <InfoItem name="State Mutability" value={functionInfo?.stateMutability} />
                        {functionInfo?.inputs.length > 0 && <Params type="inputs" params={functionInfo?.inputs} />}
                        {functionInfo?.outputs.length > 0 && <Params type="outputs" params={functionInfo?.outputs} />}
                    </div>
                    <div className=" bg-gray-50 p-4 px-6 grow h-full overflow-auto">
                        <Form
                            name="basic"
                            autoComplete="off"
                            layout="vertical"
                            colon
                            style={{ maxWidth: "500px" }}
                        >
                            {functionInfo?.stateMutability === "payable" &&
                                <Form.Item
                                    label={`支付${nativeCurrency}数量`}
                                    name="eth"
                                    className="!mb-2">
                                    <Input
                                        placeholder={`请输入${nativeCurrency}数量`}
                                        key={functionInfo.name}
                                        value={callFunctionData}
                                        allowClear
                                        onChange={updateCallFunctionData}
                                    />
                                </Form.Item>}

                            {params.map((input: any, index: number) => {
                                return <Form.Item
                                    label={input.name || input.internalType}
                                    name={input.name}
                                    key={input.name}
                                    className="!mb-2">
                                    <Input
                                        key={input.name}
                                        placeholder={input.type}
                                        allowClear
                                        value={callInputs[index] ? callInputs[index] : ''}
                                        onChange={(event: any) => {
                                            const input = event.currentTarget.value
                                            callInputs[index] = input
                                            setCallInputs([...callInputs])
                                        }
                                        }
                                    />
                                </Form.Item>
                            }
                            )}
                            <Form.Item label="" className="!mb-2">

                                <div className="pt-4">
                                    {isLogined
                                        ? <Button onClick={callFunction} type="primary" loading={loading}  >
                                            {functionInfo.stateMutability == 'view' ? `查询 ${functionInfo?.name}` : "提交"}
                                        </Button>
                                        : <ConnectWalletBtn danger block />}
                                </div>
                            </Form.Item>
                        </Form>

                    </div>
                </div>
                : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
        </Card>)
}