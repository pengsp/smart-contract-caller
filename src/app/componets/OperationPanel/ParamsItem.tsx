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
                                    <ParamsTemplate param={item} index={i} />
                                    {item.type == 'tuple' && <ParamsItem params={item.components} key={i} level={level} />}
                                </div>
                            })
                        }
                    </div>
                </div>
                : <ParamsTemplate key={`${param.name}-${index}`} param={param} index={index} />
        )}
    </div>)
}

function ParamsTemplate({ param, index }: { param: any, index: number }) {
    return (<div className="flex gap-2">
        <span>[{index}]</span>
        <span>{param.type}</span>
        <span className="text-blue-400 font-bold">{param.name}</span>
        {param.type != param.internalType && <span className="text-gray-300">{param.internalType}</span>}
    </div>)
}