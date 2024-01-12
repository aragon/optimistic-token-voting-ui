import { Address } from 'viem'
import { Proposal } from '@/utils/types'
import { useState, useEffect } from 'react'
import { useContractReads, useContractRead, useBalance, useAccount } from 'wagmi';
import { OptimisticTokenVotingPluginAbi } from '../artifacts/OptimisticTokenVotingPlugin.sol';


const pluginAddress = ((process.env.NEXT_PUBLIC_PLUGIN_ADDRESS || "") as Address)

export function useUserHasVetoed(proposalId: bigint) {
  const { address } = useAccount()

  const { data: hasVetoed, isError, isLoading } = useContractRead({
    address: pluginAddress,
    abi: OptimisticTokenVotingPluginAbi,
    functionName: 'hasVetoed',
    args: [proposalId, address!]
  })

  return hasVetoed
}
