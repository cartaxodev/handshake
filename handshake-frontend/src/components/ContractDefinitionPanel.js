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
            else if (param.name === "memberList_") {
                return (
                    <div>
                        <MemberList key={param.name}/>
                    </div>
                );
            }
            else return undefined;
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
            else if (feature === "depositScheduler") {
                return (
                    <div>
                        <DepositSchedulerAccordion key={feature}/>
                    </div>
                )
            }
            else if (feature === "withdrawalController") {
                return (
                    <div>
                        <WithdrawalControllerAccordion key={feature}/>
                    </div>
                )
            }
            else return undefined;
        });
    }

    return (
        <div>
            {nativeParamsComponents}
            {featuresComponents}
        </div>);
}

export default ContractDefinitionPanel;