import MemberList from './nativeParams/MemberList';
import ObjectiveInput from './nativeParams/ObjectiveInput';


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