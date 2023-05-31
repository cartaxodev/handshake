import { useDispatch, useSelector } from "react-redux";
import { removeMember, changeMemberLogin, changeMemberMainAddress } from "../../../store";

function MemberForm ({ memberId }) {

    const dispatch = useDispatch();
    const member = useSelector((state) => {
        const members = state.memberList.memberList_;
        for (let m of members) {
            if (m._id === memberId) {
                return m;
            }
        }
    })

    const handleLoginChange = (e) => {

        dispatch(changeMemberLogin({
            _id: memberId,
            _login: e.target.value
        }));
    }

    const handleAddressChange = (e) => {

        dispatch(changeMemberMainAddress({
            _id: memberId,
            _mainAddress: e.target.value
        }))
    }

    const handleRemove = (e) => {
        dispatch(removeMember(memberId));
    }

    return <div>
        <p> ID: {memberId} </p>
            <div>
                Login: <input 
                            value={member._login}
                            onChange={handleLoginChange} 
                        />
            </div>
            <div>
                Wallet Address: <input  
                                    value={member._mainAddress} 
                                    onChange={handleAddressChange} 
                                />
            </div>
            <div>
                <button onClick={handleRemove}>Remove Membro</button>
            </div>

    </div>

}

export default MemberForm;