import { useState } from "react";
import MemberForm from "./MemberForm";



function MemberList ({ state, setState }) {

    const [nextId, setNextId] = useState(0);

    const setMemberState = (memberId, newMemberState) => {
        
        const members = [];
        for (let member of state) {
            if (member._id === memberId) {
                members.push(newMemberState);
            }
            else {
                members.push(member);
            }
        }

        setState("memberList_", members);
    }

    const handleAddMemberClick = (e) => {
        const members = []
        if (state !== "") {
            let el;
            for (el of state) {
                members.push(el);
            }
        }
        const newMember = {
            _id: getNextId(),
            _login: "",
            _mainAddress: "",
            _secondaryAddresses: []
        }
        members.push(newMember);
        setState("memberList_", members);
    }

    const getNextId = () => {
        setNextId(nextId + 1);
        return nextId;
    }

    const removeMember = (memberId) => {
        const members = state.filter((member) => {
            return (member._id !== memberId);
        });

        setState("memberList_", members);
    }

    let memberInputs = []

    if (state !== "") {
        memberInputs = state.map((member, index) => {
            return (
            <div key={index}>
                <MemberForm 
                            state={member} 
                            setState={setMemberState}
                            removeMember={removeMember} />
            </div>
            );
        });
    }
    
    return <div>
            Informe abaixo os dados de cada membro participante do contrato:
            {memberInputs}
        <p>
            <button onClick={handleAddMemberClick}>Add Novo Membro</button>
        </p>
    </div>

}

export default MemberList;