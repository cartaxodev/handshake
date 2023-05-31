import DeadlineControlConfigForm from './featuresParams/deadlineControlConfig_/DeadlineControlConfigForm';
import DepositSchedulePanel from './featuresParams/depositSchedule_/DepositSchedulePanel';
import MaxWithdrawValueInput from './featuresParams/maxWithdrawValue_/MaxWithdrawValueInput';
import MemberManagerList from './featuresParams/memberManagers_/MemberManagerList';
import MinApprovalsToAddInput from './featuresParams/minApprovalsToAddNewMember_/MinApprovalsToAddInput';
import MinApprovalsToRemoveInput from './featuresParams/minApprovalsToRemoveMember.js/MinApprovalsToRemoveInput';
import MinApprovalsToWithdrawInput from './featuresParams/minApprovalsToWithdraw_/MinApprovalsToWithdrawInput';
import WithdrawalApproversList from './featuresParams/withdrawalApprovers_/WithdrawalApproversList';
import MemberList from './nativeParams/memberList_/MemberList';
import ObjectiveInput from './nativeParams/objective_/ObjectiveInput';


function ContractDefinitionPanel ({ contractDefinitionState }) {

    const childComponents = contractDefinitionState.map((param, index) => {
        if (param.name === "objective_") {
            return (
                <div key={param.name}>
                    <ObjectiveInput />
                </div>
            );
        }
        if (param.name === "memberList_") {
            return (
                <div key={param.name}>
                    <MemberList />
                </div>
            );
        }
        if (param.name === "memberManagers_") {
            return (
                <div key={param.name}>
                    <MemberManagerList />
                </div>
            )
        }
        if (param.name === "minApprovalsToAddNewMember_") {
            return (
                <div key={param.name}>
                    <MinApprovalsToAddInput />
                </div>
            )
        }
        if (param.name === "minApprovalsToRemoveMember_") {
            return (
                <div key={param.name}>
                    <MinApprovalsToRemoveInput />
                </div>
            )
        }
        if (param.name === "maxWithdrawValue_") {
            return (
                <div key={param.name}>
                    <MaxWithdrawValueInput />
                </div>
            )
        }
        if (param.name === "minApprovalsToWithdraw_") {
            return (
                <div key={param.name}>
                    <MinApprovalsToWithdrawInput />
                </div>
            )
        }
        if (param.name === "withdrawalApprovers_") {
            return (
                <div key={param.name}>
                    <WithdrawalApproversList />
                </div>
            )
        }
        if (param.name === "deadlineControlConfig_") {
            return (
                <div key={param.name}>
                    <DeadlineControlConfigForm />
                </div>
            )
        }
        if (param.name === "depositSchedule_") {
            return (
                <div key={param.name}>
                    <DepositSchedulePanel />
                </div>
            )
        }

        return <div>No data into contract definition template</div>
    });

    if (contractDefinitionState.length > 0) {
        return (
            <div>
                {childComponents}
            </div>);
    }
}

export default ContractDefinitionPanel;