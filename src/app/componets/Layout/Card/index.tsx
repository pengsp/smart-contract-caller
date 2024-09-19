import { ReactNode } from "react"

export default function Card({ title, rootClassName, extra, children }: {
    title?: ReactNode,
    rootClassName?: string,
    extra?: ReactNode
    children?: any,
}) {
    return (<div className={`border p-4 rounded ${rootClassName || ''}`}>
        {(title || extra) && <div className="border-b pb-4 flex items-center justify-between">
            <div>{title}</div>
            <div>{extra}</div>
        </div>}
        {children}
    </div>)
}