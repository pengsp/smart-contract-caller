import { Card } from "antd";

export default function Logs({ logs }: { logs: Record<string, any>[] }) {
    return <Card title="Logs" extra={<a href="#">清除</a>} style={{ width: "100%", height: "100%" }}>
        <p>Card content</p>
        <p>Card content</p>
        <p>Card content</p>
    </Card>
}