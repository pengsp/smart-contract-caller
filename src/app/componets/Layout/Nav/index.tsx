
import Connection from "../../Connection";
export default function Nav() {
    return (
        <div className=" sticky top-0 left-0 right-0 p-6  border-b bg-white z-10 h-[112px]">
            <div className="flex justify-between items-center">
                <div>
                    <div className="text-2xl">智能合约调试工具</div>
                    <p className="text-gray-400 mt-2">通过ABI直接调用合约方法，无需验证合约。</p>
                </div>
                <Connection />
            </div>
        </div>
    )
}