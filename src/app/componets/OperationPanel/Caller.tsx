
import { useCallback, useEffect, useState } from "react"
import { useTranslations } from "next-intl";
import { formatEther, formatUnits, isAddress, isBytesLike, parseEther, parseUnits, zeroPadBytes } from "ethers"
import { Decoder } from "ts-abi-decoder";
import { Button, Empty, Form, Input, InputNumber, Radio, Typography, Select, Drawer } from "antd"
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
import NetworkSwitchBtn from "../Networks/NetworkSwitchBtn/NetworkSwitchBtn"
import { FunctionRender } from "./Logs"
import { CloseCircleOutlined, CodeOutlined } from "@ant-design/icons";
const { Option } = Select;

const { Text } = Typography;
const ETH_INPUT_NAME = "__ETH__";

export default function Caller({ contract, functionInfo, updateLogs }: {
    contract: Record<string, any> | null,
    functionInfo: FunctionItem | undefined | null,
    updateLogs: (log: any) => void
}) {
    const { account, chainId } = useWeb3React()
    const { abi, address, chainIds } = contract || defaultContract;
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
    const [open, setOpen] = useState(false);

    const t = useTranslations();
    Decoder.addABI(abi)

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const onClose = () => {
        setOpen(false);
    };

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
                        callValue.value = parseEther(ethValue.toString());
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

    useEffect(() => {
        setIsLogined(account ? true : false)
    }, [account])

    return (
        <Card title={functionInfo ? <div className="font-bold text-lg font-mono">
            <FunctionRender name={functionInfo?.name} values={functionInfo.inputs?.map((input: Record<string, any>, index: number) => input.name)} />
            <span className="text-gray-400 text-xs ml-4 font-sans font-normal">{t('indexed_in_abi')} {functionInfo.rawIndex}</span>
        </div> : <>{t('operation_panel')}</>
        }
            rootClassName=" h-full flex flex-col overflow"
            extra={<div className="block min-[1200px]:hidden">
                <Button size="small" icon={<CodeOutlined />} variant="filled" color={open ? "primary" : "default"} onClick={toggleDrawer}>{t('unit_converter')}</Button>
            </div>}
        >
            <div className="h-[calc(100%-45px)] relative">
                <div className="flex gap-4 h-full overflow-hidden font-mono  box-border pt-4 relative">
                    <div className="bg-gray-50 p-4 px-6 flex flex-col  h-full box-border min-w-64 shrink-0  overflow-auto ">
                        {functionInfo ? <>
                            {functionInfo?.name && <InfoItem name="Name" value={functionInfo.name} />}
                            {functionInfo?.stateMutability && <InfoItem name="State Mutability" value={functionInfo.stateMutability} />}
                            {functionInfo?.inputs.length > 0 && <Params type="inputs" params={functionInfo.inputs} />}
                            {functionInfo?.outputs.length > 0 && <Params type="outputs" params={functionInfo.outputs} />}
                        </> : <div className="h-full flex flex-col justify-center"><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('empty_tip')} /></div>}
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
                                    label={t('pay_currency_amount', { currency: nativeCurrency || '' })}
                                    name={ETH_INPUT_NAME}
                                    rules={[{ required: true, message: `${t('pay_currency_amount', { currency: nativeCurrency || '' })}${t('is_required')}` }]}
                                    validateTrigger={["onBlur", "onChange"]}
                                    className="!mb-2">
                                    <Input
                                        placeholder={t('pay_currency_amount', { currency: nativeCurrency || '' })}
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
                                                {functionInfo?.stateMutability == 'view' ? t('get') : null}  {functionInfo?.name}
                                            </Button>
                                                {!networkSupportCheck && <NetworkSwitchBtn supportedChainids={chainIds} />}
                                            </>
                                            : <ConnectWalletBtn danger type="primary" />}
                                    </div>
                                </Form.Item> : <div className="h-full flex flex-col justify-center"><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('empty_tip')} /> </div>}
                        </Form>
                    </div>
                    <div className="hidden min-[1200px]:block bg-gray-50 px-6 py-4 h-full">
                        <div className="border-b pb-3 mb-3">{t('unit_converter')}</div>
                        <UnitConverter />
                    </div>
                </div>
                <Drawer
                    title=""
                    placement="right"
                    closable={false}
                    onClose={onClose}
                    open={open}
                    getContainer={false}
                    className="converter-drawer"
                >
                    <UnitConverter />
                </Drawer>
            </div>

        </Card>)
}

