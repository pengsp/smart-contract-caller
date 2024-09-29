import networks from "@/configs/chains.json";
export function useNetworkManager() {

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
        networksCount
    }
}