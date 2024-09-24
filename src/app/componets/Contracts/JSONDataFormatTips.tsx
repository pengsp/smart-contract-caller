export default function JSONDataFormatTips() {
    return (<div className="mb-6">
        <div className="mb-2">上传的数据应该是一个数组,数据结构参考如下</div>
        <div className="bg-gray-200 p-4 rounded">
            <div className="flex gap-1 ">{`[`}</div>
            <div className="ml-2 font-sans">{`{`}</div>
            <div className="flex  ml-5">
                <span>&quot;</span>
                <span className="text-blue-400">name</span>
                <span>&quot;</span>
                <span className="mx-1">:</span>
                <span>&quot;</span>
                <span className="text-green-600">UnitTestToken-01</span>
                <span>&quot;</span>
            </div>
            <div className="flex  ml-5">
                <span>&quot;</span>
                <span className="text-blue-400">address</span>
                <span>&quot;</span>
                <span className="mx-1">:</span>
                <span>&quot;</span>
                <span className="text-green-600">0x62b00a916a28553bc1c0868d5ea2d4a33a4f70bb</span>
                <span>&quot;</span>
            </div>
            <div className="flex  ml-5">
                <span>&quot;</span>
                <span className="text-blue-400">chainIds</span>
                <span>&quot;</span>
                <span className="mx-1">:</span>
                <span>[</span>
                <span>&quot;</span>
                <span className="text-green-600">0x61</span>
                <span>&quot;</span>
                <span>]</span>
            </div>
            <div className="flex  ml-5">
                <span>&quot;</span>
                <span className="text-blue-400">abi</span>
                <span>&quot;</span>
                <span className="mx-1">:</span>
                <span>[</span>
                <span>{`{`}</span>
                <span className="text-green-600"> ... </span>
                <span>{`}`}</span>
                <span>]</span>
            </div>
            <div className="flex  ml-5">
                <span>&quot;</span>
                <span className="text-blue-400">remark</span>
                <span>&quot;</span>
                <span className="mx-1">:</span>
                <span>&quot;</span>
                <span className="text-green-600">This is a unit test contract</span>
                <span>&quot;</span>
            </div>
            <div className="ml-2 font-sans">{`} ,`}</div>
            <div className="ml-2 font-sans">{`{`}</div>

            <div className="flex  ml-5">
                <span>&quot;</span>
                <span className="text-blue-400">name</span>
                <span>&quot;</span>
                <span className="mx-1">:</span>
                <span>&quot;</span>
                <span className="text-green-600">UnitTestToken-02</span>
                <span>&quot;</span>
            </div>
            <div className="flex  ml-5">
                <span>&quot;</span>
                <span className="text-blue-400">address</span>
                <span>&quot;</span>
                <span className="mx-1">:</span>
                <span>&quot;</span>
                <span className="text-green-600">0xf2AdcfcC8c1A77F940cC93C909df6075591Ff28c</span>
                <span>&quot;</span>
            </div>
            <div className="flex  ml-5">
                <span>&quot;</span>
                <span className="text-blue-400">chainIds</span>
                <span>&quot;</span>
                <span className="mx-1">:</span>
                <span>[</span>
                <span>&quot;</span>
                <span className="text-green-600">0x61</span>
                <span>&quot;</span>
                <span>]</span>
            </div>
            <div className="flex  ml-5">
                <span>&quot;</span>
                <span className="text-blue-400">abi</span>
                <span>&quot;</span>
                <span className="mx-1">:</span>
                <span>[</span>
                <span>{`{`}</span>
                <span className="text-green-600"> ... </span>
                <span>{`}`}</span>
                <span>]</span>
            </div>

            <div className="flex  ml-5">
                <span>&quot;</span>
                <span className="text-blue-400">remark</span>
                <span>&quot;</span>
                <span className="mx-1">:</span>
                <span>&quot;</span>
                <span className="text-green-600">This is a unit test contract</span>
                <span>&quot;</span>
            </div>
            <div className="ml-2 font-sans">{`}`}</div>
            <div >{`]`}</div>
        </div>
    </div>)
}
