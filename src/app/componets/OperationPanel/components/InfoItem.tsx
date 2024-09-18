
export default function InfoItem({ name, value }: {
    name: string,
    value: string
}) {
    return (<div className="flex gap-2">
        <div className="">{name}:</div>
        <div className="font-bold text-blue-500">{value}</div>
    </div>)
}