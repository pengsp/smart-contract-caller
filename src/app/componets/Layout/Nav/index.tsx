
import { GithubOutlined, SettingOutlined } from "@ant-design/icons";
import Connection from "../../Connection";
export default function Nav() {
    return (
        <div className=" sticky top-0 left-0 right-0 p-6  border-b bg-white z-10 h-[112px]">
            <div className="flex justify-between items-center">
                <div>
                    <div className="text-2xl">区块链智能合约调试工具</div>
                    <p className="text-gray-400 mt-2">合约调用，如此简单 <SettingOutlined spin /></p>
                </div>
                <div className="flex items-center gap-5">
                    <Connection />
                    <a href="https://github.com/pengsp/smart-contract-caller" target="_blank" title="Github">
                        <GithubOutlined className="text-2xl hover:scale-105 " />
                    </a>
                </div>
            </div>
        </div>
    )
}