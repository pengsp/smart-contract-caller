
import Connection from "../../Connection";
export default function Nav() {
    return (
        <div className=" sticky top-0 left-0 right-0 p-6  border-b bg-white z-10 h-[112px]">
            <div className="flex justify-between items-center">
                <div>
                    <div className="text-2xl">智能合约调试工具</div>
                    <p className="text-gray-400 mt-2">合约调用，如此简单。</p>
                </div>
                <Connection />
            </div>
        </div>
    )
}