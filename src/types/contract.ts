
export interface BaseContract {
    name: string,
    address: string,
    chainIds: string[],
    abi: Record<string, any>[],
    remark?: string
}
export interface Contract extends BaseContract {
    hash: string,
    timestamp: number,
}
export interface FunctionItem {
    name: string,
    type: string,
    inputs: any[],
    outputs: any[],
    stateMutability: string,
    [porpName: string]: any
}