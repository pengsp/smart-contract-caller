
import { Web3ReactHooks } from "@web3-react/core";
import { Connector } from "@web3-react/types";

export enum ConnectionType {
    INJECTED = "INJECTED"
}
export interface ProviderInfo {
    name: string;
    icon?: string;
    rdns?: string;
}
export interface Connection {
    connector: Connector;
    hooks: Web3ReactHooks;
    type: ConnectionType;
    //   shouldDisplay(): boolean;
    //   /** Executes specific pre-activation steps necessary for some connection types. Returns true if the connection should not be activated. */
    //   overrideActivate?: (chainId?: ChainId) => boolean;
    //   /** Optionally include isDarkMode when displaying icons that should change with current theme */
    getProviderInfo(): ProviderInfo;
}

export interface RecentConnectionMeta {
    type: ConnectionType;
    rdns?: string; // rdns usage reference: https://eips.ethereum.org/EIPS/eip-6963#provider-info
    address?: string;
    ENSName?: string;
    disconnected?: boolean;
}

export const connectionMetaKey = "connection";