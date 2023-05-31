import MemberForm from "./MemberForm";
import { useDispatch, useSelector } from "react-redux";
import { addMember } from "../../../store";

function MemberList () {

    const dispatch = useDispatch();
    const memberList = useSelector((state) => {
        return state.memberList.memberList_;
    });

    const handleAddMemberClick = (e) => {

        dispatch(addMember({
                _login: "",
                _mainAddress: "",
                _secondaryAddresses: []
            }));
    }

    let memberInputs = memberList.map((member, index) => {
        return (
        <div key={index}>
            <MemberForm 
                memberId={member._id} />
        </div>
        );
    });
    
    return <div>
            Informe abaixo os dados de cada membro participante do contrato:
            {memberInputs}
        <p>
            <button onClick={handleAddMemberClick}>Add Novo Membro</button>
        </p>
    </div>

}

export default MemberList;