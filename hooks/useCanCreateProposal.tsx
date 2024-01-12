import { Address } from 'viem'
// import { Proposal } from '@/utils/types'
import { useState, useEffect } from 'react'
import { useContractReads, useBalance, useAccount } from 'wagmi';
import { OptimisticTokenVotingPluginAbi } from '../artifacts/OptimisticTokenVotingPlugin.sol';


const pluginAddress = ((process.env.NEXT_PUBLIC_PLUGIN_ADDRESS || "") as Address)

export function useCanCreateProposal() {
    const [isCreator, setIsCreator] = useState<boolean>(false);
    const [minProposerVotingPower, setMinProposerVotingPower] = useState<bigint>();
    const [votingToken, setVotingToken] = useState<Address>();
    const { address, isConnecting, isDisconnected } = useAccount()
    const { data: balance } = useBalance({ address, token: votingToken, })

    const { data: contractReads, isError, isLoading } = useContractReads({
        contracts: [
            {
                address: pluginAddress,
                abi: OptimisticTokenVotingPluginAbi,
                functionName: 'minProposerVotingPower',
            },
            {
                address: pluginAddress,
                abi: OptimisticTokenVotingPluginAbi,
                functionName: 'getVotingToken',
            }
        ]
    })

    useEffect(() => {
        if (contractReads?.length) {
            setMinProposerVotingPower(contractReads[0]?.result as bigint)

            setVotingToken(contractReads[1]?.result as Address)
        }
    }, [contractReads])

    useEffect(() => {
        if (minProposerVotingPower === BigInt(0)) setIsCreator(true)
        if (balance && minProposerVotingPower && balance?.value >= minProposerVotingPower) setIsCreator(true)
    }, [balance])

    return isCreator
}
