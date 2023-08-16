import { useContext } from "react";
import { Context as ContextTemperature} from "../theme/Temperature";
export default () => {
    const {state, toggleTemperature} = useContext(ContextTemperature);

    function celciousToFahrentheit(celciucTemp){

        return celciucTemp * 9 / 5 + 32
    
    }

    return {
        temperatureState : state,
        toggleTemperature, celciousToFahrentheit 
    }
}
