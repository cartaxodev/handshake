import DeadlineControlConfigForm from './featuresParams/deadlineControlConfig_/DeadlineControlConfigForm';
import DepositSchedulePanel from './featuresParams/depositSchedule_/DepositSchedulePanel';
import MaxWithdrawValueInput from './featuresParams/maxWithdrawValue_/MaxWithdrawValueInput';
import MemberManagerList from './featuresParams/memberManager_/MemberManagerList';
import MinApprovalsToAddInput from './featuresParams/minApprovalsToAddNewMember_/MinApprovalsToAddInput';
import MinApprovalsToRemoveInput from './featuresParams/minApprovalsToRemoveMember.js/MinApprovalsToRemoveInput';
import MinApprovalsToWithdrawInput from './featuresParams/minApprovalsToWithdraw_/MinApprovalsToWithdrawInput';
import WithdrawalApproversList from './featuresParams/withdrawalApprovers_/WithdrawalApproversList';
import MemberList from './nativeParams/memberList_/MemberList';
import ObjectiveInput from './nativeParams/objective_/ObjectiveInput';


function ContractDefinitionPanel ({ contractDefinitionState, setContractDefinitionState }) {

    //Generic function to be called into the child components.
    //Each child component only updates its specific param on contract definition state.
    const setState = (paramName_, newValue_) => {

        const newState = [];
        let currentParam;
        for (currentParam of contractDefinitionState) {
            const newParam = {};
            newParam.name = currentParam.name;
            if (currentParam.name === paramName_) {
                newParam.stateValue = newValue_;
            }
            else {
                newParam.stateValue = currentParam.stateValue;
            }
            newState.push(newParam);
        }

        setContractDefinitionState(newState);
    }

    const childComponents = contractDefinitionState.map((param, index) => {
        if (param.name === "objective_") {
            return (
                <div key={param.name}>
                    <ObjectiveInput state={param.stateValue} setState={setState} />
                </div>
            );
        }
        if (param.name === "memberList_") {
            return (
                <div key={param.name}>
                    <MemberList state={param.stateValue} setState={setState} />
                </div>
            );
        }
        if (param.name === "memberManagers_") {
            let p;
            for (p of contractDefinitionState){
                if (p.name === "memberList_") {
                    break;
                }
            }
            return (
                <div key={param.name}>
                    <MemberManagerList state={param.stateValue} setState={setState} members={p.stateValue} />
                </div>
            )
        }
        if (param.name === "minApprovalsToAddNewMember_") {
            return (
                <div key={param.name}>
                    <MinApprovalsToAddInput state={param.stateValue} setState={setState} />
                </div>
            )
        }
        if (param.name === "minApprovalsToRemoveMember_") {
            return (
                <div key={param.name}>
                    <MinApprovalsToRemoveInput state={param.stateValue} setState={setState} />
                </div>
            )
        }
        if (param.name === "maxWithdrawValue_") {
            return (
                <div key={param.name}>
                    <MaxWithdrawValueInput state={param.stateValue} setState={setState} />
                </div>
            )
        }
        if (param.name === "minApprovalsToWithdraw_") {
            return (
                <div key={param.name}>
                    <MinApprovalsToWithdrawInput state={param.stateValue} setState={setState} />
                </div>
            )
        }
        if (param.name === "withdrawalApprovers_") {
            let p;
            for (p of contractDefinitionState){
                if (p.name === "memberList_") {
                    break;
                }
            }
            return (
                <div key={param.name}>
                    <WithdrawalApproversList state={param.stateValue} setState={setState} members={p.stateValue} />
                </div>
            )
        }
        if (param.name === "deadlineControlConfig_") {
            return (
                <div key={param.name}>
                    <DeadlineControlConfigForm state={param.stateValue} setState={setState} />
                </div>
            )
        }
        if (param.name === "depositSchedule_") {
            return (
                <div key={param.name}>
                    <DepositSchedulePanel state={param.stateValue} setState={setState} />
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