import { AlertInline, Button } from '@aragon/ods'
import { Proposal } from '@/utils/types'
import { formatAddress } from '@/utils/addressHelper';
import * as dayjs from 'dayjs'
import { usePublicClient, useAccount, useContractWrite } from 'wagmi';
import { OptimisticVotingAbi } from '@/artifacts/OptimisticVoting.sol';
import { useAlertContext, AlertContext, AlertContextProps } from '@/app/context/AlertContext';
import { Address } from 'viem'

const pluginAddress = ((process.env.NEXT_PUBLIC_PLUGIN_ADDRESS || "") as Address)

interface ProposalHeaderProps {
  proposalNumber: number;
  proposal: Proposal;
  userCanVeto: boolean;
  setShowVotingModal: Function
}

const ProposalHeader: React.FC<ProposalHeaderProps> = ({ proposalNumber, proposal, userCanVeto, setShowVotingModal }) => {
  const { addAlert } = useAlertContext() as AlertContextProps
  const { write: vetoWrite } = useContractWrite({
    abi: OptimisticVotingAbi,
    address: pluginAddress,
    functionName: 'veto',
    args: [proposalNumber],
    onSuccess(data) {
      console.log('Success creating the proposal', data)
      addAlert("We got your vote!", data.hash)
    },
  });


  const getProposalVariantStatus = (proposal: Proposal) => {
    return {
      variant: proposal?.open ? 'info' : proposal?.executed ? 'success' : proposal?.tally?.no >= proposal?.tally?.yes ? 'critical' : 'success',
      label: proposal?.open ? 'Open' : proposal?.executed ? 'Executed' : proposal?.tally!.no >= proposal?.tally!.yes ? 'Defeated' : 'To Execute',
    }
  }


  return (
    <div className="w-full">
      <div className="flex flex-row pb-2 h-16 items-center">
        <div className="flex flex-grow">
          <span className="text-xl font-semibold text-neutral-700 pt-1">
            Proposal {proposalNumber + 1}
          </span>
          <div className="pl-5">
            {/** bg-info-400 bg-success-400 bg-critical-400 */}
            {proposal.tally && (
              <AlertInline
                className={`border border-${getProposalVariantStatus((proposal as Proposal)).variant}-400 py-2 px-4 rounded-xl`}
                message={getProposalVariantStatus((proposal as Proposal)).label}
                variant={getProposalVariantStatus((proposal as Proposal)).variant}
              />
            )}
          </div>
        </div>
        <div className="flex ">
          {userCanVeto ?
            <Button
              className="flex h-5 items-center"
              size="lg"
              variant="primary"
              onClick={() => vetoWrite()}
            >Veto</Button>
            : (
              <div className="flex items-center align-center">
                <span className="text-lg text-neutral-800 font-semibold pr-4">Vetoed: </span>
                <Button
                  className="flex h-5 items-center"
                  size="lg"
                  disabled
                  variant={`success`}
                >Veto</Button>
              </div>
            )}
        </div>
      </div>
      <h4 className="mb-1 text-3xl text-neutral-900 font-semibold">
        {proposal.title}
      </h4>
      <p className="text-base text-l text-body-color dark:text-dark-6">
        Proposed by
        <span className="text-primary-400 font-semibold underline"> {formatAddress(proposal.args?.creator)} </span>
        until
        <span className="text-primary-400 font-semibold"> {dayjs(Number(proposal.parameters?.endDate) * 1000).format('DD/MM/YYYY')}</span>
      </p>
    </div>
  )
}

export default ProposalHeader;
