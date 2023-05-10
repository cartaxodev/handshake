import { useState } from "react";


function MemberForm ({ memberIndex, state, setState }) {

    const [loginState, setLoginState] = useState("");
    const [addressState, setAddressState] = useState("");

    const handleLoginChange = (event) => {
        setLoginState(event.target.value);
        setState(memberIndex, {
            _id: memberIndex,
            _login: event.target.value,
            _mainAddress: addressState,
            _secondaryAddresses: []
        });
    }

    const handleAddressChange = (event) => {
        setAddressState(event.target.value);
        setState(memberIndex, {
            _id: memberIndex,
            _login: loginState,
            _mainAddress: event.target.value,
            _secondaryAddresses: []
        });
    }

    return <div>
        <p>
            <div>
                Login: <input value={state._login} onChange={handleLoginChange} />
            </div>
            <div>
                Wallet Address: <input value={state._mainAddress} onChange={handleAddressChange} />
            </div>
        </p>
    </div>

}

export default MemberForm;