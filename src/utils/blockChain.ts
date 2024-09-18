import { Contract } from "ethers";
import { getAddress } from "@ethersproject/address";
import { AddressZero } from "@ethersproject/constants";
import { JsonRpcSigner, Web3Provider } from "@ethersproject/providers";
import { ethers } from "ethers";

// 千分位标记
export function commify(value: any) {

  if (value < 1000) {
    return Number(value)
  }
  const valueStr = value.toString()
  const match = valueStr.match(/^(-?)([0-9]*)(\.?)([0-9]*)$/);
  if (!match || (!match[2] && !match[4])) {
    throw new Error(`bad formatted number: ${JSON.stringify(value)}`);
  }
  const neg = match[1];
  const whole = BigInt(match[2] || 0).toLocaleString("en-us");
  const frac = match[4] ? match[4].match(/^(.*?)0*$/)[1] : "";
  if (frac) {
    return `${neg}${whole}.${frac}`;
  } else {
    return `${neg}${whole}`;
  }
}

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
  try {
    // console.log('getAddress (value)', getAddress(value))
    return getAddress(value);
  } catch {
    return false;
  }
}
// account is not optional
export function getSigner(
  library: Web3Provider,
  account: string
): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked();
}

// account is optional
export function getProviderOrSigner(
  library: Web3Provider,
  account?: string
): Web3Provider | JsonRpcSigner {
  return account ? getSigner(library, account) : library;
}

// account is optional
export function getContract(
  address: string,
  ABI: any,
  library: Web3Provider,
  account?: string
): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }

  return new Contract(
    address,
    ABI,
    getProviderOrSigner(library, account) as any
  );
}

export const toHex = (num: number) => {
  const val = Number(num);
  return "0x" + val.toString(16);
};
