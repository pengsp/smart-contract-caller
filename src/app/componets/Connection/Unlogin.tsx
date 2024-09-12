"use client"
import { useAuth } from "@/hooks/useAuth";
import { useWeb3React } from "@web3-react/core"
import { Button } from "antd"
import { useCallback } from "react";

export default function Unlogin() {
    const { account, connector } = useWeb3React()

    const { connect } = useAuth()

    const login = useCallback(async () => {
        await connect();

    }, [connector])
    return (<>
        <Button onClick={login}>Connect MetaMask</Button>
        {account}</>)
}