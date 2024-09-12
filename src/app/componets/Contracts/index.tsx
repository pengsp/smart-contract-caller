import { Button } from "antd";
import classes from "./contracts.module.scss"
export default function Contracts() {
    return (<div className={classes.root}>
        <div className="flex items-center justify-between p-4 ">
            <div>合约列表</div>
            <Button>增加合约</Button>
        </div>
        <div className={classes.list}>
            <div className={classes.item}>
                <div className={classes.name}>USDT</div>
                <div className={classes.address}>0x44979066D87b82954B1759B07B9B35EB82E76BA1</div>
                <div className={classes.chainInfo}>Avalanche Fuji Testnet (43113)</div>
            </div>
            <div className={classes.item}>
                <div className={classes.name}>USDT</div>
                <div className={classes.address}>0x44979066D87b82954B1759B07B9B35EB82E76BA1</div>
                <div className={classes.chainInfo}>Avalanche Fuji Testnet (43113)</div>
            </div>
            <div className={classes.item_current}>
                <div className={classes.name}>USDT</div>
                <div className={classes.address}>0x44979066D87b82954B1759B07B9B35EB82E76BA1</div>
                <div className={classes.chainInfo}>Avalanche Fuji Testnet (43113)</div>
            </div>
        </div>
    </div>)
}