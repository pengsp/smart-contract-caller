import { Web3ReactHooks } from '@web3-react/core'
import { initializeConnector } from '@web3-react/core'
import { MetaMask } from '@web3-react/metamask'
import { Connection, connectionMetaKey, ConnectionType, RecentConnectionMeta } from './types'

const [metaMask, hooks] = initializeConnector<MetaMask>((actions) => new MetaMask({ actions }))
export const connectors: [MetaMask, Web3ReactHooks][] = [[metaMask, hooks]]
export const deprecatedInjectedConnection: Connection = {
    getProviderInfo: () => {
        return { name: "string", icon: "string", rdns: "string" };
    },
    connector: metaMask,
    hooks: hooks,
    type: ConnectionType.INJECTED,
};

export function getConnection() {
    return deprecatedInjectedConnection;
}

function isRecentConnectionMeta(value: { type: ConnectionType }): value is RecentConnectionMeta {
    const test: RecentConnectionMeta = { type: value.type }; // reconstruct literal to ensure all required fields are present
    return Boolean(test.type && ConnectionType[test.type]);
}

export function getRecentConnectionMeta(): RecentConnectionMeta | undefined {
    if (typeof window !== "undefined") {
        const value = localStorage.getItem(connectionMetaKey);
        if (!value) return;

        try {
            const json = JSON.parse(value);
            if (isRecentConnectionMeta(json)) return json;
        } catch (e) {
            console.warn(e);
        }
        // If meta is invalid or there is an error, clear it from local storage.
        setRecentConnectionMeta(undefined);
    }
    return;
}

export function setRecentConnectionMeta(
    meta: RecentConnectionMeta | undefined
) {
    if (typeof window !== "undefined") {
        if (!meta) return localStorage.removeItem(connectionMetaKey);

        localStorage.setItem(connectionMetaKey, JSON.stringify(meta));
    }
}
