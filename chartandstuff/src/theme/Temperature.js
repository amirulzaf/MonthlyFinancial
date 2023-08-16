import createContext from "../context/createContext";
const reducer = (state,action)=>{

    console.log(action);
    switch(action.type){
        case "toggle":
            return state ? false : true;
    }
    return state;
};

const toggleTemperature = dispatch =>{
    return ()=>{
        dispatch({type:"toggle"});
    };
};

export const {Context,Provider} = createContext(
    reducer,
    {
        toggleTemperature
    },
    false
) ;
