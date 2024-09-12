"use client"
import { connectors } from '@/connection'
import { Web3ReactProvider } from '@web3-react/core'
import { ReactNode } from 'react'



export default function Web3Provider({ children }: { children: ReactNode }) {
    return (
        <Web3ReactProvider connectors={connectors}>
            {children}
        </Web3ReactProvider>
    )
}

