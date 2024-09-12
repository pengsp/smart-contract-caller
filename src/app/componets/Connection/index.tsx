"use client"
import { useWeb3React } from "@web3-react/core";
import { useAuth } from "@/hooks/useAuth";
import Unlogin from "./Unlogin";
import { useEffect, useState } from "react";
import { Button } from "antd";

export default function Page() {
    const { disconnect } = useAuth()
    const { account, chainId } = useWeb3React()
    const [isLogin, setIsLogin] = useState(false)
    useEffect(() => {
        setIsLogin(account ? true : false)
    }, [account])
    return (<>
        {isLogin ? <div className="mb-10 py-6 border-b  m-6">
            <div className=" text-xl font-bold text-[--base-blue] border-[--base-blue]">Connection</div>

            <div className="flex justify-between gap-2">
                <span>Address</span>
                <span>{account}</span>
            </div>
            <div className="flex justify-between gap-2">
                <span>ChainId</span>
                <span>{chainId}</span>
            </div>
            <Button onClick={disconnect} block>Disconnect</Button>
        </div>
            : <Unlogin />
        }
    </>)
}