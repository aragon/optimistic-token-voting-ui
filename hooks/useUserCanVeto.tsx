import { Address } from 'viem'
import { Proposal } from '@/utils/types'
import { useState, useEffect } from 'react'
import { useContractReads, useContractRead, useBalance, useAccount } from 'wagmi';
import { OptimisticVotingAbi } from '@/artifacts/OptimisticVoting.sol';


const pluginAddress = ((process.env.NEXT_PUBLIC_PLUGIN_ADDRESS || "") as Address)

export function useUserCanVeto(proposalId: bigint) {
  const { address, isConnecting, isDisconnected } = useAccount()

  const { data: canVeto, isError, isLoading } = useContractRead({
    address: pluginAddress,
    abi: OptimisticVotingAbi,
    functionName: 'canVeto',
    args: [proposalId, address]
  })

  return canVeto
}
