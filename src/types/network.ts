export interface Network {
    chainId: string, // A 0x-prefixed hexadecimal chainId
    chainName: string,
    nativeCurrency: {
        name: string,
        symbol: string,
        decimals: number
    },
    rpcUrls: string[],
    blockExplorerUrls: string[],
    iconUrls?: string[],
    [propName: string]: any
}