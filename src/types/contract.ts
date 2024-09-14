export interface Contract {
    name: string,
    address: string,
    hash: string,
    chainIds: string[],
    abi: Record<string, any>[],
    timestamp: number
}