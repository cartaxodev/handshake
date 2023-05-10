import MemberForm from "./MemberForm";



function MemberList ({ state, setState }) {

    const setMemberState = (memberIndex, newMemberState) => {
        
        const members = [];
        for (let i = 0; i < state.length; i++) {
            if (i === memberIndex) {
                members.push(newMemberState);
            }
            else {
                members.push(state[i]);
            }
        }

        setState("memberList_", members);
    }

    const handleClick = (event) => {
        const members = []
        if (state !== "") {
            let el;
            for (el of state) {
                members.push(el);
            }
        }
        const newMember = {
            _id: 0,
            _login: "",
            _mainAddress: "",
            _secondaryAddresses: []
        }
        members.push(newMember);
        setState("memberList_", members);
    }

    let memberInputs = []

    if (state !== "") {
        memberInputs = state.map((member, index) => {
            return (
            <div key={index}>
                <MemberForm memberIndex={index} state={member} setState={setMemberState} />
            </div>
            );
        });
    }
    
    return <div>
            Informe abaixo os dados de cada membro participante do contrato:
            {memberInputs}
        <p>
            <button onClick={handleClick}>Add Novo Membro</button>
        </p>
    </div>

}

export default MemberList;