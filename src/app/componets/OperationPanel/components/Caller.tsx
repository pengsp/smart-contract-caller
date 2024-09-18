import { Button, Card, Form, Input } from "antd"
import { useCallback, useEffect, useState } from "react"
import ConnectWalletBtn from "../../Connection/ConnectWalletBtn"
import { useWeb3React } from "@web3-react/core"
import { useContract } from "@/hooks/useContract"
import InfoItem from "./InfoItem"
import ParamsItem from "./ParamsItem"

export default function Caller({ contract, functionInfo, updateLogs }: {
    contract: Record<string, any>,
    functionInfo: Record<string, any> | null | undefined,
    updateLogs: (log: any) => void
}) {
    const { account, chainId, connector } = useWeb3React()
    const { abi, name, hash, address } = contract;
    const [callFunctionData, setCallFunctionData] = useState<any>()
    const [callInputs, setCallInputs] = useState<any[]>([])
    const [isLogined, setIsLogined] = useState(false)
    const [loading, setLoading] = useState<boolean>(false);
    const params = functionInfo?.inputs

    const contractInstance = useContract(address, abi)
    useEffect(() => {
        setIsLogined(account ? true : false)
    }, [account])
    const callFunction = useCallback(async () => {
        setLoading(true)
        if (contract && functionInfo) {
            const stateMutability = functionInfo.stateMutability
            const functionName = functionInfo?.name
            let log: any, hash: any
            if (stateMutability === 'view') {
                try {
                    const res = await contractInstance![functionInfo?.name](...callInputs)
                    const log = res.toString()
                    updateLogs({ log, functionName, res })
                } catch (e: any) {
                    // notifications.show({
                    //   title: e.code,
                    //   message: e.message,
                    //   color: 'red',
                    //   icon: <IconX style={{ width: rem(20), height: rem(20) }} />
                    // })
                    updateLogs({ log: `${e}` })

                } finally {
                    setLoading(false)
                }

            } else if (stateMutability === 'nonpayable' || stateMutability === 'payable') {
                try {
                    const response = await contractInstance![functionInfo?.name](...callInputs, callFunctionData ? { value: callFunctionData } : {})
                    const txHash = response.hash
                    updateLogs({ log: `txHash: ${txHash}`, functionName })
                    const res = await response.wait()
                    console.log('await res', response, response.hash)
                    // console.log('res--', res)
                    updateLogs({ log: `tx mined: ${txHash}`, functionName })
                    // const receipt = await library.getTransactionReceipt(txHash)
                    // // console.log('receipt', receipt)
                    // const decodedLogs = Decoder.decodeLogs(receipt.logs);
                    // // console.log('decodedLogs', decodedLogs)
                    // decodedLogs.forEach((evt: any) => {
                    //     // console.log('---event ---', evt)
                    //     const values = evt?.events?.map((x) => {
                    //         if (x?.type === "bytes32") {
                    //             // BigNumber.from(x.value).toString();
                    //         }
                    //         return x?.value ?? false;
                    //     });
                    //     // addLogItem(`Event: ${evt.name}(${values})`);
                    //     const log = `Event: ${evt.name}(${values})`
                    //     // console.log('---event log---', log)
                    //     updateLogs({ log: `Event: ${evt.name}(${values})` })

                    // });
                } catch (e: any) {
                    // notifications.show({
                    //   title: e.code,
                    //   message: e.message,
                    //   color: 'red',
                    //   icon: <IconX style={{ width: rem(20), height: rem(20) }} />
                    // })
                    setLoading(false)
                    updateLogs({ log: `${e}` })
                }
            }
        }
    }, [contractInstance, functionInfo, callInputs])
    return (
        <Card title={functionInfo && <div className="font-bold text-lg">
            <span className="text-red-800">{functionInfo?.name}</span>
            <span className="text-blue-800">(</span>
            <span className="text-orange-400">{functionInfo.inputs?.map((input: Record<string, any>) => input.name).join(', ')}</span>
            <span className="text-blue-800">)</span>
        </div>
        }>
            {functionInfo ?
                <>
                    <div className="flex gap-4">
                        <div className="bg-gray-50 p-4 px-6">
                            <InfoItem name="Name" value={functionInfo?.name} />
                            <InfoItem name="State Mutability" value={functionInfo?.stateMutability} />
                            {functionInfo?.inputs.length > 0 && <ParamsItem type="inputs" params={functionInfo?.inputs} />}
                            {functionInfo?.outputs.length > 0 && <ParamsItem type="outputs" params={functionInfo?.outputs} />}

                        </div>
                        <div className="flex flex-col justify-center bg-gray-50 p-4 px-6 min-w-[400px]">
                            <Form
                                name="basic"
                                autoComplete="off"
                                layout="vertical"
                                colon
                            >
                                {functionInfo?.stateMutability === "payable" &&
                                    <Form.Item
                                        label="数量"
                                        name="eth"
                                        className="!mb-2">
                                        <Input
                                            placeholder={`请输入ETH数量`}
                                            key={functionInfo.name}
                                            value={callFunctionData}
                                            allowClear
                                            onChange={(event: any) => {
                                                const input = event.currentTarget.value
                                                setCallFunctionData(input)
                                            }
                                            }
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

                            </Form>
                            <div className="mt-3">
                                {isLogined
                                    ? <Button onClick={callFunction} type="primary" loading={loading} block >
                                        {functionInfo.stateMutability == 'view' ? `查询 ${functionInfo?.name}` : "提交"}
                                    </Button>
                                    : <ConnectWalletBtn danger />}

                            </div>
                        </div>
                    </div>
                </>
                : '请先从方法列表中选择一个方法'}
        </Card>)
}