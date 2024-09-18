import { Contract } from "ethers";
import { useMemo } from "react";
import { getContract } from "../utils";
import { useWeb3React } from "@web3-react/core";

// returns null on errors
export function useContract(
  address: string | undefined,
  ABI: any,
  withSignerIfPossible = true
): Contract | null {
  const { provider, account, chainId } = useWeb3React();
  return useMemo(() => {
    if (!address || !ABI || !provider) return null;
    try {
      return getContract(
        address,
        ABI,
        provider,
        withSignerIfPossible && account ? account : undefined
      );
    } catch (error) {
      console.error("Failed to get contract", error);
      return null;
    }
  }, [address, ABI, provider, withSignerIfPossible, account, chainId]);
}



