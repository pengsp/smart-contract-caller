import { useAuth } from "@/hooks/useAuth";
import { useWeb3React } from "@web3-react/core";
import { Button } from "antd";
import { useCallback } from "react";

export default function ConnectWalletBtn(props: { [propName: string]: any }) {
    const { connect, disconnect } = useAuth()
    const { account, chainId, connector } = useWeb3React()
    const login = useCallback(async () => {
        await connect();
    }, [connector])
    return (<Button onClick={login} type="primary" {...props} >Connect MetaMask</Button>)
}