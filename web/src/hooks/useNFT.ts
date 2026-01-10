'use client';

import { ADDRESSES, MyNFTAbi } from '@/src/utils/contracts';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useState } from 'react';

export const useNFT = () => {
  const [hash, setHash] = useState<`0x${string}` | undefined>();

  const { writeContractAsync, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } =
    useWaitForTransactionReceipt({
      hash,
    });

  const mint = async (to: `0x${string}`, metadataHash: string) => {
    const txHash = await writeContractAsync({
      address: ADDRESSES.myNFT,
      abi: MyNFTAbi,
      functionName: 'mint',
      args: [to, metadataHash],
    });

    setHash(txHash);
  };

  return {
    mint,
    isConfirming,
    isSuccess,
    isPending,
  };
};
