import Card from "../../Layout/Card";

export default function Logs({ logs }: { logs: Record<string, any>[] }) {
    return <Card title="Logs" extra={<a href="#">清除</a>} rootClassName="h-full" >
        <div className="py-4">
            <p>Card content</p>
            <p>Card content</p>
            <p>Card content</p>
        </div>

    </Card>
}