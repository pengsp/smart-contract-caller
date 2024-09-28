import { LocalStorageNetworks } from "@/constants";
import { Network } from "@/types";
import { toHex } from "@/utils";
import { useLocalStorageState } from "ahooks";
import { useCallback } from "react";
import networks from "@/configs/chains.json";
export function useNetworkManager() {
    const [frequentlyUsedNetworks, setFrequentlyUsedNetworks] = useLocalStorageState<Network[]>(
        LocalStorageNetworks,
        {
            defaultValue: [],
            listenStorageChange: true
        },
    );

    const networksCount = networks?.length || 0;

    const getNetwork = (chainId: string | number | undefined) => {
        if (chainId) {
            const network = networks?.find(network => Number(network.chainId) == Number(chainId))
            return network;
        } else {
            return null
        }
    }

    return {
        getNetwork,
        frequentlyUsedNetworks,
        networksCount
    }
}