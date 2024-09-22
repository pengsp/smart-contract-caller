export interface Contract {
    name: string,
    address: string,
    hash: string,
    chainIds: string[],
    abi: Record<string, any>[],
    timestamp: number
}
export interface FunctionItem {
    name: string,
    type: string,
    inputs: any[],
    outputs: any[],
    stateMutability: string,
    [porpName: string]: any
}