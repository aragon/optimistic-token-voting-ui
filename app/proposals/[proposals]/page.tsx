"use client";

import { usePublicClient, useAccount, useContractWrite } from 'wagmi';
import { useState, useContext, useEffect } from 'react'
import { Address } from 'viem'
import { Proposal } from '../../../utils/types';
import { useProposal } from '@/hooks/useProposal';
import { useProposalVotes } from '@/hooks/useProposalVotes';
import { AlertCard, Button } from '@aragon/ods'
import ProposalDescription from '@/app/containers/proposalDescription';
import VotesSection from '@/app/containers/votesSection';
import ProposalHeader from '@/app/containers/proposalHeader';
import Blockies from 'react-blockies';
import { formatUnits } from 'viem'
import { formatAddress } from '@/utils/addressHelper'
import { useUserCanVote } from '@/hooks/useUserCanVote';
import { useUserCanVeto } from '@/hooks/useUserCanVeto';
import * as dayjs from 'dayjs'
import { OptimisticVotingAbi } from '@/artifacts/OptimisticVoting.sol';
import VoteTally from '@/app/containers/voteTally'
import VotingModal from '@/app/containers/votingModal';
import ProposalDetails from '@/app/containers/proposalDetails';
import { useAlertContext, AlertContext, AlertContextProps } from '@/app/context/AlertContext';


const pluginAddress = ((process.env.NEXT_PUBLIC_PLUGIN_ADDRESS || "") as Address)


export default function Proposal({ params }: { params: { proposals: string } }) {
  const publicClient = usePublicClient()
  const proposal = (useProposal(publicClient, pluginAddress, params.proposals) as Proposal);
  const userCanVeto = useUserCanVeto(BigInt(params.proposals))
  const [descriptionSection, setDescriptionSection] = useState<boolean>(true);
  const { address, isConnected, isDisconnected } = useAccount()

  if (proposal.title) return (
    <section className="flex flex-col items-center  w-screen max-w-full min-w-full">
      <div className="flex justify-between px-4 py-5 w-full">
        <ProposalHeader proposalNumber={Number(params.proposals)} proposal={proposal} userCanVeto={userCanVeto as boolean} />
      </div>

      <div className="grid grid-cols-3 my-10 gap-10 w-full">
        <ProposalDetails vetoTally={proposal.vetoTally} endDate={proposal?.parameters?.endDate} snapshotBlock={proposal?.parameters?.snapshotBlock} />
      </div>
      <div className="py-12 w-full">
        <div className="flex flex-row space-between">
          <h2 className="flex-grow text-3xl text-neutral-900 font-semibold">
            {descriptionSection ? 'Description' : 'Votes'}
          </h2>
          <div className="flex flex-row gap-4">
            <h2 className={`px-3 py-2 border-2 rounded-3xl hover:bg-primary-500 hover:text-neutral-50 hover:border-primary-500 ${descriptionSection ? 'border-primary-500' : 'border-neutral-500'}`} onClick={() => setDescriptionSection(true)}>Description</h2>
            <h2 className={`px-3 py-2 border-2 rounded-3xl hover:bg-primary-500 hover:text-neutral-50 hover:border-primary-500 ${!descriptionSection ? 'border-primary-500' : 'border-neutral-500'}`} onClick={() => setDescriptionSection(false)}>Vetos</h2>
          </div>
        </div>

        <ProposalDescription {...proposal} />
      </div>
    </section>
  )
}


