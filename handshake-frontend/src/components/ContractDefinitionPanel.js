import MemberList from './nativeParams/memberList_/MemberList';
import ObjectiveInput from './nativeParams/objective_/ObjectiveInput';
import MemberListControllerAccordion from './features/memberListController/MemberListControllerAccordion';
import DepositSchedulerAccordion from './features/depositScheduler/DepositSchedulerAccordion';
import WithdrawalControllerAccordion from './features/withdrawalController/WithdrawalControllerAccordion';

//Redux
import { useDispatch } from 'react-redux';
import { changeObjective } from '../store';


function ContractDefinitionPanel ({ contractTemplate }) {

    const dispatch = useDispatch();

    let nativeParamsComponents;
    let featuresComponents;

    if (contractTemplate.nativeParams) {
        nativeParamsComponents = contractTemplate.nativeParams.map((param, index) => {
            if (param.name === "objective_") {

                if (contractTemplate.description) {
                    dispatch(changeObjective(contractTemplate.description));
                }
                
                return (
                    <div>
                        <ObjectiveInput 
                            key={param.name}
                            objectiveFields={contractTemplate.objectiveFields}
                            defaultObjective={contractTemplate.description}
                            />
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