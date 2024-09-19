export type Mutability = "view" | "nonpayable" | "payable"
export type LogType = "Event" | "Transaction" | "View" | "TransactionMined"
export interface EventItem {
    name: string,
    values: any[]
}
export interface EventLog {
    type: LogType,
    events: EventItem[],
    hash?: string,
    createdAt?: string,
    [propName: string]: any
}
export interface ViewLog {
    type: LogType,
    function: string,
    stateMutability?: Mutability,
    params?: any[],
    result?: any,
    error?: any,
    createdAt?: string,
    [propName: string]: any
}
export interface TransactionLog extends ViewLog {
    value?: string,
    hash?: string,
    explorer?: string,
    [propName: string]: any
}
export interface TransactionMinedLog {
    type: LogType,
    function?: string,
    hash?: string,
    explorer?: string,
    [propName: string]: any
}
export type Log = EventLog | TransactionLog | TransactionMinedLog