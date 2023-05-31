import { useDispatch, useSelector } from 'react-redux';
import { changeObjective } from '../../../store';

function ObjectiveInput () {

    const dispatch = useDispatch();
    const objective = useSelector((state) => {
        return state.objective.objective_;
    });

    const handleChange = (e) => {
        dispatch(changeObjective(e.target.value));
    }

    return <div>
        <p>
            Especifique o objetivo do contrato:
             <input 
                //value={state}
                value={objective} 
                onChange={handleChange} 
            />
        </p>
    </div>

}

export default ObjectiveInput;