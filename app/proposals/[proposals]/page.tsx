"use client";

import { usePublicClient, useAccount, useContractWrite } from "wagmi";
import { useState, useContext, useEffect } from "react";
import { Address } from "viem";
import { Proposal } from "../../../utils/types";
import { useProposal } from "@/hooks/useProposal";
import { useProposalVotes } from "@/hooks/useProposalVotes";
import { AlertCard, Button, Spinner } from "@aragon/ods";
import ProposalDescription from "@/app/containers/proposalDescription";
import VotesSection from "@/app/containers/votesSection";
import ProposalHeader from "@/app/containers/proposalHeader";
// import Blockies from "react-blockies";
import { formatUnits } from "viem";
// import { formatAddress } from "@/utils/addressHelper";
import { useUserCanVeto } from "@/hooks/useUserCanVeto";
import { useUserHasVetoed } from "@/hooks/useUserHasVetoed";
import * as dayjs from "dayjs";
import { OptimisticTokenVotingPluginAbi } from "@/artifacts/OptimisticTokenVotingPlugin.sol";
import VoteTally from "@/app/containers/voteTally";
import VotingModal from "@/app/containers/votingModal";
import ProposalDetails from "@/app/containers/proposalDetails";
import { useAlertContext, AlertContextProps } from "@/app/context/AlertContext";
import { Else, If, IfCase, Then } from "@/app/components/if";
import { PleaseWaitSpinner } from "@/app/components/pleaseWait";

const pluginAddress = (process.env.NEXT_PUBLIC_PLUGIN_ADDRESS || "") as Address;

export default function Proposal({
  params,
}: {
  params: { proposals: string };
}) {
  const publicClient = usePublicClient();
  const proposal = useProposal(
    publicClient,
    pluginAddress,
    params.proposals
  ) as Proposal;

  const userCanVeto = useUserCanVeto(BigInt(params.proposals));
  const userHasVetoed = useUserHasVetoed(BigInt(params.proposals));
  const [showDescriptionView, toggleDetailsView] = useState<boolean>(true);
  const [userVotedOption, setUserVotedOption] = useState<number>();
  const { addAlert } = useAlertContext() as AlertContextProps;
  const { address, isConnected, isDisconnected } = useAccount();
  const { write: vetoWrite } = useContractWrite({
    abi: OptimisticTokenVotingPluginAbi,
    address: pluginAddress,
    functionName: "veto",
    args: [params.proposals],
    onSuccess(data) {
      // console.log("Success creating the proposal", data);
      addAlert("We got your veto!", data.hash);
    },
  });

  if (!proposal.title) {
    return (
      <section className="flex justify-left items-left w-screen max-w-full min-w-full">
        <PleaseWaitSpinner />
      </section>
    );
  }
  return (
    <section className="flex flex-col items-center w-screen max-w-full min-w-full">
      <div className="flex justify-between py-5 w-full">
        <ProposalHeader
          proposalNumber={Number(params.proposals)}
          proposal={proposal}
          userHasVetoed={userHasVetoed}
          userCanVeto={userCanVeto as boolean}
          vetoWrite={vetoWrite}
        />
      </div>

      <div className="grid xl:grid-cols-3 lg:grid-cols-2 my-10 gap-10 w-full">
        <VoteTally
          voteType="Veto"
          voteCount={proposal?.vetoTally}
          votePercentage={100}
          color="neutral"
          option={1}
        />

        <ProposalDetails
          minVetoVotingPower={proposal.parameters?.minVetoVotingPower}
          endDate={proposal.parameters?.endDate}
          snapshotBlock={proposal.parameters?.snapshotBlock}
        />
      </div>
      <div className="py-12 w-full">
        <div className="flex flex-row space-between">
          <h2 className="flex-grow text-3xl text-neutral-900 font-semibold">
            {showDescriptionView ? "Description" : "Votes"}
          </h2>
        </div>
        <ProposalDescription {...proposal} />
      </div>
    </section>
  );
}
