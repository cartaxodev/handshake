
function MemberForm ({ state, setState, removeMember }) {

    const handleLoginChange = (e) => {
        setState(state._id, {
            _id: state._id,
            _login: e.target.value,
            _mainAddress: state._mainAddress,
            _secondaryAddresses: []
        });
    }

    const handleAddressChange = (e) => {
        setState(state._id, {
            _id: state._id,
            _login: state._login,
            _mainAddress: e.target.value,
            _secondaryAddresses: []
        });
    }

    const handleRemove = (e) => {
        removeMember(state._id);
    }

    return <div>
        <p/>
            <div>
                Login: <input value={state._login} onChange={handleLoginChange} />
            </div>
            <div>
                Wallet Address: <input value={state._mainAddress} onChange={handleAddressChange} />
            </div>
            <div>
                <button onClick={handleRemove}>Remove Membro</button>
            </div>

    </div>

}

export default MemberForm;