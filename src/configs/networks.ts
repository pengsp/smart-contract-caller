export interface Network {
  chainId: number | string,
  chainName: string,
  nativeCurrency: {
    name: string,
    symbol: string,
    decimals: number
  },
  rpcUrls: string[],
  blockExplorerUrls: string[],
  iconUrls?: string[]
}

export const networks: Network[] = [
  {
    chainId: `0x1`,// 324
    chainName: 'Ethereum Mainnet',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://eth.drpc.org'],
    blockExplorerUrls: ['https://etherscan.io/'],
    iconUrls: ["/images/eth.svg"],
  },
  {
    chainId: `0x144`,// 324
    chainName: 'zkSync Mainnet',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://mainnet.era.zksync.io'],
    blockExplorerUrls: ['https://explorer.zksync.io/'],
    iconUrls: ["/images/zkSync.svg"],
  },
  {
    chainId: `0x38`,// 56
    chainName: 'BNB Smart Chain Mainnet',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18
    },
    rpcUrls: ['https://bsc-dataseed1.ninicoin.io', 'https://bsc-dataseed2.ninicoin.io'],
    blockExplorerUrls: ['https://bscscan.com/'],
    iconUrls: ["/images/bnb.svg"],
  },
  {
    chainId: `0x61`,// 97
    chainName: 'BNB Smart Chain Testnet',
    nativeCurrency: {
      name: 'tBNB',
      symbol: 'tBNB',
      decimals: 18
    },
    rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
    blockExplorerUrls: ['https://testnet.bscscan.com/'],
    iconUrls: ["/images/bnb.svg"],
  },
  {
    chainId: `0xa86a`,// 43114
    chainName: 'Avalanche C-Chain',
    nativeCurrency: {
      name: 'Avalanche',
      symbol: 'AVAX',
      decimals: 18
    },
    rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
    blockExplorerUrls: ['https://snowtrace.io/'],
    iconUrls: ["/images/avax.svg"],
  },
  {
    chainId: `0xa869`,// 43113
    chainName: 'Avalanche Fuji Testnet',
    nativeCurrency: {
      name: 'Avalanche',
      symbol: 'AVAX',
      decimals: 18
    },
    rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
    blockExplorerUrls: ['https://testnet.snowtrace.io/'],
    iconUrls: ["/images/avax.svg"],
  },
]