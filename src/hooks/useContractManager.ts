import { LocalStorageContracts, LocalStorageCurrentContract } from "@/constants";
import { BaseContract, Contract } from "@/types";
import { isAddress, toHex } from "@/utils";
import { useLocalStorageState } from "ahooks";
import { id } from "ethers";
import { useCallback, useEffect, useState } from "react";

export function useContractManager() {
    const [localContracts, setLocalContracts] = useLocalStorageState<Contract[]>(
        LocalStorageContracts,
        {
            defaultValue: [],
            listenStorageChange: true
        },
    );
    const [currentContractHash, setCurrentContractHash] = useLocalStorageState<string | undefined | null>(
        LocalStorageCurrentContract,
        {
            defaultValue: '',
            listenStorageChange: true
        },
    );

    const [currentContract, setCurrentContract] = useState<Contract | null>(null)
    const contractsCount = localContracts?.length || 0;

    useEffect(() => {
        if (currentContractHash && localContracts) {
            const target = localContracts.find(contract => contract.hash == currentContractHash);
            setCurrentContract(target || null)
        } else {
            setCurrentContract(null)
        }
    }, [localContracts, currentContractHash])

    const generateHashTime = () => {
        const timestamp = new Date().getTime()
        const random = Math.random()
        const hash = id(`${timestamp}${random}`)
        return { hash, timestamp };
    }

    const addContract = useCallback(({ name, address, chainIds, abi, remark }: BaseContract) => {
        const hashTime = generateHashTime()
        const { hash, timestamp } = hashTime;
        const newContract = { name, address, chainIds, abi, remark, hash, timestamp }
        setLocalContracts(localContracts ? [newContract, ...localContracts] : [newContract])
        setCurrentContractHash(hash)
    }, [localContracts])

    const deleteContract = useCallback((hash: string) => {
        const _localContracts: Contract[] = []
        localContracts?.map(contract => {
            if (contract.hash != hash) {
                console.log(contract.hash, hash)
                _localContracts.push(contract)
            }
        }) || []
        setCurrentContractHash('')
        setLocalContracts(_localContracts)
    }, [localContracts])

    const updateContract = useCallback((contract: Contract) => {
        const newContracts = localContracts?.map(item => {
            if (item.hash == contract.hash) {
                return contract
            } else {
                return item;
            }
        })
        setLocalContracts(newContracts ? [...newContracts] : [])
    }, [localContracts])

    const batchAddContract = useCallback((contracts: Contract[]) => {
        try {
            let count = 0;
            if (typeof contracts != 'object') {
                contracts = JSON.parse(contracts)
            }
            if (contracts instanceof Array) {
                const _initContracts: Contract[] = []
                contracts.map((item: any) => {
                    const { name, address, chainIds, abi, remark } = item
                    const addressCheck = isAddress(address)
                    const chainIdsCheck = chainIds instanceof Array;
                    const abiCheck = abi instanceof Array
                    if (name && addressCheck && chainIdsCheck && abiCheck) {
                        chainIds.map(chainId => toHex(chainId))
                        const hashTime = generateHashTime()
                        const { hash, timestamp } = hashTime;
                        _initContracts.push({ name, address, hash, chainIds, abi, timestamp, remark })
                    }
                })
                if (_initContracts && _initContracts.length > 0) {
                    setLocalContracts(localContracts ? [..._initContracts, ...localContracts] : _initContracts)
                    setCurrentContractHash(_initContracts[0].hash)
                    count = _initContracts.length
                }
            }
            return { count, result: true }
        } catch (e) {
            return { result: false, msg: 'Incorrect format' }
        }
    }, [localContracts])

    const batchDeleteContract = useCallback((hashs: string[]) => {
        const _localContracts = localContracts?.filter(contract => !hashs.includes(contract.hash)) || []
        setLocalContracts([..._localContracts])
    }, [localContracts])

    return {
        addContract,
        batchAddContract,
        deleteContract,
        batchDeleteContract,
        updateContract,
        setCurrentContractHash,
        localContracts,
        contractsCount,
        currentContractHash,
        currentContract,
    }
}