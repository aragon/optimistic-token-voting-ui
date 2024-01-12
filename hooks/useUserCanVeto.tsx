import { Address } from 'viem'
import { Proposal } from '@/utils/types'
import { useState, useEffect } from 'react'
import { useContractReads, useContractRead, useBalance, useAccount } from 'wagmi';
import { OptimisticTokenVotingPluginAbi } from '../artifacts/OptimisticTokenVotingPlugin.sol';


const pluginAddress = ((process.env.NEXT_PUBLIC_PLUGIN_ADDRESS || "") as Address)

export function useUserCanVeto(proposalId: bigint) {
            const { address } = useAccount()

            const { data: canVeto, isError, isLoading } = useContractRead({
                        address: pluginAddress,
                        abi: OptimisticTokenVotingPluginAbi,
                        functionName: 'canVeto',
                        args: [proposalId, address!]
            })

            return canVeto
}
