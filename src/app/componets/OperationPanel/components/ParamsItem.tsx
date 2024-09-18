export default function ParamsItem({ type, params }: {
    type: string
    params: Record<string, any>[]
}) {
    return (<>
        <div >{type}:</div>
        <div className="ml-3 text-gray-400" >
            {params.map((param: any, index: number) => {
                return <div key={index}>[{index}] {param.type} {param.name} </div>
            }
            )}
        </div>
    </>)
}