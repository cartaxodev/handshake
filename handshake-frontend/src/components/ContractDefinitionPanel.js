import MemberList from './nativeParams/memberList_/MemberList';
import ObjectiveInput from './nativeParams/objective_/ObjectiveInput';
import MemberListControllerAccordion from './features/memberListController/MemberListControllerAccordion';
import DepositSchedulerAccordion from './features/depositScheduler/DepositSchedulerAccordion';
import WithdrawalControllerAccordion from './features/withdrawalController/WithdrawalControllerAccordion';


function ContractDefinitionPanel ({ contractTemplate }) {

    let nativeParamsComponents;
    let featuresComponents;

    if (contractTemplate.nativeParams) {
        nativeParamsComponents = contractTemplate.nativeParams.map((param, index) => {
            if (param.name === "objective_") {
                return (
                    <div>
                        <ObjectiveInput key={param.name}/>
                    </div>
                );
            }
            if (param.name === "memberList_") {
                return (
                    <div>
                        <MemberList key={param.name}/>
                    </div>
                );
            }
        });
    }

    if (contractTemplate.features) {
        featuresComponents = contractTemplate.features.map((feature, index) => {
            if (feature === "memberListController") {
                return (
                    <div>
                        <MemberListControllerAccordion key={feature}/>
                    </div>
                )
            }
            if (feature === "depositScheduler") {
                return (
                    <div>
                        <DepositSchedulerAccordion key={feature}/>
                    </div>
                )
            }
            if (feature === "withdrawalController") {
                return (
                    <div>
                        <WithdrawalControllerAccordion key={feature}/>
                    </div>
                )
            }
        });
    }

    return (
        <div>
            {nativeParamsComponents}
            {featuresComponents}
        </div>);
}

export default ContractDefinitionPanel;