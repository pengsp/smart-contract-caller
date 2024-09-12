"use client"
import { useWeb3React } from "@web3-react/core";
import { useAuth } from "@/hooks/useAuth";
import Unlogin from "./Unlogin";
import { useEffect, useState } from "react";
import { Button } from "antd";

export default function Page() {
    const { disconnect } = useAuth()
    const { account } = useWeb3React()
    const [isLogin, setIsLogin] = useState(false)
    useEffect(() => {
        setIsLogin(account ? true : false)
    }, [account])
    return (<>
        {isLogin ? <div>
            {account}
            <Button onClick={disconnect}>Disconnect</Button>
        </div>
            : <Unlogin />
        }
    </>)
}