function UnitConverter() {
    const [unitType, setUnitType] = useState('eth')
    const [input, setInput] = useState<any>('')
    const [error, setError] = useState<any>()
    const [convertRes, setConvertRes] = useState({
        eth: "",
        gwei: "",
        wei: ""
    })
    const t = useTranslations();

    const handleInput = useCallback((e: any) => {
        const val = e.target.value;
        setInput(val)
        converter(unitType, val)
    }, [unitType])

    const handleUnitChange = useCallback((unitType: any) => {
        setUnitType(unitType)
        if (input) {
            converter(unitType, input)
        }
    }, [input])

    const converter = useCallback((unitType: string, value: string,) => {
        const val = value.toString()
        try {
            let eth = "", gwei = "", wei = "";
            if (unitType == 'eth') {
                eth = val;
                gwei = parseUnits(val, 'gwei').toString()
                wei = parseEther(val).toString()
            } else if (unitType == 'gwei') {
                eth = formatUnits(val, 'gwei').toString();
                gwei = val;
                wei = parseUnits(val, 'gwei').toString()
            } else if (unitType == 'wei') {
                eth = formatEther(val).toString();
                gwei = formatUnits(val, 'gwei').toString();;
                wei = val
            }
            setConvertRes({
                eth,
                gwei,
                wei
            })
            setError("")
        } catch (e: any) {
            // console.log(e, e.message)
            setConvertRes({
                eth: "",
                gwei: "",
                wei: ""
            })
            setError("invalid data")
        }
    }, [error])

    const handleClear = () => {
        setError('')
        setInput('')
        setConvertRes({
            eth: "",
            gwei: "",
            wei: ""
        })
    }

    const selectBefore = (
        <Select defaultValue={unitType} style={{ width: 76 }} onChange={handleUnitChange}>
            <Option value="eth">Eth</Option>
            <Option value="gwei">Gwei</Option>
            <Option value="wei">Wei</Option>
        </Select>
    );
    return (<>
        <div className="text-red-500 pb-2">{error}</div>
        <div className="relative">
            <Input addonBefore={selectBefore} value={input} allowClear onChange={handleInput} onClear={handleClear} style={{ width: "100%" }} placeholder={t('converter_placeholder')} />
        </div>
        <div className="relative px-3">
            <div className="mt-3 flex"><span className="w-12 shrink-0">Eth:</span><span> {convertRes.eth ? <Text copyable={{ text: convertRes.eth }}>{convertRes.eth}</Text> : '-'}</span></div>
            <div className="mt-3  flex"><span className="w-12  shrink-0">Gwei:</span><span>{convertRes.gwei ? <Text copyable={{ text: convertRes.gwei }}>{convertRes.gwei}</Text> : '-'}</span></div>
            <div className="mt-3 flex"><span className="w-12 shrink-0">Wei:</span><span> {convertRes.wei ? <Text copyable={{ text: convertRes.wei }}>{convertRes.wei}</Text> : '-'}</span></div>
        </div>
    </>)
}

function FormItemRender({ input, disabled }: { input: any, disabled: boolean }) {
    const t = useTranslations();

    const { type } = input;
    if (type == 'bool') {
        return <FormItemRadioButton input={input} disabled={disabled} />;
    } if (type.startsWith('bytes')) {
        return <FormItemInput input={input} disabled={disabled} required rules={[{
            validator: (_: any, value: any) => {
                if (!value) {
                    return Promise.reject(new Error(`${input.name}${t('is_required')} `))
                }
                if (type == 'bytes') {
                    return isBytesLike(value) ? Promise.resolve() : Promise.reject(new Error(`${t('start_0x')}`))
                } else {
                    const length = parseInt(type.slice(5)) || 0;//[0,32]
                    const expectedLength = length * 2 + 2;
                    return isBytesLike(value) && value.length <= expectedLength ? Promise.resolve() : Promise.reject(new Error(`${t('start_0x_len_le_max', { maxLen: expectedLength })}`))
                }
            }
        }]} />;
    } else if (type == 'address') {
        return <FormItemInput input={input} disabled={disabled} required rules={[{
            validator: (_: any, value: any) => {
                if (!value) {
                    return Promise.reject(new Error(`${input.name}${t('is_required')}`))
                }
                return isAddress(value) ? Promise.resolve() : Promise.reject(new Error(t('checksum_failed')))
            }

        }]} />
    } else if (type == 'tuple') {
        return <FormItemArea input={input} disabled={disabled} rules={[{
            validator: (_: any, value: any) => {
                if (!value) {
                    return Promise.reject(new Error(`${input.name}${t('is_required')}`))
                }
                try {
                    const json = JSON.parse(value)
                    console.log('json', json)

                    return typeof (json) == 'object' ? Promise.resolve() : Promise.reject(new Error(t('incorrect_format')))
                } catch (e) {
                    return Promise.reject(new Error(t('incorrect_format')))
                }
            }
        }]} />
    } else {
        return <FormItemInput input={input} disabled={disabled} />;
    }
}

function FormItemRadioButton({ input, disabled, rules }: { input: any, disabled: boolean, rules?: any[] }) {
    const t = useTranslations();

    return <Form.Item
        label={input.name || input.internalType}
        name={input.name}
        rules={[{ required: true, message: t('require_a_value') }]}
        className="!mb-2"
    >
        <Radio.Group buttonStyle="solid" disabled={disabled}>
            <Radio.Button value={true}>True</Radio.Button>
            <Radio.Button value={false}>False</Radio.Button>
        </Radio.Group>
    </Form.Item>
}
function FormItemInput({ input, disabled, required, rules }: { input: any, disabled: boolean, required?: boolean, rules?: any[] }) {
    const t = useTranslations();

    const { name, type } = input
    return <Form.Item
        label={name}
        name={name}
        rules={rules || [{ required: true, message: `${input.name}${t('is_required')}` }]}
        required={required}
        className="!mb-2"
    >
        <Input
            key={name}
            name={name}
            placeholder={type.startsWith('bytes') ? `${type}:${t('start_0x')}` : type}
            allowClear
            disabled={disabled}
        />
    </Form.Item>
}
function FormItemArea({ input, disabled, rules }: { input: any, disabled: boolean, rules?: any[] }) {
    const t = useTranslations();

    return <Form.Item
        label={input.name || input.internalType}
        name={input.name}
        rules={rules || [{ required: true, message: t('is_required') }]}
        className="!mb-2"
    >
        <Input.TextArea rows={4}
            disabled={disabled}
            allowClear
        />
    </Form.Item>
}

