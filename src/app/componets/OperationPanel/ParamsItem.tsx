export default function Params({ type, params }: {
    type: string
    params: Record<string, any>[]
}) {
    return (<>
        <div >{type}:</div>
        <div className="text-gray-400  text-sm">
            <ParamsItem params={params} level={1} />
        </div>
    </>)
}

export function ParamsItem({ params, level = 1 }: {
    params: Record<string, any>[],
    level: number
}) {
    return (<div className={`${level > 1 && "ml-4 "}`}>
        {params?.map((param: any, index: number) =>
            param.type == 'tuple' ?
                <div key={`tuple-${index}-${param.internalType}`}>
                    <div className="flex gap-2">
                        <span>[{index}]</span>
                        <span>{param.type}</span>
                        <span>{param.internalType}</span>
                    </div>
                    <div className="ml-4">
                        {
                            param.components?.map((item: any, i: number) => {
                                level++
                                return <div key={`${item.name}-${i}`} >
                                    <div className="flex gap-2">
                                        <span>[{i}]</span>
                                        <span>{item.type}</span>
                                        <span>{item.name}</span>
                                        {item.type == 'tuple' && <span className="text-gray-300">{item.internalType}</span>}
                                    </div>
                                    {item.type == 'tuple' && <ParamsItem params={item.components} key={i} level={level} />}
                                </div>
                            })
                        }
                    </div>
                </div>
                : <div key={`${param.name}-${index}`} className="flex gap-2">
                    <span>[{index}]</span>
                    <span>{param.type}</span>
                    <span>{param.name}</span>
                </div>
        )}
    </div>)
}